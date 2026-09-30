/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TimerDisplay } from './components/TimerDisplay';
import { TaskList } from './components/TaskList';
import { AmbientSoundBar } from './components/AmbientSoundBar';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { ZenMode } from './components/ZenMode';
import { AmbientSoundType, SessionRecord, Settings, Task, TimerMode, TimerState } from './types';
import {
  DEFAULT_SETTINGS,
  getDailyStats,
  loadActiveTaskId,
  loadSessions,
  loadSettings,
  loadTasks,
  saveActiveTaskId,
  saveSessions,
  saveSettings,
  saveTasks,
} from './utils/storage';
import { ambientPlayer, playNotificationSound, playTick } from './utils/audio';
import { fireConfetti } from './utils/confetti';
import { Crown, Sparkles, Disc, Mic2, Flame } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [sessions, setSessions] = useState<SessionRecord[]>(loadSessions);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(loadActiveTaskId);

  // Timer state
  const [mode, setMode] = useState<TimerMode>('focus');
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(settings.focusDuration * 60);
  const [totalTime, setTotalTime] = useState<number>(settings.focusDuration * 60);
  const [cycleIndex, setCycleIndex] = useState<number>(1);

  // Views & Modals
  const [activeView, setActiveView] = useState<'timer' | 'tasks' | 'stats'>('timer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);
  const [isAmbientDrawerOpen, setIsAmbientDrawerOpen] = useState(false);
  const [currentAmbient, setCurrentAmbient] = useState<AmbientSoundType>(settings.ambientSound);
  const [ambientVolume, setAmbientVolume] = useState<number>(settings.ambientVolume);

  const timerRef = useRef<number | null>(null);
  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    if (newSettings.ambientSound !== currentAmbient) {
      setCurrentAmbient(newSettings.ambientSound);
      ambientPlayer.play(newSettings.ambientSound, newSettings.ambientVolume);
    }
    ambientPlayer.setVolume(newSettings.ambientVolume);

    if (state === 'idle') {
      let mins = newSettings.focusDuration;
      if (mode === 'shortBreak') mins = newSettings.shortBreakDuration;
      if (mode === 'longBreak') mins = newSettings.longBreakDuration;
      setTimeLeft(mins * 60);
      setTotalTime(mins * 60);
    }
  };

  const handleResetDefaults = () => {
    handleUpdateSettings(DEFAULT_SETTINGS);
  };

  const switchMode = useCallback(
    (newMode: TimerMode, autoStart = false) => {
      setMode(newMode);
      setState(autoStart ? 'running' : 'idle');

      let mins = settings.focusDuration;
      if (newMode === 'shortBreak') mins = settings.shortBreakDuration;
      if (newMode === 'longBreak') mins = settings.longBreakDuration;

      const durationSecs = mins * 60;
      setTimeLeft(durationSecs);
      setTotalTime(durationSecs);
    },
    [settings]
  );

  const handleSessionComplete = useCallback(() => {
    playNotificationSound(settings.soundNotification, settings.soundVolume);

    if (mode === 'focus') {
      fireConfetti();

      const durationMins = settings.focusDuration;
      const newRecord: SessionRecord = {
        id: `sess-${Date.now()}`,
        mode: 'focus',
        durationMinutes: durationMins,
        completedAt: Date.now(),
        taskId: activeTask ? activeTask.id : undefined,
        taskTitle: activeTask ? activeTask.title : undefined,
      };

      const updatedSessions = [...sessions, newRecord];
      setSessions(updatedSessions);
      saveSessions(updatedSessions);

      if (activeTaskId) {
        setTasks((prev) => {
          const nextTasks = prev.map((t) => {
            if (t.id === activeTaskId) {
              const updatedPomos = t.completedPomodoros + 1;
              return {
                ...t,
                completedPomodoros: updatedPomos,
                completed: updatedPomos >= t.estPomodoros ? true : t.completed,
              };
            }
            return t;
          });
          saveTasks(nextTasks);
          return nextTasks;
        });
      }

      const isLongBreakDue = cycleIndex >= settings.longBreakInterval;
      if (isLongBreakDue) {
        setCycleIndex(1);
        switchMode('longBreak', settings.autoStartBreaks);
      } else {
        setCycleIndex((prev) => prev + 1);
        switchMode('shortBreak', settings.autoStartBreaks);
      }
    } else {
      switchMode('focus', settings.autoStartPomodoros);
    }
  }, [
    mode,
    cycleIndex,
    settings,
    sessions,
    activeTask,
    activeTaskId,
    switchMode,
  ]);

  // Tick effect
  useEffect(() => {
    if (state === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }

          if (settings.tickingSound && mode === 'focus') {
            playTick(settings.tickingVolume);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state, mode, settings.tickingSound, settings.tickingVolume, handleSessionComplete]);

  // Sync document title with Queen flair
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel =
      mode === 'focus' ? 'Шоу' : mode === 'shortBreak' ? 'Антракт' : 'Гранд-антракт';

    if (state === 'running') {
      document.title = `(${timeFormatted}) ${modeLabel} — The Show Must Go On!`;
    } else if (state === 'paused') {
      document.title = `[Пауза] (${timeFormatted}) ${modeLabel} — Queen Pomotimer`;
    } else {
      document.title = 'The Show Must Go On — Queen Pomotimer';
    }
  }, [timeLeft, state, mode]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setState((prev) => (prev === 'running' ? 'paused' : 'running'));
      } else if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'Escape') {
        if (!isSettingsOpen && !isStatsOpen && !isZenOpen) {
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleTogglePlay = () => {
    setState((prev) => (prev === 'running' ? 'paused' : 'running'));
  };

  const handleReset = () => {
    setState('idle');
    let mins = settings.focusDuration;
    if (mode === 'shortBreak') mins = settings.shortBreakDuration;
    if (mode === 'longBreak') mins = settings.longBreakDuration;
    setTimeLeft(mins * 60);
    setTotalTime(mins * 60);
  };

  const handleSkip = () => {
    if (mode === 'focus') {
      const isLongBreak = cycleIndex >= settings.longBreakInterval;
      if (isLongBreak) {
        setCycleIndex(1);
        switchMode('longBreak', false);
      } else {
        setCycleIndex((prev) => prev + 1);
        switchMode('shortBreak', false);
      }
    } else {
      switchMode('focus', false);
    }
  };

  const handleAddMinutes = (mins: number) => {
    setTimeLeft((prev) => prev + mins * 60);
    setTotalTime((prev) => prev + mins * 60);
  };

  const handleAddTask = (title: string, estPomodoros: number, notes?: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      estPomodoros,
      completedPomodoros: 0,
      completed: false,
      createdAt: Date.now(),
      notes,
    };
    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    saveTasks(nextTasks);

    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
      saveActiveTaskId(newTask.id);
    }
  };

  const handleToggleTaskComplete = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      saveTasks(updated);
      return updated;
    });
  };

  const handleUpdatePomodoroCount = (id: string, delta: number) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completedPomodoros: Math.max(0, t.completedPomodoros + delta),
            }
          : t
      );
      saveTasks(updated);
      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
    if (activeTaskId === id) {
      setActiveTaskId(null);
      saveActiveTaskId(null);
    }
  };

  const handleClearCompletedTasks = () => {
    setTasks((prev) => {
      const updated = prev.filter((t) => !t.completed);
      saveTasks(updated);
      return updated;
    });
  };

  const handleSelectActiveTask = (id: string | null) => {
    setActiveTaskId(id);
    saveActiveTaskId(id);
  };

  const handleSelectAmbientSound = (sound: AmbientSoundType) => {
    setCurrentAmbient(sound);
    ambientPlayer.play(sound, ambientVolume);
    setSettings((prev) => {
      const updated = { ...prev, ambientSound: sound };
      saveSettings(updated);
      return updated;
    });
  };

  const handleChangeAmbientVolume = (vol: number) => {
    setAmbientVolume(vol);
    ambientPlayer.setVolume(vol);
    setSettings((prev) => {
      const updated = { ...prev, ambientVolume: vol };
      saveSettings(updated);
      return updated;
    });
  };

  const handleClearHistory = () => {
    setSessions([]);
    saveSessions([]);
  };

  return (
    <div className="min-h-screen bg-[#08040a] text-neutral-100 flex flex-col relative overflow-x-hidden">
      {/* Overhead Stage Spotlight Layer */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] stage-spotlight pointer-events-none blur-3xl opacity-70" />

      {/* Top Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleZen={() => setIsZenOpen(true)}
        onToggleAmbientDrawer={() => setIsAmbientDrawerOpen((prev) => !prev)}
        isAmbientPlaying={currentAmbient !== 'none'}
      />

      {/* Ambient Soundbar Drawer */}
      <AmbientSoundBar
        currentSound={currentAmbient}
        volume={ambientVolume}
        isOpen={isAmbientDrawerOpen}
        onClose={() => setIsAmbientDrawerOpen(false)}
        onSelectSound={handleSelectAmbientSound}
        onChangeVolume={handleChangeAmbientVolume}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {activeView === 'timer' && (
          <div>
            <TimerDisplay
              mode={mode}
              state={state}
              timeLeft={timeLeft}
              totalTime={totalTime}
              cycleIndex={cycleIndex}
              longBreakInterval={settings.longBreakInterval}
              activeTask={activeTask}
              onSelectMode={(m) => switchMode(m, false)}
              onTogglePlay={handleTogglePlay}
              onSkip={handleSkip}
              onReset={handleReset}
              onAddMinutes={handleAddMinutes}
              onOpenTasksTab={() => setActiveView('tasks')}
            />

            {/* Quick Setlist preview below timer */}
            <div className="mt-8 pt-8 border-t border-amber-500/20 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-cinzel font-bold uppercase tracking-[0.2em] text-amber-400/80">
                  Партии сегодняшней программы
                </span>
                <button
                  onClick={() => setActiveView('tasks')}
                  className="text-xs font-cinzel text-amber-300 hover:text-amber-100 font-bold transition-colors"
                >
                  Весь сет-лист ({tasks.length}) →
                </button>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => {
                  const isActive = activeTaskId === task.id;
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleSelectActiveTask(isActive ? null : task.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40'
                          : task.completed
                          ? 'bg-[#100816]/40 border-neutral-900 line-through text-neutral-400'
                          : 'bg-[#120819]/60 border-amber-500/20 hover:border-amber-500/40 hover:bg-[#120819] text-neutral-300'
                      }`}
                    >
                      <span className="truncate mr-3 font-cinzel font-medium">
                        {isActive && '👑 '}
                        {task.title}
                      </span>
                      <span className="font-mono text-amber-300/80 shrink-0 font-bold">
                        {task.completedPomodoros}/{task.estPomodoros} 👑
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Queen "The Show Must Go On" Philosophy Card */}
            <div className="mt-14 pt-8 border-t border-amber-500/20">
              <div className="max-w-3xl mx-auto rounded-3xl bg-[#110818]/70 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-sm shadow-2xl shadow-black">
                <div className="flex items-center gap-2.5 mb-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide">
                    Философия «The Show Must Go On» & Метод Помодоро
                  </h3>
                </div>

                <p className="font-playfair italic text-xs sm:text-sm text-amber-200/80 mb-6 leading-relaxed">
                  Когда Фредди Меркьюри записывал легендарную «The Show Must Go On», он был смертельно болен,
                  но подошёл к микрофону со словами: «I'll fucking do it, darling» — и спел сложнейшую вокальную партию
                  на одном дыхании. Этот таймер создан для такой же бескомпромиссной страсти к своему делу.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#09040e] border border-amber-500/20">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xs font-bold font-mono mb-2">
                      I
                    </div>
                    <div className="text-xs font-cinzel font-bold text-white mb-1">
                      Выход на сцену
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-normal">
                      Выберите одну главную партию из сет-листа и сосредоточьтесь только на ней.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#09040e] border border-amber-500/20">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xs font-bold font-mono mb-2">
                      II
                    </div>
                    <div className="text-xs font-cinzel font-bold text-white mb-1">
                      Шоу продолжается
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-normal">
                      25 минут абсолютной концентрации. Без соцсетей и отвлечений: зал затаил дыхание.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#09040e] border border-emerald-500/20">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-xs font-bold font-mono mb-2">
                      III
                    </div>
                    <div className="text-xs font-cinzel font-bold text-white mb-1">
                      Антракт
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-normal">
                      5 минут отдыха за кулисами: глоток воды, глубокое дыхание и разминка.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#09040e] border border-purple-500/20">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center text-xs font-bold font-mono mb-2">
                      IV
                    </div>
                    <div className="text-xs font-cinzel font-bold text-white mb-1">
                      Гранд-финал
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-normal">
                      После 4 актов — заслуженный гранд-антракт на 15–30 минут под оглушительные овации.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'tasks' && (
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectActiveTask={handleSelectActiveTask}
            onAddTask={handleAddTask}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdatePomodoroCount={handleUpdatePomodoroCount}
            onDeleteTask={handleDeleteTask}
            onClearCompleted={handleClearCompletedTasks}
          />
        )}

        {activeView === 'stats' && (
          <div className="max-w-xl mx-auto">
            <StatsModal
              isOpen={true}
              onClose={() => setActiveView('timer')}
              sessions={sessions}
              dailyStats={getDailyStats(sessions)}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-500/20 py-6 text-center text-xs text-neutral-400 relative z-10 bg-[#07030b]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-cinzel text-amber-300/80">
            <span>The Show Must Go On</span>
            <span aria-hidden="true">·</span>
            <span>Queen Productivity Engine</span>
          </div>
          <div className="flex items-center gap-3 font-cinzel text-xs text-neutral-400">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              Кулисы
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsStatsOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              Зал славы
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsZenOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              Дзен-сцена
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
        onResetDefaults={handleResetDefaults}
      />

      {isStatsOpen && (
        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          sessions={sessions}
          dailyStats={getDailyStats(sessions)}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* Fullscreen Theatrical Zen Mode */}
      <ZenMode
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
        mode={mode}
        state={state}
        timeLeft={timeLeft}
        totalTime={totalTime}
        activeTask={activeTask}
        onTogglePlay={handleTogglePlay}
        onSkip={handleSkip}
        onReset={handleReset}
        currentAmbient={currentAmbient}
        onToggleAmbient={() => setIsAmbientDrawerOpen((prev) => !prev)}
      />
    </div>
  );
}
