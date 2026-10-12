"""A deliberately simple toy model of noisy neural measurements.

This is not a physiological brain model and does not infer mental content.
"""
from dataclasses import asdict
from random import Random
from .models import BrainSignal

class ToySignalModel:
    def __init__(self, seed: int = 7):
        self._rng = Random(seed)

    def sample(self, channel: str = "demo-channel", amplitude: float = 1.0,
               noise_sd: float = 0.15) -> BrainSignal:
        if noise_sd < 0:
            raise ValueError("noise_sd must be >= 0")
        noise = self._rng.gauss(0.0, noise_sd)
        return BrainSignal(channel=channel, amplitude=amplitude + noise, noise=noise)

    @staticmethod
    def to_dict(signal: BrainSignal) -> dict:
        return asdict(signal)
