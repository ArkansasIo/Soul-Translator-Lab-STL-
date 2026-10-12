"""Research notes and high-level brain-system reference."""
BRAIN_SYSTEMS = [
    {"system": "Cerebral cortex", "overview": "Supports distributed functions including perception, language, planning, and voluntary action.", "caution": "No complex mental function maps neatly to one isolated region."},
    {"system": "Hippocampal formation", "overview": "Important for forming and organizing many kinds of episodic and spatial memories.", "caution": "Memory is distributed and reconstructive, not a file that can simply be copied."},
    {"system": "Thalamus", "overview": "Relays and coordinates many information streams and participates in arousal and cortical dynamics.", "caution": "It is part of interacting circuits, not a single consciousness switch."},
    {"system": "Brainstem and arousal networks", "overview": "Support vital functions, wakefulness, and levels of arousal.", "caution": "Wakefulness and awareness are related but distinct concepts."},
    {"system": "Basal ganglia", "overview": "Contribute to action selection, reinforcement learning, and movement control.", "caution": "Functions emerge from loops involving cortex and other structures."},
    {"system": "Cerebellum", "overview": "Contributes to coordination, timing, motor learning, and some cognitive processes.", "caution": "Its role extends beyond simple movement correction."},
    {"system": "Amygdala and related networks", "overview": "Help process biologically relevant stimuli and aspects of learning and emotion.", "caution": "The amygdala is not simply a fear center."},
]
RESEARCH_TOPICS = [
    ("Neurons and synapses", "Neurons communicate through electrical activity and chemical synapses. Neural activity is dynamic and depends on cell type, circuit, state, and context."),
    ("Memory", "Memory involves encoding, consolidation, storage, and retrieval across interacting systems. Recall can be reconstructive; it is not a perfect playback."),
    ("Consciousness", "Research distinguishes wakefulness, conscious contents, and reportability. There is no universally accepted complete theory of consciousness."),
    ("Brain-computer interfaces (BCIs)", "BCIs infer limited intended actions or stimulus-related information from measured neural signals. Performance depends on sensors, training, task, and context."),
    ("Neuroimaging", "EEG measures scalp electrical potentials with high temporal resolution but limited spatial precision. fMRI measures blood-oxygenation-related signals indirectly and more slowly."),
    ("Neuroethics and privacy", "Neural data can be sensitive. Research should use informed consent, data minimization, secure storage, and careful limits on claims."),
]
SOURCES = [
    ("National Institute of Neurological Disorders and Stroke — Brain Basics", "https://www.ninds.nih.gov/health-information/public-education/brain-basics"),
    ("NIH BRAIN Initiative", "https://braininitiative.nih.gov/"),
    ("National Institute of Mental Health", "https://www.nimh.nih.gov/"),
    ("National Academies", "https://nap.nationalacademies.org/"),
]
def print_research() -> None:
    print("\n=== BRAIN SYSTEMS ===")
    for item in BRAIN_SYSTEMS:
        print(f"\n{item['system']}\n  {item['overview']}\n  Caution: {item['caution']}")
    print("\n=== RESEARCH TOPICS ===")
    for title, description in RESEARCH_TOPICS:
        print(f"\n{title}\n  {description}")
    print("\n=== STARTING SOURCES ===")
    for title, url in SOURCES:
        print(f"- {title}: {url}")
