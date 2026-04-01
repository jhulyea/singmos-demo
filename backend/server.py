import io
import os
import tempfile

import numpy as np
import torch
import torchaudio
import soundfile as sf
import ffmpeg

from flask import Flask, request, jsonify
from flask_cors import CORS

# ✅ Import your local model classes
from model_def import MERTEncoder, SingMOSModel

app = Flask(__name__)
CORS(app)

DEVICE = "cpu"  # keep demo stable on Mac
TARGET_SR = 16000
MAX_SECONDS = 10

MOS_MEAN = 3.686596632003784
MOS_STD  = 0.8543179631233215

# ---------- Load model once ----------
encoder = MERTEncoder(device=DEVICE)
model = SingMOSModel(encoder).to(DEVICE)

WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "best_head.pt")
state_dict = torch.load(WEIGHTS_PATH, map_location=DEVICE, weights_only=False)
model.load_state_dict(state_dict)
model.eval()


def to_score_1_to_5(mos: float) -> int:
    s = int(round(mos))
    return max(1, min(5, s))


def decode_any_audio(file_bytes: bytes) -> np.ndarray:
    """
    Decode audio bytes (wav/webm/ogg/etc) into float32 mono waveform at TARGET_SR using ffmpeg.
    Returns: np.ndarray shape (T,)
    """
    # write bytes to temp file
    with tempfile.NamedTemporaryFile(suffix=".bin", delete=False) as tmp_in:
        tmp_in.write(file_bytes)
        in_path = tmp_in.name

    try:
        out_wav_bytes, _ = (
            ffmpeg
            .input(in_path)
            .output(
                "pipe:1",
                format="wav",
                acodec="pcm_s16le",
                ac=1,            # mono
                ar=TARGET_SR     # resample here
            )
            .run(capture_stdout=True, capture_stderr=True)
        )
        wav, sr = sf.read(io.BytesIO(out_wav_bytes), dtype="float32", always_2d=False)
        if wav.ndim == 2:
            wav = wav.mean(axis=1)
        # sr should already be TARGET_SR
        return wav.astype(np.float32)
    finally:
        try:
            os.remove(in_path)
        except Exception:
            pass


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.post("/score")
def score():
    if "audio" not in request.files:
        return jsonify({"error": "missing file field 'audio'"}), 400

    data = request.files["audio"].read()
    wav_np = decode_any_audio(data)

    # clip for demo stability
    max_len = TARGET_SR * MAX_SECONDS
    if wav_np.shape[0] > max_len:
        wav_np = wav_np[:max_len]

    wav = torch.from_numpy(wav_np).unsqueeze(0)  # (1, T)
    mask = torch.ones_like(wav, dtype=torch.bool)

    with torch.no_grad():
        z_hat = float(model(wav.to(DEVICE), mask.to(DEVICE)).item())

    # invert z-score -> MOS
    mos = z_hat * MOS_STD + MOS_MEAN
    mos = float(np.clip(mos, 1.0, 5.0))

    return jsonify({
        "z_hat": z_hat,
        "mos": mos,
        "score_1_to_5": to_score_1_to_5(mos),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)