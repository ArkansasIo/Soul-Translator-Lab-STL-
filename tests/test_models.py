"""Unit tests for the educational state and synthetic signal model."""
import unittest

from stl_lab.brain_model import ToySignalModel
from stl_lab.models import AgentState
from stl_lab.world import VirtualWorld


class AgentStateTests(unittest.TestCase):
    def test_learning_is_bounded_at_one(self):
        agent = AgentState(name="test")
        self.assertAlmostEqual(agent.learn("navigation", 0.6), 0.6)
        self.assertEqual(agent.learn("navigation", 0.7), 1.0)

    def test_negative_learning_is_rejected(self):
        with self.assertRaises(ValueError):
            AgentState(name="test").learn("navigation", -0.1)

    def test_empty_memory_is_ignored_and_text_is_trimmed(self):
        agent = AgentState(name="test")
        agent.remember("   ")
        agent.remember("  simulated event  ")
        self.assertEqual(agent.memories, ["simulated event"])


class WorldTests(unittest.TestCase):
    def test_accelerated_time(self):
        agent = AgentState(name="test")
        world = VirtualWorld(acceleration_ratio=25)
        self.assertEqual(world.advance(agent, 2), 50)
        self.assertEqual(agent.world_time_seconds, 50)

    def test_invalid_ratio_and_negative_time(self):
        with self.assertRaises(ValueError):
            VirtualWorld(acceleration_ratio=0)
        with self.assertRaises(ValueError):
            VirtualWorld().advance(AgentState(name="test"), -1)


class SignalModelTests(unittest.TestCase):
    def test_seeded_samples_are_reproducible(self):
        a = ToySignalModel(seed=42).sample()
        b = ToySignalModel(seed=42).sample()
        self.assertEqual(a.amplitude, b.amplitude)
        self.assertEqual(a.noise, b.noise)

    def test_negative_noise_is_rejected(self):
        with self.assertRaises(ValueError):
            ToySignalModel().sample(noise_sd=-0.1)

    def test_output_is_explicitly_synthetic_model_data(self):
        model = ToySignalModel(seed=3)
        signal = model.sample(channel="synthetic-test", amplitude=0.5, noise_sd=0)
        self.assertEqual(signal.channel, "synthetic-test")
        self.assertEqual(signal.amplitude, 0.5)
        self.assertEqual(signal.noise, 0.0)


if __name__ == "__main__":
    unittest.main()
