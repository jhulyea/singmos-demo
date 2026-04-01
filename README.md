# Pitch Perfect

**Live demo: [pitchperfect.minn.codes](https://pitchperfect.minn.codes/)**

An interactive singing voice scorer built for a live demo. Record yourself singing, and a fine-tuned ML model rates your performance with a **Mean Opinion Score (MOS)** from 1 to 5 — complete with meme reactions, fireworks, and a leaderboard.

---

## What It Does

- **Record** a clip of yourself singing (up to 10 seconds) directly in the browser
- **Score** the audio using a fine-tuned [MERT-v1-95M](https://huggingface.co/m-a-p/MERT-v1-95M) model that predicts a MOS (1–5)
- **React** with tiered meme animations based on your score (`cooked` / `mid` / `good` / `legend`)
- **Compete** on a live in-session leaderboard

---

## Architecture

```
frontend/   ← React + Vite UI (browser recording, score display, leaderboard)
backend/    ← Flask API (audio decoding, MERT inference, MOS prediction)
```

The frontend records audio via the browser's MediaRecorder API and POSTs it to the backend `/score` endpoint. The backend decodes any audio format (wav, webm, ogg…) via ffmpeg, runs it through the model, and returns a MOS score.

---

## Model

The scoring model is a fine-tuned regression head on top of [MERT-v1-95M](https://huggingface.co/m-a-p/MERT-v1-95M):

- **Encoder**: MERT (frozen), averaging the last 4 hidden layers → frame embeddings
- **Pooling**: Attention pooling over time (`AttnPool`)
- **Regressor**: 3-layer MLP (768 → 512 → 128 → 1), trained to predict z-scored MOS
- **Output**: MOS clipped to [1.0, 5.0], de-standardised using training set statistics

Score tiers:

| MOS | Tier |
|-----|------|
| ≥ 4.0 | Legend |
| ≥ 3.3 | Good |
| ≥ 2.5 | Mid |
| < 2.5 | Cooked |

---

## Running Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python server.py
# Runs on http://localhost:7860
```

Requires `ffmpeg` to be installed on your system (`brew install ffmpeg` on macOS).

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Point the frontend at your backend by setting the API base URL in `App.jsx` (defaults to the deployed Hugging Face Space).

---

## API

### `POST /score`

Upload an audio file and receive a MOS score.

**Request** — multipart form data:

| Field | Type | Description |
|-------|------|-------------|
| `audio` | file | Audio clip (wav, webm, ogg, etc.) |

**Response** — JSON:

```json
{
  "mos": 3.72,
  "z_hat": 0.04,
  "score_1_to_5": 4
}
```

### `GET /health`

Returns `{"ok": true}` when the server is up.

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite 7 |
| Backend | Python 3.11, Flask, PyTorch, Transformers |
| Model | MERT-v1-95M + custom regression head |
| Audio | ffmpeg, torchaudio, soundfile |
| Deployment | Docker (backend), Hugging Face Spaces |
