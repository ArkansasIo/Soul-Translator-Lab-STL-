# STL-Inspired System Design

## Goal
Build a fictional-concept-inspired educational demo without claiming to access consciousness.

## Components
- `AgentState`: explicit simulation state, memory strings, skill values, and simulated time.
- `VirtualWorld`: time-scaling logic.
- `ToySignalModel`: synthetic noisy scalar signals.
- `research.py`: neuroscience reference notes.
- `cli.py`: text-based menu.

## Data flow
`CLI input -> AgentState / VirtualWorld -> printed simulation output`

`ToySignalModel -> synthetic BrainSignal -> display`

No real brain sensor, network, cloud service, or external data collection is used.

## Future extensions
- JSON save/load for simulated agent.
- A 2D/3D world renderer.
- Synthetic neural time-series and visualization.
- A citation manager for peer-reviewed research.
- Provenance and license metadata for datasets.
