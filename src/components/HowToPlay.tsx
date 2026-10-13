import React from 'react';
import { ArrowLeft, Shield, Zap, Skull, Trophy } from 'lucide-react';
import { audioManager } from '../audio';

interface HowToPlayProps {
  onBack: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6 md:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full">
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
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            How to Play
          </h1>
          <div className="w-24" />
        </div>

        <div className="space-y-6 text-slate-300 font-medium">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Core Objective & Safe Territory
            </h2>
            <p className="leading-relaxed text-slate-300">
              You start on the safe outer perimeter (or captured territory). Use <span className="text-cyan-400 font-bold">Arrow Keys / WASD</span> or <span className="text-cyan-400 font-bold">Touch D-Pad</span> to move. When you step off safe territory into the uncaptured arena, you automatically begin drawing an exposed trail.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Reconnecting & Claiming Territory
            </h2>
            <p className="leading-relaxed text-slate-300">
              Loop back and reconnect your trail to safe territory to claim enclosed regions! Any uncaptured region that does <span className="text-amber-400 font-bold">not</span> contain an active roaming enemy will be permanently captured and reveal the gorgeous theme artwork underneath.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Skull className="w-6 h-6 text-rose-500" />
              Enemies & Dangerous Charges
            </h2>
            <p className="leading-relaxed text-slate-300">
              Enemies roam freely in uncaptured space. If an enemy touches your active trail or your player while drawing, you lose a life and the unfinished trail is discarded. Watch out for enemy charge telegraphs (flashing lines/arrows) — enemies will dash straight toward your trail with a 0.5s wind-up!
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-emerald-400" />
              Winning the Stage
            </h2>
            <p className="leading-relaxed text-slate-300">
              Reach <span className="text-emerald-400 font-bold">80% territory capture</span> before the 90-second countdown timer runs out to clear the stage, earn time and life bonuses, and unlock the next level!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
