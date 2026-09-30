import React, { useMemo } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus, ChevronRight, Mic2, Sparkles } from 'lucide-react';
import { TimerMode, TimerState, Task } from '../types';

interface TimerDisplayProps {
  mode: TimerMode;
  state: TimerState;
  timeLeft: number;
  totalTime: number;
  cycleIndex: number;
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

  const quote = useMemo(() => {
    return QUEEN_QUOTES[(cycleIndex - 1) % QUEEN_QUOTES.length];
  }, [cycleIndex]);

  const modeStyles = {
    focus: {
      title: 'ШОУ · ФОКУС',
      stroke: 'stroke-[#ffd000]',
      track: 'stroke-neutral-200',
      activeTab: 'bg-[#ffd000] text-neutral-900 border-2 border-neutral-900 poster-shadow-sm',
      nextLabel: 'Антракт',
    },
    shortBreak: {
      title: 'АНТРАКТ · ПЕРЕРЫВ',
      stroke: 'stroke-[#e11d48]',
      track: 'stroke-neutral-200',
      activeTab: 'bg-[#e11d48] text-white border-2 border-neutral-900 poster-shadow-sm',
      nextLabel: 'Шоу',
    },
    longBreak: {
      title: 'ГРАНД-АНТРАКТ · ОТДЫХ',
      stroke: 'stroke-neutral-900',
      track: 'stroke-neutral-200',
      activeTab: 'bg-neutral-900 text-[#ffd000] border-2 border-neutral-900 poster-shadow-sm',
      nextLabel: 'Шоу',
    },
  }[mode];

  return (
    <div className="relative flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4 py-4 sm:py-6">
      {/* Mode Selector Tabs in Poster Aesthetic */}
      <div className="relative z-10 flex items-center gap-2 p-1.5 bg-white border-2 border-neutral-900 rounded-xl mb-6 poster-shadow">
        <button
          onClick={() => onSelectMode('focus')}
          className={`px-4 py-2 font-bebas text-lg tracking-wider rounded-lg transition-all cursor-pointer ${
            mode === 'focus'
              ? modeStyles.activeTab
              : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Шоу (25м)
        </button>

        <button
          onClick={() => onSelectMode('shortBreak')}
          className={`px-4 py-2 font-bebas text-lg tracking-wider rounded-lg transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? modeStyles.activeTab
              : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Антракт (5м)
        </button>

        <button
          onClick={() => onSelectMode('longBreak')}
          className={`px-4 py-2 font-bebas text-lg tracking-wider rounded-lg transition-all cursor-pointer ${
            mode === 'longBreak'
              ? modeStyles.activeTab
              : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Гранд-антракт (15м)
        </button>
      </div>

      {/* Main Theatrical Dial */}
      <div className="relative z-10 flex items-center justify-center w-[310px] h-[310px] sm:w-[350px] sm:h-[350px] mb-6 select-none">
        {/* Dial Center White Card with Solid 3px Black Border & Poster Shadow */}
        <div className="absolute inset-3 rounded-full bg-white border-3 border-neutral-900 poster-shadow pointer-events-none" />

        <svg
          className="w-full h-full -rotate-90 transform drop-shadow-sm"
          viewBox="0 0 320 320"
        >
          {/* Background Ring Track */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            className={`fill-none ${modeStyles.track}`}
            strokeWidth="10"
          />
          {/* Active Glowing Progress Ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            className={`fill-none ${modeStyles.stroke} transition-[stroke-dashoffset] duration-300 ease-linear`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {/* Mode Pill */}
          <div className="px-3 py-0.5 rounded-md bg-neutral-900 text-[#ffd000] font-bebas text-sm tracking-wider uppercase mb-1">
            {modeStyles.title}
          </div>

          {/* Bold Time Digits */}
          <div className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-neutral-950 tabular-nums my-0.5">
            {timeFormatted}
          </div>

          {/* Act indicator dots */}
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
                      ? 'w-3 h-3 rounded-full bg-neutral-900'
                      : isCurrent
                      ? 'w-3.5 h-3.5 rounded-full bg-[#ffd000] border-2 border-neutral-900 scale-125 animate-pulse'
                      : 'w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-400'
                  }`}
                />
              );
            })}
          </div>

          <span className="font-bebas text-sm tracking-wider text-neutral-700 mt-1 uppercase">
            Акт {cycleIndex} из {longBreakInterval}
          </span>
        </div>
      </div>

      {/* Motivational Lyric Quote */}
      <div className="w-full max-w-md text-center mb-5 px-3">
        <p className="font-oswald text-xs sm:text-sm text-neutral-800 font-semibold uppercase tracking-wide leading-relaxed">
          {quote}
        </p>
      </div>

      {/* Linked Task - Current Scene / Setlist Item */}
      <div className="w-full max-w-md mb-6">
        {activeTask ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border-2 border-neutral-900 poster-shadow transition-all">
            <div className="flex items-center gap-3 overflow-hidden">
              <Mic2 className="w-5 h-5 text-neutral-900 shrink-0 stroke-[2.5]" />
              <div className="min-w-0">
                <div className="text-[10px] font-bebas tracking-wider text-neutral-500 uppercase">
                  Партия на сцене:
                </div>
                <div className="text-sm font-bold text-neutral-900 truncate font-oswald uppercase">
                  {activeTask.title}
                </div>
              </div>
            </div>
            <button
              onClick={onOpenTasksTab}
              className="text-xs font-bebas text-neutral-900 flex items-center gap-1 shrink-0 px-2.5 py-1 rounded bg-[#ffd000] border border-neutral-900 transition-all cursor-pointer font-bold tracking-wide"
            >
              <span>{activeTask.completedPomodoros}/{activeTask.estPomodoros} 👑</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenTasksTab}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-neutral-400 bg-white text-neutral-900 hover:border-neutral-900 hover:bg-[#ffd000]/20 transition-all text-xs font-oswald font-bold uppercase cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffd000] fill-[#ffd000]" />
            <span>+ Выбрать номер из сет-листа для этого акта</span>
          </button>
        )}
      </div>

      {/* Primary Action Buttons in Poster Aesthetic */}
      <div className="flex items-center justify-center gap-3.5 mb-5">
        <button
          onClick={onReset}
          title="Сбросить акт (Esc)"
          className="p-3.5 rounded-xl bg-white border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-100 poster-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-xl font-bebas text-xl sm:text-2xl tracking-wider bg-[#ffd000] hover:bg-[#ffdc2e] text-neutral-950 border-3 border-neutral-950 poster-shadow transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {state === 'running' ? (
            <>
              <Pause className="w-6 h-6 fill-current" />
              <span>Пауза</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" />
              <span>
                {state === 'paused' ? 'Продолжить шоу' : 'Шоу начинается!'}
              </span>
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          title={`Пропустить и перейти: ${modeStyles.nextLabel} (Alt+N)`}
          className="p-3.5 rounded-xl bg-white border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-100 poster-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
        >
          <SkipForward className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Encore Extra Minutes */}
      <div className="flex items-center gap-2.5 mb-3">
        <button
          onClick={() => onAddMinutes(1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border-2 border-neutral-900 text-xs font-oswald font-bold uppercase text-neutral-900 hover:bg-[#ffd000] poster-shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+1 мин на бис</span>
        </button>
        <button
          onClick={() => onAddMinutes(5)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border-2 border-neutral-900 text-xs font-oswald font-bold uppercase text-neutral-900 hover:bg-[#ffd000] poster-shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+5 мин на бис</span>
        </button>
      </div>

      {/* Shortcut hint */}
      <div className="text-[11px] font-mono text-neutral-600 flex items-center gap-2">
        <span><kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-900 font-bold">Пробел</kbd> Старт / Пауза</span>
        <span>·</span>
        <span><kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-900 font-bold">Alt+N</kbd> Пропуск</span>
      </div>
    </div>
  );
};
