import { StageConfig } from '../types';

export const STAGES: StageConfig[] = [
  // --- THEME 1: NEON CIRCUIT ---
  {
    stageId: 'neon_1',
    theme: 'neon_circuit',
    levelNumber: 1,
    displayName: 'Neon Circuit — Sector 1',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 90,
    backgroundImage: '1_Neon circuit.jpg',
    enemies: [
      { id: 'n1-1', type: 'drone', speed: 2.2, chargeFrequency: 7, chargeType: 'lock_on_dash' }
    ]
  },
  {
    stageId: 'neon_2',
    theme: 'neon_circuit',
    levelNumber: 2,
    displayName: 'Neon Circuit — Sector 2',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 85,
    backgroundImage: '1_Neon circuit.jpg',
    enemies: [
      { id: 'n2-1', type: 'drone', speed: 2.6, chargeFrequency: 6, chargeType: 'lock_on_dash' },
      { id: 'n2-2', type: 'drone', speed: 2.4, chargeFrequency: 8, chargeType: 'lock_on_dash' }
    ]
  },

  // --- THEME 2: JUNGLE RUINS ---
  {
    stageId: 'jungle_1',
    theme: 'jungle_ruins',
    levelNumber: 3,
    displayName: 'Jungle Ruins — Temple Gate',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 90,
    backgroundImage: 'Jungle ruins.jpg',
    enemies: [
      { id: 'j1-1', type: 'beetle', speed: 2.5, chargeFrequency: 7, chargeType: 'straight_dash' }
    ]
  },
  {
    stageId: 'jungle_2',
    theme: 'jungle_ruins',
    levelNumber: 4,
    displayName: 'Jungle Ruins — Deep Sanctuary',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 85,
    backgroundImage: 'Jungle ruins.jpg',
    enemies: [
      { id: 'j2-1', type: 'beetle', speed: 2.8, chargeFrequency: 6, chargeType: 'straight_dash' },
      { id: 'j2-2', type: 'beetle', speed: 2.5, chargeFrequency: 7, chargeType: 'straight_dash' }
    ]
  },

  // --- THEME 3: DEEP SEA ---
  {
    stageId: 'sea_1',
    theme: 'deep_sea',
    levelNumber: 5,
    displayName: 'Deep Sea — Coral Trench',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 90,
    backgroundImage: 'Deep sea.jpg',
    enemies: [
      { id: 's1-1', type: 'ray', speed: 2.7, chargeFrequency: 6, chargeType: 'electric_surge' }
    ]
  },
  {
    stageId: 'sea_2',
    theme: 'deep_sea',
    levelNumber: 6,
    displayName: 'Deep Sea — Sunken City',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 85,
    backgroundImage: 'Deep sea.jpg',
    enemies: [
      { id: 's2-1', type: 'ray', speed: 3.0, chargeFrequency: 5, chargeType: 'electric_surge' },
      { id: 's2-2', type: 'ray', speed: 2.6, chargeFrequency: 7, chargeType: 'electric_surge' }
    ]
  },

  // --- THEME 4: SKY PIRATES ---
  {
    stageId: 'sky_1',
    theme: 'sky_pirates',
    levelNumber: 7,
    displayName: 'Sky Pirates — Cloud Dock',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 90,
    backgroundImage: 'Sky pirates.png',
    enemies: [
      { id: 'p1-1', type: 'ramship', speed: 2.9, chargeFrequency: 6, chargeType: 'ram' }
    ]
  },
  {
    stageId: 'sky_2',
    theme: 'sky_pirates',
    levelNumber: 8,
    displayName: 'Sky Pirates — Armada Fleet',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 80,
    backgroundImage: 'Sky pirates.png',
    enemies: [
      { id: 'p2-1', type: 'ramship', speed: 3.2, chargeFrequency: 5, chargeType: 'ram' },
      { id: 'p2-2', type: 'ramship', speed: 2.8, chargeFrequency: 6, chargeType: 'ram' }
    ]
  },

  // --- THEME 5: LAVA CAVERN ---
  {
    stageId: 'lava_1',
    theme: 'lava_cavern',
    levelNumber: 9,
    displayName: 'Lava Cavern — Magma Flow',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 90,
    backgroundImage: 'Lava cavern.jpg',
    enemies: [
      { id: 'l1-1', type: 'golem', speed: 3.0, chargeFrequency: 5, chargeType: 'straight_dash' }
    ]
  },
  {
    stageId: 'lava_2',
    theme: 'lava_cavern',
    levelNumber: 10,
    displayName: 'Lava Cavern — Core Chamber',
    gridWidth: 32,
    gridHeight: 20,
    targetCapture: 80,
    timerSeconds: 75,
    backgroundImage: 'Lava cavern.jpg',
    enemies: [
      { id: 'l2-1', type: 'golem', speed: 3.4, chargeFrequency: 4, chargeType: 'straight_dash' },
      { id: 'l2-2', type: 'golem', speed: 3.0, chargeFrequency: 6, chargeType: 'straight_dash' }
    ]
  }
];
