# Paste your EXACT model code below (from your notebook)

# 1) Any imports used by the model classes
import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel
import torchaudio
# (add any other imports your classes use)

# 2) Paste the full class definitions EXACTLY:
class MERTEncoder(nn.Module):
    def __init__(self, model_name="m-a-p/MERT-v1-95M", layer_mode="last4", device=None):
        super().__init__()
        self.model = AutoModel.from_pretrained(model_name, trust_remote_code=True)
        if device is not None:
            self.model = self.model.to(device)
        self.model.eval()
        for p in self.model.parameters():
            p.requires_grad = False
        self.layer_mode = layer_mode
        self.hidden_size = self.model.config.hidden_size

    def forward(self, wav, mask):
        dev = next(self.model.parameters()).device
        wav = wav.to(dev)
        mask = mask.to(dev)

        outputs = self.model(
            wav,
            attention_mask=mask,
            output_hidden_states=True,
            return_dict=True
        )

        if self.layer_mode == "last":
            h = outputs.last_hidden_state
        elif self.layer_mode == "last4":
            h = torch.stack(outputs.hidden_states[-4:]).mean(dim=0)
        else:
            raise ValueError(f"Unknown layer_mode: {self.layer_mode}")

        return h

# attnpool
class AttnPool(nn.Module):
    """
    Attention pooling over time.
    h: (B, T, D)
    frame_mask: (B, T) bool, True = valid frame
    returns: (B, D)
    """
    def __init__(self, D, hidden=128):
        super().__init__()
        self.scorer = nn.Sequential(
            nn.Linear(D, hidden),
            nn.Tanh(),
            nn.Linear(hidden, 1)
        )

    def forward(self, h, frame_mask=None):
        # scores: (B, T)
        scores = self.scorer(h).squeeze(-1)

        if frame_mask is not None:
            # mask out invalid frames
            scores = scores.masked_fill(~frame_mask, -1e9)

        w = torch.softmax(scores, dim=1)               # (B, T)
        pooled = torch.bmm(w.unsqueeze(1), h).squeeze(1)  # (B, D)
        return pooled

# MOSregressor
class MOSRegressor(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )

    def forward(self, x):
        return self.net(x).squeeze(-1)

# class SingMOSModel(...):
class SingMOSModel(nn.Module):
    def __init__(self, encoder):
        super().__init__()
        self.encoder = encoder
        D = encoder.hidden_size

        # NEW: attention pool
        self.pool = AttnPool(D, hidden=128)

        # pooled is now (B, D), not (B, 2D)
        self.norm = nn.LayerNorm(D)
        self.regressor = MOSRegressor(D)

    def forward(self, wav, mask):
        if not any(p.requires_grad for p in self.encoder.parameters()):
            with torch.no_grad():
                h = self.encoder(wav, mask)
        else:
            h = self.encoder(wav, mask)

        # Convert sample mask (B, L) -> frame mask (B, T)
        h = self.encoder(wav, mask)   # (B, T, D)
        B, T, D = h.shape

        valid_samples = mask.sum(dim=1)
        L = mask.size(1)

        valid_frames = torch.ceil(valid_samples.float() * T / L).clamp(1, T).long()
        frame_mask = torch.arange(T, device=h.device)[None, :] < valid_frames[:, None]

        pooled = self.pool(h, frame_mask=frame_mask)
        pooled = self.norm(pooled)
        raw = self.regressor(pooled)                   # (B,)
        z_hat = self.regressor(pooled)                 # (B,)  standardized prediction
        return z_hat
