import React from 'react';
import { X, Flame, Calendar, Trash2, Crown, Sparkles, Trophy } from 'lucide-react';
import { DailyStat, SessionRecord } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionRecord[];
  dailyStats: DailyStat[];
  onClearHistory: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  dailyStats,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayStats = dailyStats.find((d) => d.date === todayStr) || {
    date: todayStr,
    focusMinutes: 0,
    completedPomodoros: 0,
  };

  const totalFocusMinutes = sessions
    .filter((s) => s.mode === 'focus')
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const totalPomodoros = sessions.filter((s) => s.mode === 'focus').length;

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const stat = dailyStats.find((s) => s.date === dateStr);
    if (stat && stat.completedPomodoros > 0) {
      streak += 1;
    } else if (i > 0) {
      break;
    }
  }

  const maxMins = Math.max(...dailyStats.map((d) => d.focusMinutes), 60);

  const formatMins = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}ч ${m}м` : `${h} ч`;
    }
    return `${mins} мин`;
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  const recentFocusSessions = sessions
    .filter((s) => s.mode === 'focus')
    .slice(-10)
    .reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white border-3 border-neutral-900 rounded-2xl poster-shadow overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-neutral-900 bg-[#ffd000]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white border-2 border-neutral-900 rounded-lg flex items-center justify-center text-neutral-950 poster-shadow-sm">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl font-black text-neutral-950 tracking-wider uppercase leading-none">
                Триумф и Зал Славы
              </h2>
              <span className="text-[11px] font-oswald text-neutral-800 tracking-wider uppercase font-bold">
                Хроника лучших перформансов
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-50 border-2 border-neutral-900 flex flex-col">
              <span className="text-[11px] font-bebas tracking-wider text-neutral-600 uppercase mb-0.5">
                Сегодня
              </span>
              <span className="text-2xl font-mono font-black text-neutral-950 tabular-nums">
                {formatMins(todayStats.focusMinutes)}
              </span>
              <span className="text-[11px] text-neutral-800 mt-1 font-oswald font-bold">
                {todayStats.completedPomodoros} 👑 актов
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border-2 border-neutral-900 flex flex-col">
              <span className="text-[11px] font-bebas tracking-wider text-neutral-600 uppercase mb-0.5">
                Всего соло
              </span>
              <span className="text-2xl font-mono font-black text-neutral-950 tabular-nums">
                {formatMins(totalFocusMinutes)}
              </span>
              <span className="text-[11px] text-neutral-600 mt-1 font-oswald font-semibold">чистого фокуса</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border-2 border-neutral-900 flex flex-col">
              <span className="text-[11px] font-bebas tracking-wider text-neutral-600 uppercase mb-0.5">
                Серия дней
              </span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-[#ffd000] fill-[#ffd000] stroke-neutral-900 stroke-[1.5]" />
                <span className="text-2xl font-mono font-black text-neutral-950 tabular-nums">
                  {streak}
                </span>
              </div>
              <span className="text-[11px] text-neutral-600 mt-1 font-oswald font-semibold">дней подряд</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border-2 border-neutral-900 flex flex-col">
              <span className="text-[11px] font-bebas tracking-wider text-neutral-600 uppercase mb-0.5">
                Оваций 👑
              </span>
              <span className="text-2xl font-mono font-black text-neutral-950 tabular-nums">
                {totalPomodoros}
              </span>
              <span className="text-[11px] text-neutral-600 mt-1 font-oswald font-semibold">завершено</span>
            </div>
          </div>

          {/* 7-Day Bar Chart */}
          <div className="p-5 rounded-xl bg-white border-2 border-neutral-900 poster-shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bebas text-lg uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-900" />
                Сценические часы за 7 дней
              </span>
              <span className="text-xs text-neutral-700 font-mono font-bold">
                Пик: {formatMins(maxMins)}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-36 pt-4">
              {dailyStats.map((d) => {
                const heightPercent = maxMins > 0 ? (d.focusMinutes / maxMins) * 100 : 0;
                const isToday = d.date === todayStr;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="text-[10px] text-neutral-700 font-mono font-bold">
                      {d.focusMinutes > 0 ? `${d.focusMinutes}м` : ''}
                    </div>
                    <div className="w-full max-w-[34px] bg-neutral-100 rounded-t h-full flex items-end overflow-hidden p-0.5 border-2 border-b-4 border-neutral-900">
                      <div
                        style={{ height: `${Math.max(d.focusMinutes > 0 ? 10 : 0, heightPercent)}%` }}
                        className={`w-full rounded-t transition-all duration-500 ${
                          isToday ? 'bg-[#ffd000]' : d.focusMinutes > 0 ? 'bg-neutral-900' : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs uppercase font-oswald font-bold ${
                        isToday ? 'text-[#ffd000] bg-neutral-950 px-1 rounded' : 'text-neutral-600'
                      }`}
                    >
                      {getDayName(d.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Performances Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bebas text-base uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-neutral-900" />
                Журнал сыгранных актов
              </span>
              <span className="text-xs text-neutral-600 font-oswald font-semibold uppercase">
                Показано {recentFocusSessions.length}
              </span>
            </div>

            {recentFocusSessions.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-neutral-50 border-2 border-neutral-900 text-xs text-neutral-600 font-oswald uppercase">
                Сыгранных актов пока нет. Начните первое шоу!
              </div>
            ) : (
              <div className="divide-y-2 divide-neutral-900 rounded-xl bg-white border-2 border-neutral-900 overflow-hidden">
                {recentFocusSessions.map((session) => {
                  const date = new Date(session.completedAt);
                  const timeStr = date.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const dateStr = date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <div
                      key={session.id}
                      className="px-4 py-3 flex items-center justify-between text-xs hover:bg-[#ffd000]/20 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles className="w-4 h-4 text-[#ffd000] fill-[#ffd000] shrink-0" />
                        <span className="text-neutral-900 font-oswald font-bold uppercase truncate">
                          {session.taskTitle || 'Соло-перформанс'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-neutral-700 font-mono">
                        <span className="text-neutral-950 font-black bg-[#ffd000] px-1.5 py-0.5 rounded border border-neutral-900">
                          +{session.durationMinutes} мин
                        </span>
                        <span>{dateStr}, {timeStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-neutral-900 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Очистить весь концертный архив сессий?')) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-oswald font-bold uppercase text-neutral-500 hover:text-[#dc2626] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Очистить зал славы</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 font-bebas text-base tracking-wider text-neutral-950 bg-[#ffd000] hover:bg-[#ffdc2e] border-2 border-neutral-950 rounded-lg poster-shadow-sm transition-all cursor-pointer font-bold"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
