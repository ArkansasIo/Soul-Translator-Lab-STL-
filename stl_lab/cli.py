"""Command-line interface."""
from .models import AgentState
from .world import VirtualWorld
from .brain_model import ToySignalModel
from .research import print_research

def main() -> None:
    print("Soul Translator Lab — educational simulation")
    print("Boundary: this program does not access a real brain or consciousness.")
    agent = AgentState(name="Underworld-01")
    world = VirtualWorld(acceleration_ratio=100.0)
    signals = ToySignalModel()
    while True:
        print("\n1) Advance toy world clock")
        print("2) Teach simulated agent a skill")
        print("3) Add a simulated memory")
        print("4) Sample a toy noisy signal")
        print("5) Read brain research notes")
        print("6) Show agent status")
        print("0) Exit")
        choice = input("> ").strip()
        try:
            if choice == "1":
                seconds = float(input("Real seconds to advance: "))
                elapsed = world.advance(agent, seconds)
                print(f"Toy world advanced {elapsed:.2f} simulated seconds.")
            elif choice == "2":
                topic = input("Skill/topic: ").strip()
                level = agent.learn(topic)
                print(f"Simulated skill level: {level:.2f}")
            elif choice == "3":
                agent.remember(input("Event to remember: "))
                print("Added to the simulated agent's local memory.")
            elif choice == "4":
                signal = signals.sample()
                print(f"Toy signal channel={signal.channel}; amplitude={signal.amplitude:.3f}; noise={signal.noise:.3f}")
                print("This is synthetic random data, not a human neural recording.")
            elif choice == "5":
                print_research()
            elif choice == "6":
                print(f"Name: {agent.name}")
                print(f"Simulated time: {agent.world_time_seconds:.2f} seconds")
                print(f"Skills: {agent.skills}")
                print(f"Memory count: {len(agent.memories)}")
            elif choice == "0":
                print("Goodbye.")
                break
            else:
                print("Choose one of the listed options.")
        except (ValueError, EOFError) as exc:
            print(f"Input error: {exc}")
