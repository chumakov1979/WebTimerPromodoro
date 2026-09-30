import React, { useState } from 'react';
import { X, Volume2, RotateCcw, Play, Check, Sliders } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white border-3 border-neutral-900 rounded-2xl poster-shadow overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-neutral-900 bg-[#ffd000]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
            <h2 className="font-bebas text-2xl font-black text-neutral-950 tracking-wider uppercase leading-none">
              Кулисы и Режиссура
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
          {/* Section: Stage Durations */}
          <div>
            <h3 className="font-bebas text-lg tracking-wider text-neutral-950 uppercase mb-3">
              Хронометраж актов (минуты)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-oswald font-bold uppercase text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2.5 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-sm text-neutral-950 font-mono font-bold text-center focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-oswald font-bold uppercase text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2.5 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-sm text-neutral-950 font-mono font-bold text-center focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-oswald font-bold uppercase text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2.5 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-sm text-neutral-950 font-mono font-bold text-center focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between text-xs text-neutral-800 font-oswald font-bold uppercase">
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
                  className="w-16 px-2 py-1 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-sm text-neutral-950 font-mono font-bold text-center focus:outline-none"
                />
                <span>акта</span>
              </div>
            </div>
          </div>

          {/* Section: Automation */}
          <div className="pt-4 border-t-2 border-neutral-200">
            <h3 className="font-bebas text-lg tracking-wider text-neutral-950 uppercase mb-3">
              Автоматизация сцены
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-oswald font-bold uppercase text-neutral-800">
                  Автоматически открывать занавес на антракт
                </span>
                <input
                  type="checkbox"
                  checked={formData.autoStartBreaks}
                  onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-neutral-900 accent-[#ffd000] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-oswald font-bold uppercase text-neutral-800">
                  Автоматически начинать следующее шоу после перерыва
                </span>
                <input
                  type="checkbox"
                  checked={formData.autoStartPomodoros}
                  onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-neutral-900 accent-[#ffd000] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section: Sound & Notifications */}
          <div className="pt-4 border-t-2 border-neutral-200">
            <h3 className="font-bebas text-lg tracking-wider text-neutral-950 uppercase mb-3">
              Музыкальные оповещения финала
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-oswald font-bold uppercase text-neutral-700 mb-2">
                Сигнал триумфа
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.soundNotification}
                  onChange={(e) =>
                    handleChange('soundNotification', e.target.value as SoundNotificationType)
                  }
                  className="flex-1 px-3 py-2.5 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-xs text-neutral-900 font-oswald font-bold focus:outline-none"
                >
                  {soundOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-white text-neutral-900">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => playNotificationSound(formData.soundNotification, formData.soundVolume)}
                  className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffdc2e] border-2 border-neutral-900 text-neutral-950 rounded-lg text-xs font-bebas tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Тест</span>
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-xs font-oswald font-bold uppercase text-neutral-700">Громкость фанфар:</span>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-neutral-900" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.soundVolume}
                  onChange={(e) => handleChange('soundVolume', Number(e.target.value))}
                  className="w-28 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ffd000]"
                />
                <span className="text-xs font-mono font-bold text-neutral-900 w-8 text-right">
                  {formData.soundVolume}%
                </span>
              </div>
            </div>

            {/* Metronome */}
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-oswald font-bold uppercase text-neutral-800">
                  Метроном барабанных палочек во время шоу
                </span>
                <input
                  type="checkbox"
                  checked={formData.tickingSound}
                  onChange={(e) => handleChange('tickingSound', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-neutral-900 accent-[#ffd000] cursor-pointer"
                />
              </label>

              {formData.tickingSound && (
                <div className="flex items-center justify-between gap-4 pt-1">
                  <span className="text-xs font-oswald font-bold uppercase text-neutral-700">Громкость метронома:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={formData.tickingVolume}
                      onChange={(e) => handleChange('tickingVolume', Number(e.target.value))}
                      className="w-28 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ffd000]"
                    />
                    <span className="text-xs font-mono font-bold text-neutral-900 w-8 text-right">
                      {formData.tickingVolume}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t-2 border-neutral-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onResetDefaults();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-oswald font-bold uppercase text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>По умолчанию</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-oswald font-bold uppercase text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 text-sm font-bebas tracking-wider font-bold text-neutral-950 bg-[#ffd000] hover:bg-[#ffdc2e] border-2 border-neutral-900 rounded-lg poster-shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Применить</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
