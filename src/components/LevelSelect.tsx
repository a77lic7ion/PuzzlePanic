import React from 'react';
import { ArrowLeft, Play, Lock, CheckCircle, Star } from 'lucide-react';
import { STAGES } from '../data/stages';
import { LevelProgress } from '../types';
import { audioManager } from '../audio';

interface LevelSelectProps {
  onBack: () => void;
  onSelectStage: (stageId: string) => void;
  levelProgressMap: Record<string, LevelProgress>;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  onBack,
  onSelectStage,
  levelProgressMap
}) => {
  // Group stages by theme
  const themes = [
    { id: 'neon_circuit', name: 'Neon Circuit', color: 'from-cyan-500 to-blue-600', icon: '⚡' },
    { id: 'jungle_ruins', name: 'Jungle Ruins', color: 'from-emerald-500 to-green-700', icon: '🌿' },
    { id: 'deep_sea', name: 'Deep Sea', color: 'from-blue-500 to-indigo-700', icon: '🌊' },
    { id: 'sky_pirates', name: 'Sky Pirates', color: 'from-amber-500 to-orange-600', icon: '⛵' },
    { id: 'lava_cavern', name: 'Lava Cavern', color: 'from-rose-600 to-red-800', icon: '🌋' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              audioManager.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-medium transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </button>
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Stage Select
          </h1>
          <div className="w-24" /> {/* spacer */}
        </div>

        <div className="space-y-8">
          {themes.map((theme, tIdx) => {
            const themeStages = STAGES.filter(s => s.theme === theme.id);
            return (
              <div key={theme.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{theme.icon}</span>
                  <h2 className="text-xl font-bold text-white tracking-wide">{theme.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themeStages.map((stage, sIdx) => {
                    // Level 1 is always unlocked. Subsequent levels unlocked if previous is completed.
                    const globalIdx = tIdx * 2 + sIdx;
                    const prevStage = globalIdx > 0 ? STAGES[globalIdx - 1] : null;
                    const isUnlocked = globalIdx === 0 || (prevStage && levelProgressMap[prevStage.stageId]?.completed);
                    const progress = levelProgressMap[stage.stageId];
                    const isCompleted = progress?.completed;

                    return (
                      <div
                        key={stage.stageId}
                        onClick={() => {
                          if (isUnlocked) {
                            audioManager.playClick();
                            onSelectStage(stage.stageId);
                          }
                        }}
                        className={`relative group p-5 rounded-xl border transition-all flex items-center justify-between ${
                          isUnlocked
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-cyan-500 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-gradient-to-br ${theme.color} text-white shadow-md`}>
                            {stage.levelNumber}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                              {stage.displayName}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span>Target: {stage.targetCapture}%</span>
                              <span>•</span>
                              <span>Timer: {stage.timerSeconds}s</span>
                              {isCompleted && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    High: {progress.highScore.toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isUnlocked ? (
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                              {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:text-white" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                              <Lock className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
