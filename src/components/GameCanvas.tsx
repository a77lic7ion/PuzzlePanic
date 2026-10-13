import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StageConfig, CellState, EnemyState, GameSettings } from '../types';
import { createInitialGrid, calculateCapturePercentage, processCompletedCapture, clearActiveTrail } from '../utils/gameLogic';
import { audioManager } from '../audio';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameCanvasProps {
  stage: StageConfig;
  settings: GameSettings;
  onStageClear: (score: number, capturePercentage: number, timeRemaining: number, livesRemaining: number) => void;
  onGameOver: (score: number, capturePercentage: number) => void;
}

// Background image mapping to the exact user uploaded images
const THEME_BACKGROUNDS: Record<string, string> = {
  neon_circuit: '/1_Neon circuit.jpg',
  jungle_ruins: '/Jungle ruins.jpg',
  deep_sea: '/Deep sea.jpg',
  sky_pirates: '/Sky pirates.png',
  lava_cavern: '/Lava cavern.jpg'
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stage,
  settings,
  onStageClear,
  onGameOver
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timer, setTimer] = useState<number>(stage.timerSeconds);
  const [capturePct, setCapturePct] = useState<number>(0);

  const gridRef = useRef<CellState[][]>(createInitialGrid(stage.gridWidth, stage.gridHeight));
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const capturePctRef = useRef<number>(0);
  const isGameOverOrClearRef = useRef<boolean>(false);

  const playerRef = useRef({
    x: Math.floor(stage.gridWidth / 2),
    y: stage.gridHeight - 1,
    dirX: 0,
    dirY: 0,
    nextDirX: 0,
    nextDirY: 0,
    isDrawing: false
  });

  const enemiesRef = useRef<EnemyState[]>([]);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [bgLoaded, setBgLoaded] = useState<boolean>(false);

  // Initialize enemies
  useEffect(() => {
    const initialEnemies: EnemyState[] = stage.enemies.map((eConfig, idx) => {
      const startX = Math.floor(stage.gridWidth / 2) + (idx % 2 === 0 ? 2 : -2);
      const startY = Math.floor(stage.gridHeight / 2);
      return {
        id: eConfig.id,
        x: startX,
        y: startY,
        vx: (Math.random() > 0.5 ? 1 : -1) * 1.5,
        vy: (Math.random() > 0.5 ? 1 : -1) * 1.5,
        type: eConfig.type,
        speed: eConfig.speed,
        chargeTimer: 0,
        isCharging: false,
        chargePhase: 'idle',
        telegraphTimer: 0,
        targetX: startX,
        targetY: startY
      };
    });
    enemiesRef.current = initialEnemies;
  }, [stage]);

  // Load background image
  useEffect(() => {
    const img = new window.Image();
    const bgUrl = THEME_BACKGROUNDS[stage.theme] || `/${stage.backgroundImage}`;
    img.src = bgUrl;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
    };
    img.onerror = () => {
      // Fallback to high quality theme image if local file fails
      const fallbackImg = new window.Image();
      fallbackImg.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80';
      fallbackImg.onload = () => {
        bgImageRef.current = fallbackImg;
        setBgLoaded(true);
      };
    };
  }, [stage]);

  // Timer countdown
  useEffect(() => {
    if (isGameOverOrClearRef.current) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1 && !isGameOverOrClearRef.current) {
          isGameOverOrClearRef.current = true;
          clearInterval(interval);
          setTimeout(() => {
            onGameOver(scoreRef.current, capturePctRef.current);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onGameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const p = playerRef.current;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        p.nextDirX = 0;
        p.nextDirY = -1;
        e.preventDefault();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        p.nextDirX = 0;
        p.nextDirY = 1;
        e.preventDefault();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        p.nextDirX = -1;
        p.nextDirY = 0;
        e.preventDefault();
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        p.nextDirX = 1;
        p.nextDirY = 0;
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Gamepad polling
  useEffect(() => {
    let gamepadInterval: any;
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gp of gamepads) {
        if (gp && gp.connected) {
          const p = playerRef.current;
          const threshold = 0.5;
          const xAxis = gp.axes[0] !== undefined ? gp.axes[0] : 0;
          const yAxis = gp.axes[1] !== undefined ? gp.axes[1] : 0;

          const bUp = gp.buttons[12]?.pressed || yAxis < -threshold;
          const bDown = gp.buttons[13]?.pressed || yAxis > threshold;
          const bLeft = gp.buttons[14]?.pressed || xAxis < -threshold;
          const bRight = gp.buttons[15]?.pressed || xAxis > threshold;

          if (bUp) {
            p.nextDirX = 0;
            p.nextDirY = -1;
          } else if (bDown) {
            p.nextDirX = 0;
            p.nextDirY = 1;
          } else if (bLeft) {
            p.nextDirX = -1;
            p.nextDirY = 0;
          } else if (bRight) {
            p.nextDirX = 1;
            p.nextDirY = 0;
          }
        }
      }
    };

    gamepadInterval = setInterval(pollGamepad, 50);
    return () => clearInterval(gamepadInterval);
  }, []);

  const handlePlayerHit = useCallback(() => {
    if (isGameOverOrClearRef.current) return;
    audioManager.playHit();
    livesRef.current -= 1;
    setLives(livesRef.current);

    if (livesRef.current <= 0) {
      isGameOverOrClearRef.current = true;
      setTimeout(() => {
        onGameOver(scoreRef.current, capturePctRef.current);
      }, 0);
      return;
    }

    playerRef.current = {
      x: Math.floor(stage.gridWidth / 2),
      y: stage.gridHeight - 1,
      dirX: 0,
      dirY: 0,
      nextDirX: 0,
      nextDirY: 0,
      isDrawing: false
    };

    gridRef.current = clearActiveTrail(gridRef.current);
  }, [stage, onGameOver]);

  // Main game loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let moveTimer = 0;
    const moveInterval = 110;

    const updateGame = (currentTime: number) => {
      if (isGameOverOrClearRef.current) return;

      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      moveTimer += dt * 1000;

      const p = playerRef.current;
      const width = stage.gridWidth;
      const height = stage.gridHeight;

      if (moveTimer >= moveInterval) {
        moveTimer = 0;

        if (p.nextDirX !== 0 || p.nextDirY !== 0) {
          if (!(p.dirX === -p.nextDirX && p.dirY === -p.nextDirY && (p.dirX !== 0 || p.dirY !== 0))) {
            p.dirX = p.nextDirX;
            p.dirY = p.nextDirY;
          }
        }

        if (p.dirX !== 0 || p.dirY !== 0) {
          const nextX = Math.max(0, Math.min(width - 1, p.x + p.dirX));
          const nextY = Math.max(0, Math.min(height - 1, p.y + p.dirY));

          const currentCellState = gridRef.current[nextY][nextX];

          if (currentCellState === 1) {
            if (p.isDrawing) {
              audioManager.playCapture();
              const { updatedGrid, newlyCapturedCount } = processCompletedCapture(gridRef.current, enemiesRef.current);
              gridRef.current = updatedGrid;
              const newPct = calculateCapturePercentage(updatedGrid);
              capturePctRef.current = newPct;
              setCapturePct(newPct);

              const gainedScore = newlyCapturedCount * 100;
              scoreRef.current += gainedScore;
              setScore(scoreRef.current);

              p.isDrawing = false;

              if (newPct >= stage.targetCapture) {
                isGameOverOrClearRef.current = true;
                audioManager.playStageClear();
                setTimeout(() => {
                  onStageClear(scoreRef.current, newPct, timer, livesRef.current);
                }, 0);
                return;
              }
            }
            p.x = nextX;
            p.y = nextY;
            audioManager.playMove();
          } else if (currentCellState === 0) {
            if (!p.isDrawing) {
              p.isDrawing = true;
            }
            p.x = nextX;
            p.y = nextY;
            gridRef.current[p.y][p.x] = 2;
            audioManager.playDraw();
          } else if (currentCellState === 2) {
            handlePlayerHit();
          }
        }
      }

      // Enemies update
      const updatedEnemies = enemiesRef.current.map(enemy => {
        let newX = enemy.x + enemy.vx * enemy.speed * dt;
        let newY = enemy.y + enemy.vy * enemy.speed * dt;

        let newVx = enemy.vx;
        let newVy = enemy.vy;

        if (newX <= 1 || newX >= width - 2) {
          newVx = -newVx;
          newX = Math.max(1, Math.min(width - 2, newX));
        }
        if (newY <= 1 || newY >= height - 2) {
          newVy = -newVy;
          newY = Math.max(1, Math.min(height - 2, newY));
        }

        let chargeTimer = enemy.chargeTimer + dt;
        let chargePhase = enemy.chargePhase;
        let telegraphTimer = enemy.telegraphTimer;

        if (chargePhase === 'idle' && chargeTimer > 6) {
          chargePhase = 'telegraph';
          telegraphTimer = 0;
          chargeTimer = 0;
          audioManager.playChargeTelegraph();
        } else if (chargePhase === 'telegraph') {
          telegraphTimer += dt;
          if (telegraphTimer >= 0.6) {
            chargePhase = 'dashing';
            telegraphTimer = 0;
            const targetX = p.isDrawing ? p.x : Math.floor(width / 2);
            const targetY = p.isDrawing ? p.y : Math.floor(height / 2);
            const angle = Math.atan2(targetY - newY, targetX - newX);
            newVx = Math.cos(angle) * (enemy.speed * 1.8);
            newVy = Math.sin(angle) * (enemy.speed * 1.8);
          }
        } else if (chargePhase === 'dashing') {
          telegraphTimer += dt;
          if (telegraphTimer > 1.2) {
            chargePhase = 'idle';
            telegraphTimer = 0;
            newVx = (Math.random() > 0.5 ? 1 : -1) * enemy.speed;
            newVy = (Math.random() > 0.5 ? 1 : -1) * enemy.speed;
          }
        }

        const gridX = Math.floor(newX);
        const gridY = Math.floor(newY);

        if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
          if (gridRef.current[gridY][gridX] === 2) {
            handlePlayerHit();
          }
        }

        if (Math.abs(newX - p.x) < 0.6 && Math.abs(newY - p.y) < 0.6) {
          handlePlayerHit();
        }

        return {
          ...enemy,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          chargeTimer,
          chargePhase,
          telegraphTimer
        };
      });

      enemiesRef.current = updatedEnemies;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderCanvas(ctx, canvas.width, canvas.height, gridRef.current, p, updatedEnemies, stage, bgImageRef.current, bgLoaded, settings);
        }
      }

      animationFrameId = requestAnimationFrame(updateGame);
    };

    animationFrameId = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stage, settings, handlePlayerHit, onStageClear, bgLoaded, timer]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-2 md:p-6 overflow-hidden">
      <div className="relative w-full max-w-[420px] md:max-w-[480px] aspect-[9/16] flex flex-col items-center justify-center bg-slate-900 border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={720}
          height={1280}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 bg-slate-900/90 p-4 rounded-3xl border border-slate-700/80 backdrop-blur-md shadow-2xl z-30">
          <button
            onClick={() => { playerRef.current.nextDirX = 0; playerRef.current.nextDirY = -1; }}
            className="w-16 h-16 bg-slate-800 active:bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow transition-all active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-8 h-8" />
          </button>
          <div className="flex gap-16">
            <button
              onClick={() => { playerRef.current.nextDirX = -1; playerRef.current.nextDirY = 0; }}
              className="w-16 h-16 bg-slate-800 active:bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => { playerRef.current.nextDirX = 1; playerRef.current.nextDirY = 0; }}
              className="w-16 h-16 bg-slate-800 active:bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow transition-all active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>
          <button
            onClick={() => { playerRef.current.nextDirX = 0; playerRef.current.nextDirY = 1; }}
            className="w-16 h-16 bg-slate-800 active:bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow transition-all active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

function renderCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  grid: CellState[][],
  player: { x: number; y: number; isDrawing: boolean },
  enemies: EnemyState[],
  stage: StageConfig,
  bgImg: HTMLImageElement | null,
  bgLoaded: boolean,
  settings: GameSettings
) {
  ctx.clearRect(0, 0, width, height);

  const gridHeight = grid.length;
  const gridWidth = grid[0].length;
  const cellWidth = width / gridWidth;
  const cellHeight = height / gridHeight;

  if (bgLoaded && bgImg) {
    ctx.save();
    ctx.beginPath();
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (grid[y][x] === 1) {
          ctx.rect(x * cellWidth, y * cellHeight, cellWidth + 0.5, cellHeight + 0.5);
        }
      }
    }
    ctx.clip();
    ctx.drawImage(bgImg, 0, 0, width, height);
    ctx.restore();
  }

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const state = grid[y][x];
      const px = x * cellWidth;
      const py = y * cellHeight;

      if (state === 0) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(px, py, cellWidth, cellHeight);
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
        ctx.strokeRect(px, py, cellWidth, cellHeight);
      } else if (state === 2) {
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.fillRect(px + 2, py + 2, cellWidth - 4, cellHeight - 4);
        ctx.shadowBlur = 0;
      }
    }
  }

  enemies.forEach(enemy => {
    const ex = enemy.x * cellWidth + cellWidth / 2;
    const ey = enemy.y * cellHeight + cellHeight / 2;

    if (enemy.chargePhase === 'telegraph') {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(player.x * cellWidth + cellWidth / 2, player.y * cellHeight + cellHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.save();
    ctx.translate(ex, ey);
    ctx.fillStyle = enemy.chargePhase === 'dashing' ? '#ef4444' : '#a855f7';
    ctx.shadowColor = enemy.chargePhase === 'dashing' ? '#ef4444' : '#a855f7';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, cellWidth * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const pxi = player.x * cellWidth + cellWidth / 2;
  const pyi = player.y * cellHeight + cellHeight / 2;
  ctx.save();
  ctx.translate(pxi, pyi);
  ctx.fillStyle = player.isDrawing ? '#22d3ee' : '#38bdf8';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(0, 0, cellWidth * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  if (settings.crtScanlines) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }
  }
}
