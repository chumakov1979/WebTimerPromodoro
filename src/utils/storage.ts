import { DailyStat, SessionRecord, Settings, Task } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'queen_show_pomotimer_settings_v2',
  TASKS: 'queen_show_pomotimer_tasks_v2',
  SESSIONS: 'queen_show_pomotimer_sessions_v2',
  ACTIVE_TASK_ID: 'queen_show_pomotimer_active_task_v2',
};

export const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundNotification: 'queenFanfare',
  soundVolume: 80,
  tickingSound: false,
  tickingVolume: 30,
  ambientSound: 'vinyl',
  ambientVolume: 35,
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Шоу должно продолжаться: главный проект дня',
    estPomodoros: 4,
    completedPomodoros: 1,
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
    notes: '«Inside my heart is breaking, my makeup may be flaking, but my smile still stays on!»',
  },
  {
    id: 'task-2',
    title: 'Саундчек: разобрать важную почту и контакты',
    estPomodoros: 1,
    completedPomodoros: 1,
    completed: true,
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'task-3',
    title: 'Гранд-финал: подготовка ключевой презентации',
    estPomodoros: 3,
    completedPomodoros: 0,
    completed: false,
    createdAt: Date.now() - 3600000,
  },
];

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TASKS;
  } catch (e) {
    console.error('Failed to load tasks:', e);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
}

export function loadSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      const today = new Date();
      return [
        {
          id: 'demo-1',
          mode: 'focus',
          durationMinutes: 25,
          completedAt: today.getTime() - 1000 * 60 * 110,
          taskTitle: 'Саундчек: разобрать важную почту и контакты',
        },
        {
          id: 'demo-2',
          mode: 'shortBreak',
          durationMinutes: 5,
          completedAt: today.getTime() - 1000 * 60 * 80,
        },
        {
          id: 'demo-3',
          mode: 'focus',
          durationMinutes: 25,
          completedAt: today.getTime() - 1000 * 60 * 45,
          taskTitle: 'Шоу должно продолжаться: главный проект дня',
        },
      ];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load sessions:', e);
    return [];
  }
}

export function saveSessions(sessions: SessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

export function loadActiveTaskId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK_ID);
  } catch (e) {
    return null;
  }
}

export function saveActiveTaskId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    }
  } catch (e) {
    // ignore
  }
}

export function getDailyStats(sessions: SessionRecord[]): DailyStat[] {
  const statsMap: Record<string, DailyStat> = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    statsMap[dateStr] = {
      date: dateStr,
      focusMinutes: 0,
      completedPomodoros: 0,
    };
  }

  sessions.forEach((s) => {
    if (s.mode === 'focus') {
      const dateStr = new Date(s.completedAt).toISOString().split('T')[0];
      if (!statsMap[dateStr]) {
        statsMap[dateStr] = {
          date: dateStr,
          focusMinutes: 0,
          completedPomodoros: 0,
        };
      }
      statsMap[dateStr].focusMinutes += s.durationMinutes;
      statsMap[dateStr].completedPomodoros += 1;
    }
  });

  return Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date));
}
