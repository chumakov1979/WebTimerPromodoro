import React, { useEffect } from 'react';
import { Minimize2, Play, Pause, SkipForward, RotateCcw, Disc3 } from 'lucide-react';
import { TimerMode, TimerState, Task, AmbientSoundType } from '../types';
import { FreddieBackground } from './FreddieBackground';

interface ZenModeProps {
  isOpen: boolean;
  onClose: () => void;
  mode: TimerMode;
  state: TimerState;
  timeLeft: number;
  totalTime: number;
  activeTask: Task | null;
  onTogglePlay: () => void;
  onSkip: () => void;
  onReset: () => void;
  currentAmbient: AmbientSoundType;
  onToggleAmbient: () => void;
}

export const ZenMode: React.FC<ZenModeProps> = ({
  isOpen,
  onClose,
  mode,
  state,
  timeLeft,
  totalTime,
  activeTask,
  onTogglePlay,
  onSkip,
  onReset,
  currentAmbient,
  onToggleAmbient,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const modeLabels = {
    focus: 'ГРАНД-ПЕРФОРМАНС · THE SHOW MUST GO ON',
    shortBreak: 'АНТРАКТ · ПЕРЕРЫВ',
    longBreak: 'ГРАНД-АНТРАКТ · ОТДЫХ',
  };

  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between items-center p-6 sm:p-12 animate-in fade-in duration-300 select-none overflow-hidden text-neutral-900">
      {/* Exact Poster Background in Higher Opacity */}
      <FreddieBackground isPlaying={state === 'running'} />

      {/* Top Header */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between text-neutral-900">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#ffd000] border-2 border-neutral-900 animate-pulse" />
          <span className="font-bebas text-lg font-bold tracking-widest uppercase text-neutral-950">
            {modeLabels[mode]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAmbient}
            className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
              currentAmbient !== 'none'
                ? 'bg-[#ffd000] text-neutral-900 border-neutral-900 poster-shadow-sm'
                : 'bg-white border-neutral-900 text-neutral-900 hover:bg-[#ffd000]'
            }`}
            title="Винил и звуки стадиона"
          >
            <Disc3 className="w-5 h-5 animate-spin stroke-[2.5]" style={{ animationDuration: '6s' }} />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-neutral-900 hover:bg-[#ffd000] text-neutral-900 transition-all font-bebas text-base font-bold cursor-pointer poster-shadow-sm"
          >
            <Minimize2 className="w-4 h-4 stroke-[2.5]" />
            <span>Выйти за кулисы</span>
            <kbd className="px-1.5 py-0.5 ml-1 text-xs bg-neutral-100 border border-neutral-900 rounded font-mono">
              Esc
            </kbd>
          </button>
        </div>
      </div>

      {/* Center Display */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
        {activeTask && (
          <div className="font-oswald text-lg sm:text-xl font-bold uppercase tracking-wider text-neutral-900 mb-3 px-4 py-1 bg-white border-2 border-neutral-900 rounded-lg poster-shadow-sm max-w-xl truncate">
            {activeTask.title}
          </div>
        )}

        {/* Large Time Display in Stark Poster Typography */}
        <div className="font-mono text-8xl sm:text-9xl md:text-[13rem] font-black text-neutral-950 tabular-nums tracking-tighter drop-shadow-sm">
          {timeFormatted}
        </div>

        {/* Progress bar line */}
        <div className="w-72 sm:w-96 h-3 bg-neutral-100 border-2 border-neutral-900 rounded-full mt-6 overflow-hidden poster-shadow-sm">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-[#ffd000] transition-all duration-300"
          />
        </div>

        <span className="font-bebas text-lg text-neutral-900 font-bold tracking-widest uppercase mt-3">
          {progressPercent}% акта завершено
        </span>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-4 rounded-xl bg-white border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-100 poster-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          title="Сброс"
        >
          <RotateCcw className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center gap-3 px-12 py-4 rounded-xl font-bebas text-2xl tracking-wider bg-[#ffd000] hover:bg-[#ffdc2e] text-neutral-950 border-3 border-neutral-950 poster-shadow transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none font-bold"
        >
          {state === 'running' ? (
            <>
              <Pause className="w-7 h-7 fill-current" />
              <span>Пауза</span>
            </>
          ) : (
            <>
              <Play className="w-7 h-7 fill-current" />
              <span>Вперёд, на сцену!</span>
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          className="p-4 rounded-xl bg-white border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-100 poster-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          title="Следующий акт"
        >
          <SkipForward className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
