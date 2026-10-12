import unittest
from stl_lab.models import AgentState
from stl_lab.world import VirtualWorld
from stl_lab.brain_model import ToySignalModel

class TestWorld(unittest.TestCase):
    def test_acceleration(self):
        agent = AgentState("test")
        world = VirtualWorld(10)
        self.assertEqual(world.advance(agent, 2), 20)
        self.assertEqual(agent.world_time_seconds, 20)

    def test_reject_negative_time(self):
        with self.assertRaises(ValueError):
            VirtualWorld().advance(AgentState("test"), -1)

    def test_learning_caps_at_one(self):
        agent = AgentState("test")
        self.assertEqual(agent.learn("navigation", 2), 1.0)

    def test_signal_is_deterministic_for_seed(self):
        a = ToySignalModel(seed=5).sample()
        b = ToySignalModel(seed=5).sample()
        self.assertEqual(a.amplitude, b.amplitude)

if __name__ == "__main__":
    unittest.main()
