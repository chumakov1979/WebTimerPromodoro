import React, { useEffect } from 'react';
import { Minimize2, Play, Pause, SkipForward, RotateCcw, Disc3, Crown } from 'lucide-react';
import { TimerMode, TimerState, Task, AmbientSoundType } from '../types';

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
    focus: 'Гранд-перформанс · Шоу продолжается',
    shortBreak: 'Антракт · Дыхание сцены',
    longBreak: 'Гранд-антракт · Восстановление сил',
  };

  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#07030a] flex flex-col justify-between items-center p-6 sm:p-12 animate-in fade-in duration-300 select-none overflow-hidden">
      {/* Overhead dramatic stage light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] stage-spotlight pointer-events-none rounded-full blur-3xl opacity-80" />

      {/* Top Header */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
            {modeLabels[mode]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAmbient}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              currentAmbient !== 'none'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Винил и звуки стадиона"
          >
            <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 hover:text-amber-200 transition-all text-xs font-cinzel cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Выйти за кулисы</span>
            <kbd className="px-1.5 py-0.5 ml-1 text-[10px] bg-neutral-800 border border-neutral-700 rounded font-mono">
              Esc
            </kbd>
          </button>
        </div>
      </div>

      {/* Center Display */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
        {/* Active task note */}
        {activeTask && (
          <div className="font-cinzel text-base sm:text-lg font-semibold text-amber-200/90 mb-4 max-w-xl truncate drop-shadow">
            {activeTask.title}
          </div>
        )}

        {/* Large Time Display */}
        <div className="font-mono text-8xl sm:text-9xl md:text-[12rem] font-bold gold-text tabular-nums tracking-tighter drop-shadow-[0_8px_40px_rgba(234,179,8,0.5)]">
          {timeFormatted}
        </div>

        {/* Progress bar line */}
        <div className="w-72 sm:w-96 h-1.5 bg-neutral-900/90 border border-amber-500/20 rounded-full mt-8 overflow-hidden shadow-inner">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 transition-all duration-300 shadow-sm shadow-amber-400/80"
          />
        </div>

        <span className="font-cinzel text-xs text-amber-300/70 tracking-[0.2em] uppercase mt-3">
          {progressPercent}% акта завершено
        </span>

        <p className="font-playfair italic text-sm text-amber-200/60 mt-4 max-w-md">
          «On with the show — The Show Must Go On!»
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer"
          title="Сброс"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center gap-3 px-12 py-4 rounded-2xl font-cinzel text-base font-extrabold tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black hover:brightness-110 shadow-2xl shadow-amber-500/40 transition-all cursor-pointer active:scale-95"
        >
          {state === 'running' ? (
            <>
              <Pause className="w-6 h-6 fill-current" />
              <span>Пауза</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" />
              <span>Вперёд, на сцену!</span>
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer"
          title="Следующий акт"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
