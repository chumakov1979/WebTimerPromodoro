import React, { useState } from 'react';
import { X, Volume2, RotateCcw, Play, Check, Sliders, Music } from 'lucide-react';
import { Settings, SoundNotificationType } from '../types';
import { playNotificationSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<Settings>({ ...settings });

  if (!isOpen) return null;

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const soundOptions: Array<{ id: SoundNotificationType; label: string }> = [
    { id: 'queenFanfare', label: '👑 Рок-фанфара Queen (The Show Must Go On)' },
    { id: 'ovation', label: '👏 Овации переполненного стадиона (Wembley)' },
    { id: 'guitar', label: '🎸 Соло Брайана Мэя (Harmonic Swell)' },
    { id: 'chime', label: '🔔 Оперный соборный колокол' },
    { id: 'gong', label: '🥁 Богемский гранд-гонг' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#110818] border border-amber-500/40 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/25 bg-[#140a1c]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">
              Кулисы и Режиссура
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
          {/* Section: Stage Durations */}
          <div>
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-amber-300/90 mb-3">
              Хронометраж актов (минуты)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-cinzel text-amber-300/70 mb-1">
                  Шоу / Фокус
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formData.focusDuration}
                  onChange={(e) =>
                    handleChange('focusDuration', Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-3 py-2.5 bg-[#09040d] border border-amber-500/30 rounded-xl text-sm text-amber-200 font-mono text-center focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cinzel text-emerald-300/70 mb-1">
                  Антракт
                </label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={formData.shortBreakDuration}
                  onChange={(e) =>
                    handleChange('shortBreakDuration', Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-3 py-2.5 bg-[#09040d] border border-emerald-500/30 rounded-xl text-sm text-emerald-200 font-mono text-center focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cinzel text-purple-300/70 mb-1">
                  Гранд-антракт
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.longBreakDuration}
                  onChange={(e) =>
                    handleChange('longBreakDuration', Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-3 py-2.5 bg-[#09040d] border border-purple-500/30 rounded-xl text-sm text-purple-200 font-mono text-center focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between text-xs text-amber-300/80 font-cinzel">
              <span>Гранд-антракт каждые</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={formData.longBreakInterval}
                  onChange={(e) =>
                    handleChange('longBreakInterval', Math.max(2, parseInt(e.target.value) || 4))
                  }
                  className="w-16 px-2 py-1 bg-[#09040d] border border-amber-500/30 rounded-lg text-sm text-amber-300 font-mono text-center focus:border-amber-400 focus:outline-none"
                />
                <span>акта</span>
              </div>
            </div>
          </div>

          {/* Section: Automation */}
          <div className="pt-4 border-t border-amber-500/20">
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-amber-300/90 mb-3">
              Автоматизация сцены
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-cinzel text-neutral-200">
                  Автоматически открывать занавес на антракт
                </span>
                <input
                  type="checkbox"
                  checked={formData.autoStartBreaks}
                  onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#09040d] border-amber-500/40 accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-cinzel text-neutral-200">
                  Автоматически начинать следующее шоу после перерыва
                </span>
                <input
                  type="checkbox"
                  checked={formData.autoStartPomodoros}
                  onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#09040d] border-amber-500/40 accent-amber-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section: Sound & Notifications */}
          <div className="pt-4 border-t border-amber-500/20">
            <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-amber-300/90 mb-3">
              Музыкальные оповещения финала
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-cinzel text-amber-300/70 mb-2">
                Сигнал триумфа
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.soundNotification}
                  onChange={(e) =>
                    handleChange('soundNotification', e.target.value as SoundNotificationType)
                  }
                  className="flex-1 px-3 py-2.5 bg-[#09040d] border border-amber-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-cinzel"
                >
                  {soundOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#110818] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => playNotificationSound(formData.soundNotification, formData.soundVolume)}
                  className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Тест</span>
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-xs font-cinzel text-amber-300/70">Громкость фанфар:</span>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.soundVolume}
                  onChange={(e) => handleChange('soundVolume', Number(e.target.value))}
                  className="w-28 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-xs font-mono text-amber-300 w-8 text-right">
                  {formData.soundVolume}%
                </span>
              </div>
            </div>

            {/* Metronome Drumstick Tick */}
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-cinzel text-neutral-200">
                  Метроном ударных палочек во время шоу
                </span>
                <input
                  type="checkbox"
                  checked={formData.tickingSound}
                  onChange={(e) => handleChange('tickingSound', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#09040d] border-amber-500/40 accent-amber-500 cursor-pointer"
                />
              </label>

              {formData.tickingSound && (
                <div className="flex items-center justify-between gap-4 pt-1">
                  <span className="text-xs font-cinzel text-amber-300/70">Громкость метронома:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={formData.tickingVolume}
                      onChange={(e) => handleChange('tickingVolume', Number(e.target.value))}
                      className="w-28 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="text-xs font-mono text-amber-300 w-8 text-right">
                      {formData.tickingVolume}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-amber-500/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onResetDefaults();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-cinzel text-neutral-400 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>По умолчанию</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-cinzel text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-cinzel font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Применить</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
