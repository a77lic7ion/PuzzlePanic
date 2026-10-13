import React, { useState, useEffect } from 'react';
import { GameState, GameSettings, LevelProgress, StageConfig } from './types';
import { STAGES } from './data/stages';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { HowToPlay } from './components/HowToPlay';
import { SettingsModal } from './components/SettingsModal';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { ResultsModal } from './components/ResultsModal';
import { audioManager } from './audio';
import { Play, RotateCcw, Home } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentStageId, setCurrentStageId] = useState<string>('neon_1');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timer, setTimer] = useState<number>(90);
  const [capturePct, setCapturePct] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Settings state
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('puzzlepanic_settings');
    return saved ? JSON.parse(saved) : { musicVolume: 0.3, sfxVolume: 0.5, screenShake: true, crtScanlines: false };
  });

  // Level progress map state
  const [levelProgressMap, setLevelProgressMap] = useState<Record<string, LevelProgress>>(() => {
    const saved = localStorage.getItem('puzzlepanic_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Best score across all games
  const bestScore = Object.values(levelProgressMap).reduce((max, p) => Math.max(max, p.highScore || 0), 0);

  useEffect(() => {
    localStorage.setItem('puzzlepanic_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('puzzlepanic_progress', JSON.stringify(levelProgressMap));
  }, [levelProgressMap]);

  const currentStage: StageConfig = STAGES.find(s => s.stageId === currentStageId) || STAGES[0];

  const handleStartGame = (stageId: string = 'neon_1') => {
    setCurrentStageId(stageId);
    setScore(0);
    setLives(3);
    const stage = STAGES.find(s => s.stageId === stageId) || STAGES[0];
    setTimer(stage.timerSeconds);
    setCapturePct(0);
    setGameState('playing');
    audioManager.startMusicLoop();
  };

  const handleStageClear = (finalScore: number, finalCapture: number, timeRem: number, livesRem: number) => {
    setScore(finalScore);
    setCapturePct(finalCapture);
    setIsVictory(true);
    setGameState('stageClear');
    audioManager.stopMusicLoop();

    // Update progress
    setLevelProgressMap(prev => {
      const existing = prev[currentStageId] || { stageId: currentStageId, completed: false, highScore: 0, maxCapture: 0 };
      return {
        ...prev,
        [currentStageId]: {
          stageId: currentStageId,
          completed: true,
          highScore: Math.max(existing.highScore, finalScore),
          maxCapture: Math.max(existing.maxCapture, finalCapture)
        }
      };
    });
  };

  const handleGameOver = (finalScore: number, finalCapture: number) => {
    setScore(finalScore);
    setCapturePct(finalCapture);
    setIsVictory(false);
    setGameState('gameOver');
    audioManager.stopMusicLoop();
    audioManager.playGameOver();
  };

  const handleNextStage = () => {
    const currentIdx = STAGES.findIndex(s => s.stageId === currentStageId);
    if (currentIdx >= 0 && currentIdx < STAGES.length - 1) {
      handleStartGame(STAGES[currentIdx + 1].stageId);
    } else {
      setGameState('menu');
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden select-none">
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={() => handleStartGame('neon_1')}
          onOpenLevelSelect={() => setGameState('levelSelect')}
          onOpenHowToPlay={() => setGameState('howToPlay')}
          onOpenSettings={() => setGameState('settings')}
          bestScore={bestScore}
        />
      )}

      {gameState === 'levelSelect' && (
        <LevelSelect
          onBack={() => setGameState('menu')}
          onSelectStage={stageId => handleStartGame(stageId)}
          levelProgressMap={levelProgressMap}
        />
      )}

      {gameState === 'howToPlay' && (
        <HowToPlay onBack={() => setGameState('menu')} />
      )}

      {gameState === 'settings' && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
          <SettingsModal
            onClose={() => setGameState('menu')}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        </div>
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="relative w-full h-full">
          <GameCanvas
            stage={currentStage}
            settings={settings}
            onStageClear={handleStageClear}
            onGameOver={handleGameOver}
          />

          <HUD
            stage={currentStage}
            score={score}
            lives={lives}
            timer={timer}
            capturePercentage={capturePct}
            onPause={() => setGameState('paused')}
          />

          {gameState === 'paused' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <h2 className="text-3xl font-black mb-6 text-cyan-400">GAME PAUSED</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setGameState('playing');
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold rounded-xl shadow cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Resume
                  </button>
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      handleStartGame(currentStageId);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Restart Stage
                  </button>
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setGameState('menu');
                      audioManager.stopMusicLoop();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    <Home className="w-5 h-5" />
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {(gameState === 'stageClear' || gameState === 'gameOver') && (
        <ResultsModal
          isVictory={isVictory}
          stage={currentStage}
          score={score}
          capturePercentage={capturePct}
          timeRemaining={timer}
          livesRemaining={lives}
          onRetry={() => handleStartGame(currentStageId)}
          onNextStage={handleNextStage}
          onMenu={() => setGameState('menu')}
          hasNextStage={STAGES.findIndex(s => s.stageId === currentStageId) < STAGES.length - 1}
        />
      )}
    </div>
  );
}
