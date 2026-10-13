# PuzzlePanic — Arcade Territory Capture Game

PuzzlePanic is a fast-paced, arcade territory-capture game inspired by classic Qix / Gals Panic formulas, built with React, Vite, TypeScript, Tailwind CSS, and HTML5 Canvas.

## Features

1. **5 Thematic Worlds & Backgrounds (9:16 Vertical Arcade View)**:
   - **Neon Circuit** (Uses the exact uploaded `1_Neon circuit.jpg` cyberpunk city background)
   - **Jungle Ruins** (Ancient temple ruins background)
   - **Deep Sea** (Underwater coral reef background)
   - **Sky Pirates** (Floating islands background)
   - **Lava Cavern** (Molten lava background)

2. **Core Territory Capture Loop**:
   - Auto-draw movement model: stepping off safe territory creates an exposed vulnerable trail.
   - Reconnect trail to safe territory to claim enclosed regions.
   - Flood-fill region detection algorithm that checks enemy occupancy in captured loops.
   - Target 80% capture to clear stages.

3. **Gamepad & Mobile Support**:
   - Built-in Gamepad API support for USB/Bluetooth gamepads (Xbox, PlayStation, etc.).
   - On-screen touch D-Pad optimized for vertical 9:16 mobile play.

4. **Audio & Settings**:
   - Synthesized retro arcade sound effects and music loops using the Web Audio API.
   - Settings for music/SFX volume, screen shake, and CRT scanlines.
