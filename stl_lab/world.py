"""Toy virtual-world clock and agent simulation."""
from .models import AgentState

class VirtualWorld:
    def __init__(self, acceleration_ratio: float = 1.0):
        if acceleration_ratio <= 0:
            raise ValueError("Acceleration ratio must be positive.")
        self.acceleration_ratio = acceleration_ratio

    def advance(self, agent: AgentState, real_seconds: float) -> float:
        if real_seconds < 0:
            raise ValueError("Time cannot move backwards.")
        elapsed = real_seconds * self.acceleration_ratio
        agent.world_time_seconds += elapsed
        return elapsed
