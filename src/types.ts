export type GameState = 'menu' | 'levelSelect' | 'howToPlay' | 'settings' | 'playing' | 'paused' | 'stageClear' | 'gameOver';

export type ThemeId = 'neon_circuit' | 'jungle_ruins' | 'deep_sea' | 'sky_pirates' | 'lava_cavern';

export interface EnemyConfig {
  id: string;
  type: 'drone' | 'beetle' | 'ray' | 'ramship' | 'golem';
  speed: number; // cells per second
  chargeFrequency: number; // seconds between charge attempts
  chargeType: 'lock_on_dash' | 'straight_dash' | 'electric_surge' | 'ram';
}

export interface StageConfig {
  stageId: string;
  theme: ThemeId;
  levelNumber: number;
  displayName: string;
  gridWidth: number;
  gridHeight: number;
  targetCapture: number; // percentage e.g. 80
  timerSeconds: number;
  backgroundImage: string;
  enemies: EnemyConfig[];
}

export interface PlayerState {
  x: number;
  y: number;
  direction: { x: number; y: number };
  nextDirection: { x: number; y: number };
  isDrawing: boolean;
}

export interface EnemyState {
  id: string;
  x: number; // floating point for smooth movement
  y: number;
  vx: number;
  vy: number;
  type: string;
  speed: number;
  chargeTimer: number;
  isCharging: boolean;
  chargePhase: 'idle' | 'telegraph' | 'dashing';
  telegraphTimer: number;
  targetX: number;
  targetY: number;
}

export type CellState = 
  | 0 // Uncaptured (hazardous, enemy space)
  | 1 // Safe territory (perimeter or captured)
  | 2; // Active trail (vulnerable)

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  screenShake: boolean;
  crtScanlines: boolean;
}

export interface LevelProgress {
  stageId: string;
  completed: boolean;
  highScore: number;
  maxCapture: number;
}
