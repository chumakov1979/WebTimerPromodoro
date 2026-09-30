import React from 'react';
import { Volume2, VolumeX, Disc, Users, CloudRain, Sparkles, Flame, X } from 'lucide-react';
import { AmbientSoundType } from '../types';

interface AmbientSoundBarProps {
  currentSound: AmbientSoundType;
  volume: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSound: (sound: AmbientSoundType) => void;
  onChangeVolume: (vol: number) => void;
}

export const AmbientSoundBar: React.FC<AmbientSoundBarProps> = ({
  currentSound,
  volume,
  isOpen,
  onClose,
  onSelectSound,
  onChangeVolume,
}) => {
  if (!isOpen) return null;

  const ambientOptions: Array<{
    id: AmbientSoundType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'none', label: 'Тишина', icon: <VolumeX className="w-3.5 h-3.5" /> },
    { id: 'vinyl', label: 'Винил Queen', icon: <Disc className="w-3.5 h-3.5" /> },
    { id: 'crowd', label: 'Стадион Уэмбли', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'rain', label: 'Дождь за сценой', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'binaural', label: 'Оперный гул 432Гц', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'fireplace', label: 'Тепло гримёрки', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full bg-white border-b-2 border-neutral-900 transition-all shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bebas text-lg font-bold uppercase tracking-wider text-neutral-900">
              Атмосфера:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {ambientOptions.map((opt) => {
                const isActive = currentSound === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectSound(opt.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-oswald font-bold uppercase tracking-wide transition-all border-2 ${
                      isActive
                        ? 'bg-[#ffd000] text-neutral-900 border-neutral-900 poster-shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t border-neutral-200 md:border-t-0">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-neutral-900" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-24 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ffd000]"
                aria-label="Громкость фонового звука"
              />
              <span className="text-xs font-mono font-bold text-neutral-900 w-8 text-right">
                {volume}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              title="Скрыть панель"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
