"""Typed data models for the educational simulation."""
from dataclasses import dataclass, field
from typing import Dict, List
import time

@dataclass
class BrainSignal:
    """Toy measurement; not a decoded thought or clinical signal."""
    channel: str
    amplitude: float
    noise: float
    timestamp: float = field(default_factory=time.time)

@dataclass
class AgentState:
    name: str
    age_years: int = 18
    memories: List[str] = field(default_factory=list)
    skills: Dict[str, float] = field(default_factory=dict)
    emotional_state: str = "neutral"
    world_time_seconds: float = 0.0

    def learn(self, topic: str, amount: float = 0.1) -> float:
        if amount < 0:
            raise ValueError("Learning amount cannot be negative.")
        self.skills[topic] = min(1.0, self.skills.get(topic, 0.0) + amount)
        return self.skills[topic]

    def remember(self, event: str) -> None:
        event = event.strip()
        if event:
            self.memories.append(event)
