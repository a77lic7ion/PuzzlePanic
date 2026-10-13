import React from 'react';
import { Play, Grid, BookOpen, Settings, Award } from 'lucide-react';
import { audioManager } from '../audio';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  bestScore: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenHowToPlay,
  onOpenSettings,
  bestScore
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white px-4 overflow-hidden">
      {/* Background glowing ambient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6 animate-pulse">
          ⚡ Arcade Territory Capture Game
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-4">
          PUZZLE<span className="text-white">PANIC</span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg mb-8 max-w-md mx-auto font-medium">
          Draw trails to claim territory across 5 vibrant worlds, dodge deadly enemy charges, and reach 80% capture!
        </p>

        {bestScore > 0 && (
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-amber-400 font-bold mb-8 shadow-lg">
            <Award className="w-5 h-5" />
            <span>Best Score: {bestScore.toLocaleString()}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <button
            onClick={() => {
              audioManager.playClick();
              onStartGame();
            }}
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            Play Game
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onOpenLevelSelect();
            }}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Grid className="w-5 h-5 text-cyan-400" />
            Stage Select
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onOpenHowToPlay();
            }}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-purple-400" />
            How to Play
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onOpenSettings();
            }}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Settings className="w-5 h-5 text-pink-400" />
            Settings
          </button>
        </div>

        <div className="mt-12 text-xs text-slate-500 font-medium">
          PuzzlePanic v1.1 • Non-adult Arcade Classic Edition
        </div>
      </div>
    </div>
  );
};
