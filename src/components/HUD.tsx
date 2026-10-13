import React from 'react';
import { Heart, Clock, Trophy, Pause, PieChart } from 'lucide-react';
import { StageConfig } from '../types';
import { audioManager } from '../audio';

interface HUDProps {
  stage: StageConfig;
  score: number;
  lives: number;
  timer: number;
  capturePercentage: number;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stage,
  score,
  lives,
  timer,
  capturePercentage,
  onPause
}) => {
  const isTimeLow = timer <= 10;
  const isTargetMet = capturePercentage >= stage.targetCapture;

  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none flex flex-col md:flex-row items-center justify-between gap-3 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent">
      {/* Left: Stage info & lives */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stage.displayName}</div>
          <div className="flex items-center gap-1.5 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all ${
                  i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 scale-90'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 shadow-lg backdrop-blur-md flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Score</div>
            <div className="text-lg font-black font-mono text-white">{score.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Center: Capture % & Progress bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-5 py-2 shadow-lg backdrop-blur-md flex items-center gap-4 pointer-events-auto min-w-[240px]">
        <PieChart className="w-5 h-5 text-cyan-400" />
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-slate-400">Captured:</span>
            <span className={isTargetMet ? 'text-emerald-400 font-black' : 'text-cyan-400'}>
              {capturePercentage}% / {stage.targetCapture}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isTargetMet ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
              }`}
              style={{ width: `${Math.min(100, (capturePercentage / stage.targetCapture) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Timer & Pause */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className={`bg-slate-900/90 border rounded-xl px-4 py-2 shadow-lg backdrop-blur-md flex items-center gap-2 transition-all ${
          isTimeLow ? 'border-rose-500/80 bg-rose-950/30 animate-pulse' : 'border-slate-800'
        }`}>
          <Clock className={`w-5 h-5 ${isTimeLow ? 'text-rose-400' : 'text-purple-400'}`} />
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time</div>
            <div className={`text-lg font-black font-mono ${isTimeLow ? 'text-rose-400' : 'text-white'}`}>
              {timer}s
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            onPause();
          }}
          className="w-12 h-12 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Pause Game"
        >
          <Pause className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
