export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type TimerState = 'idle' | 'running' | 'paused';

export type SoundNotificationType = 'queenFanfare' | 'ovation' | 'chime' | 'gong' | 'guitar';
export type AmbientSoundType = 'none' | 'vinyl' | 'crowd' | 'rain' | 'binaural' | 'fireplace';

export interface Settings {
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // acts until long break (e.g. 4)
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundNotification: SoundNotificationType;
  soundVolume: number; // 0-100
  tickingSound: boolean;
  tickingVolume: number; // 0-100
  ambientSound: AmbientSoundType;
  ambientVolume: number; // 0-100
}

export interface Task {
  id: string;
  title: string;
  estPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: number;
  notes?: string;
}

export interface SessionRecord {
  id: string;
  mode: TimerMode;
  durationMinutes: number;
  completedAt: number; // timestamp
  taskId?: string;
  taskTitle?: string;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  completedPomodoros: number;
}
