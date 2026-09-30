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
    { id: 'none', label: 'Тишина кулис', icon: <VolumeX className="w-3.5 h-3.5" /> },
    { id: 'vinyl', label: 'Винил Queen', icon: <Disc className="w-3.5 h-3.5" /> },
    { id: 'crowd', label: 'Гул стадиона Уэмбли', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'rain', label: 'Дождь за кулисами', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'binaural', label: 'Оперный резонанс 432Гц', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'fireplace', label: 'Огонь в гримёрке', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full bg-[#110818]/95 border-b border-amber-500/25 backdrop-blur-md transition-all shadow-xl shadow-black/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-cinzel font-bold uppercase tracking-[0.2em] text-amber-400/80">
              Атмосфера:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {ambientOptions.map((opt) => {
                const isActive = currentSound === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectSound(opt.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                        : 'bg-neutral-900/90 text-neutral-300 border border-neutral-800 hover:border-amber-500/30 hover:text-amber-200'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t border-amber-500/10 md:border-t-0">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-24 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                aria-label="Громкость фонового звука"
              />
              <span className="text-xs font-mono text-amber-300/80 w-8 text-right">
                {volume}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-amber-200 hover:bg-neutral-800 transition-colors"
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
