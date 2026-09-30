import React, { useMemo } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus, Crown, ChevronRight, Mic2, Sparkles } from 'lucide-react';
import { TimerMode, TimerState, Task } from '../types';

interface TimerDisplayProps {
  mode: TimerMode;
  state: TimerState;
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  cycleIndex: number; // 1-based, e.g. 1 to longBreakInterval
  longBreakInterval: number;
  activeTask: Task | null;
  onSelectMode: (mode: TimerMode) => void;
  onTogglePlay: () => void;
  onSkip: () => void;
  onReset: () => void;
  onAddMinutes: (minutes: number) => void;
  onOpenTasksTab: () => void;
}

const QUEEN_QUOTES = [
  "«Inside my heart is breaking, my makeup may be flaking, but my smile still stays on!»",
  "«I'll face it with a grin, I'm never giving in — on with the show!»",
  "«I'll top the bill, I'll overkill, I have to find the will to carry on!»",
  "«The show must go on! The show must go on!»",
  "«My soul is painted like the wings of butterflies, fairy tales of yesterday will grow but never die!»",
];

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  mode,
  state,
  timeLeft,
  totalTime,
  cycleIndex,
  longBreakInterval,
  activeTask,
  onSelectMode,
  onTogglePlay,
  onSkip,
  onReset,
  onAddMinutes,
  onOpenTasksTab,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const radius = 138;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Cycle roman numeral
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const currentActRoman = romanNumerals[cycleIndex - 1] || `${cycleIndex}`;
  const totalActsRoman = romanNumerals[longBreakInterval - 1] || `${longBreakInterval}`;

  // Quote
  const quote = useMemo(() => {
    return QUEEN_QUOTES[(cycleIndex - 1) % QUEEN_QUOTES.length];
  }, [cycleIndex]);

  // Mode visual settings
  const modeStyles = {
    focus: {
      title: 'Перформанс · Фокус',
      stroke: 'stroke-amber-400',
      glow: 'shadow-amber-500/30',
      track: 'stroke-amber-950/40',
      tag: 'bg-rose-950/70 border-amber-500/40 text-amber-300',
      buttonBg: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black hover:brightness-110 shadow-amber-500/30',
      nextLabel: 'Антракт',
    },
    shortBreak: {
      title: 'Антракт · Перерыв',
      stroke: 'stroke-emerald-400',
      glow: 'shadow-emerald-500/30',
      track: 'stroke-emerald-950/40',
      tag: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
      buttonBg: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-black hover:brightness-110 shadow-emerald-500/30',
      nextLabel: 'Перформанс',
    },
    longBreak: {
      title: 'Гранд-Антракт · Отдых',
      stroke: 'stroke-purple-400',
      glow: 'shadow-purple-500/30',
      track: 'stroke-purple-950/40',
      tag: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
      buttonBg: 'bg-gradient-to-r from-purple-500 via-fuchsia-400 to-amber-500 text-black hover:brightness-110 shadow-purple-500/30',
      nextLabel: 'Перформанс',
    },
  }[mode];

  return (
    <div className="relative flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4 py-4 sm:py-6">
      {/* Overhead Stage Spotlight Beam Effect */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 stage-spotlight pointer-events-none rounded-full blur-3xl" />

      {/* Mode Selector - Stage Program Tabs */}
      <div className="relative z-10 flex items-center gap-1.5 p-1.5 bg-[#120819]/90 border border-amber-500/30 rounded-2xl mb-6 shadow-xl shadow-black/50">
        <button
          onClick={() => onSelectMode('focus')}
          className={`px-4 py-2 text-xs sm:text-sm font-cinzel font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
            mode === 'focus'
              ? 'bg-gradient-to-r from-amber-500/30 to-rose-600/30 text-amber-200 border border-amber-400/50 shadow-md shadow-amber-950/50'
              : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/50'
          }`}
        >
          Шоу (25м)
        </button>

        <button
          onClick={() => onSelectMode('shortBreak')}
          className={`px-4 py-2 text-xs sm:text-sm font-cinzel font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 text-emerald-200 border border-emerald-400/50 shadow-md'
              : 'text-neutral-400 hover:text-emerald-200 hover:bg-neutral-900/50'
          }`}
        >
          Антракт (5м)
        </button>

        <button
          onClick={() => onSelectMode('longBreak')}
          className={`px-4 py-2 text-xs sm:text-sm font-cinzel font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-gradient-to-r from-purple-500/30 to-amber-600/30 text-purple-200 border border-purple-400/50 shadow-md'
              : 'text-neutral-400 hover:text-purple-200 hover:bg-neutral-900/50'
          }`}
        >
          Гранд-антракт (15м)
        </button>
      </div>

      {/* Main Theatrical Dial - Gold Vinyl Proscenium */}
      <div className="relative z-10 flex items-center justify-center w-[310px] h-[310px] sm:w-[350px] sm:h-[350px] mb-6 select-none">
        {/* Subtle decorative vinyl disc grooves */}
        <div className="absolute inset-4 rounded-full vinyl-grooves opacity-30 pointer-events-none" />
        <div className="absolute inset-2 rounded-full border border-amber-500/20 pointer-events-none" />
        <div className="absolute inset-0 rounded-full border border-amber-500/10 pointer-events-none" />

        <svg
          className="w-full h-full -rotate-90 transform drop-shadow-2xl"
          viewBox="0 0 320 320"
        >
          {/* Background Ring Track */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            className={`fill-none ${modeStyles.track}`}
            strokeWidth="9"
          />
          {/* Active Glowing Progress Ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            className={`fill-none ${modeStyles.stroke} transition-[stroke-dashoffset] duration-300 ease-linear drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]`}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Theatrical Stage Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {/* Act Badge with Royal Crown */}
          <div className="flex items-center gap-1.5 mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cinzel text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
              {modeStyles.title}
            </span>
          </div>

          {/* Epic Tabular Countdown */}
          <div className="font-mono text-6xl sm:text-7xl font-bold tracking-tight gold-text tabular-nums drop-shadow-[0_4px_16px_rgba(234,179,8,0.4)] my-0.5">
            {timeFormatted}
          </div>

          {/* Act indicator */}
          <div className="flex items-center gap-2 mt-2">
            {Array.from({ length: longBreakInterval }).map((_, i) => {
              const actNum = i + 1;
              const isPast = actNum < cycleIndex;
              const isCurrent = actNum === cycleIndex;
              return (
                <div
                  key={i}
                  title={`Акт ${actNum} из ${longBreakInterval}`}
                  className={`transition-all ${
                    isPast
                      ? 'w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50'
                      : isCurrent
                      ? 'w-3 h-3 rounded-full bg-gradient-to-r from-amber-300 to-rose-500 ring-2 ring-amber-400/80 scale-125 animate-pulse shadow-md shadow-amber-400'
                      : 'w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700'
                  }`}
                />
              );
            })}
          </div>

          <span className="font-cinzel text-[11px] tracking-[0.18em] text-amber-400/70 mt-1 uppercase">
            Акт {currentActRoman} из {totalActsRoman}
          </span>
        </div>
      </div>

      {/* Theatrical Motivational Lyric Quote */}
      <div className="w-full max-w-md text-center mb-5 px-3">
        <p className="font-playfair italic text-xs sm:text-[13px] text-amber-200/80 leading-relaxed tracking-wide">
          {quote}
        </p>
      </div>

      {/* Linked Task - Current Scene / Setlist Item */}
      <div className="w-full max-w-md mb-6">
        {activeTask ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#120819]/90 border border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-black/40 transition-all">
            <div className="flex items-center gap-3 overflow-hidden">
              <Mic2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-cinzel tracking-wider text-amber-400/70 uppercase">
                  Партия на сцене:
                </div>
                <div className="text-sm font-semibold text-neutral-100 truncate font-cinzel">
                  {activeTask.title}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenTasksTab}
              className="text-xs text-amber-300/80 hover:text-amber-200 flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 transition-all cursor-pointer"
            >
              <span>{activeTask.completedPomodoros}/{activeTask.estPomodoros} 👑</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenTasksTab}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-amber-500/30 text-amber-300/70 hover:text-amber-200 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all text-xs font-cinzel font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Выбрать номер из сет-листа для этого акта</span>
          </button>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          onClick={onReset}
          title="Сбросить акт (Esc)"
          className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onTogglePlay}
          className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-cinzel text-sm sm:text-base font-extrabold tracking-wider shadow-xl transition-all cursor-pointer active:scale-95 ${modeStyles.buttonBg}`}
        >
          {state === 'running' ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Пауза</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>
                {state === 'paused' ? 'Продолжить шоу' : 'Шоу начинается!'}
              </span>
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          title={`Пропустить и перейти: ${modeStyles.nextLabel} (Alt+N)`}
          className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Encore Extra Minutes */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => onAddMinutes(1)}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#140a1c] border border-amber-500/25 text-xs text-amber-300/80 hover:text-amber-200 hover:border-amber-500/50 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3 text-amber-400" />
          <span>+1 мин на бис</span>
        </button>
        <button
          onClick={() => onAddMinutes(5)}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#140a1c] border border-amber-500/25 text-xs text-amber-300/80 hover:text-amber-200 hover:border-amber-500/50 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3 text-amber-400" />
          <span>+5 мин на бис</span>
        </button>
      </div>

      {/* Shortcut hint */}
      <div className="text-[11px] text-neutral-400/80 flex items-center gap-2 font-mono">
        <span><kbd className="px-1.5 py-0.5 bg-neutral-900 border border-amber-500/20 rounded text-amber-300/90 font-mono">Пробел</kbd> Старт / Пауза</span>
        <span>·</span>
        <span><kbd className="px-1.5 py-0.5 bg-neutral-900 border border-amber-500/20 rounded text-amber-300/90 font-mono">Alt+N</kbd> Следующий акт</span>
      </div>
    </div>
  );
};
