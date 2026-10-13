import React from 'react';
import { X, Volume2, Monitor, Sparkles } from 'lucide-react';
import { GameSettings } from '../types';
import { audioManager } from '../audio';

interface SettingsModalProps {
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  settings,
  onUpdateSettings
}) => {
  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, musicVolume: val };
    onUpdateSettings(updated);
    audioManager.setVolumes(val, settings.sfxVolume);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, sfxVolume: val };
    onUpdateSettings(updated);
    audioManager.setVolumes(settings.musicVolume, val);
    audioManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Game Settings
          </h2>
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-semibold text-slate-200">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                Music Volume
              </span>
              <span className="text-sm font-mono text-cyan-400">
                {Math.round(settings.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={handleMusicChange}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-semibold text-slate-200">
                <Volume2 className="w-5 h-5 text-purple-400" />
                Sound Effects Volume
              </span>
              <span className="text-sm font-mono text-purple-400">
                {Math.round(settings.sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSfxChange}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 font-semibold text-slate-200">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Screen Shake
              </span>
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={e => {
                  audioManager.playClick();
                  onUpdateSettings({ ...settings, screenShake: e.target.checked });
                }}
                className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 font-semibold text-slate-200">
                <Monitor className="w-5 h-5 text-pink-400" />
                CRT Scanlines
              </span>
              <input
                type="checkbox"
                checked={settings.crtScanlines}
                onChange={e => {
                  audioManager.playClick();
                  onUpdateSettings({ ...settings, crtScanlines: e.target.checked });
                }}
                className="w-5 h-5 accent-pink-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
