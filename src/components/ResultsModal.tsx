import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Home, Star } from 'lucide-react';
import { StageConfig } from '../types';
import { audioManager } from '../audio';

interface ResultsModalProps {
  isVictory: boolean;
  stage: StageConfig;
  score: number;
  capturePercentage: number;
  timeRemaining: number;
  livesRemaining: number;
  onRetry: () => void;
  onNextStage: () => void;
  onMenu: () => void;
  hasNextStage: boolean;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isVictory,
  stage,
  score,
  capturePercentage,
  timeRemaining,
  livesRemaining,
  onRetry,
  onNextStage,
  onMenu,
  hasNextStage
}) => {
  const timeBonus = timeRemaining * 10;
  const lifeBonus = livesRemaining * 500;
  const totalStageScore = score + timeBonus + lifeBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-white text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isVictory ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl mb-6 mx-auto">
            {isVictory ? (
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            ) : (
              <Star className="w-10 h-10 text-rose-500 rotate-45" />
            )}
          </div>

          <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-2 ${
            isVictory ? 'text-emerald-400' : 'text-rose-500'
          }`}>
            {isVictory ? 'STAGE CLEAR!' : 'GAME OVER'}
          </h2>

          <p className="text-slate-400 font-medium mb-6">
            {stage.displayName}
          </p>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 mb-8 space-y-3 text-left">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Territory Captured:</span>
              <span className="text-cyan-400 font-mono font-bold">{capturePercentage}% (Target: {stage.targetCapture}%)</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Base Territory Score:</span>
              <span className="text-white font-mono">{score.toLocaleString()}</span>
            </div>
            {isVictory && (
              <>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">Time Bonus ({timeRemaining}s × 10):</span>
                  <span className="text-emerald-400 font-mono">+{timeBonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">Lives Bonus ({livesRemaining} × 500):</span>
                  <span className="text-purple-400 font-mono">+{lifeBonus.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-base font-bold text-white">Total Score:</span>
              <span className="text-xl font-black font-mono text-amber-400">
                {isVictory ? totalStageScore.toLocaleString() : score.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                audioManager.playClick();
                onRetry();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Retry
            </button>

            {isVictory && hasNextStage ? (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNextStage();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Next Stage
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onMenu();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Home className="w-5 h-5" />
                Main Menu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
