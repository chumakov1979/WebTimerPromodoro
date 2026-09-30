import React from 'react';
import { X, Flame, Clock, Trophy, Calendar, CheckCircle2, Trash2, Crown, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#110818] border border-amber-500/40 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/25 bg-[#140a1c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">
                Триумф и Зал Славы
              </h2>
              <span className="text-[10px] font-cinzel text-amber-300/70 tracking-widest uppercase">
                История великих перформансов
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#09040e] border border-amber-500/20 flex flex-col">
              <span className="text-[10px] font-cinzel font-bold tracking-wider text-amber-400/70 uppercase mb-1">
                Сегодня
              </span>
              <span className="text-xl font-bold font-mono gold-text tabular-nums">
                {formatMins(todayStats.focusMinutes)}
              </span>
              <span className="text-[11px] text-amber-300/80 mt-1 font-cinzel">
                {todayStats.completedPomodoros} 👑 актов
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#09040e] border border-amber-500/20 flex flex-col">
              <span className="text-[10px] font-cinzel font-bold tracking-wider text-amber-400/70 uppercase mb-1">
                Всего на сцене
              </span>
              <span className="text-xl font-bold font-mono gold-text tabular-nums">
                {formatMins(totalFocusMinutes)}
              </span>
              <span className="text-[11px] text-neutral-400 mt-1 font-cinzel">чистого фокуса</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#09040e] border border-amber-500/20 flex flex-col">
              <span className="text-[10px] font-cinzel font-bold tracking-wider text-amber-400/70 uppercase mb-1">
                Серия шоу
              </span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                  {streak}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 font-cinzel">дней подряд</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#09040e] border border-amber-500/20 flex flex-col">
              <span className="text-[10px] font-cinzel font-bold tracking-wider text-amber-400/70 uppercase mb-1">
                Оваций 👑
              </span>
              <span className="text-xl font-bold font-mono gold-text tabular-nums">
                {totalPomodoros}
              </span>
              <span className="text-[11px] text-neutral-400 mt-1 font-cinzel">завершено</span>
            </div>
          </div>

          {/* 7-Day Bar Chart */}
          <div className="p-5 rounded-2xl bg-[#0a0510] border border-amber-500/25">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Сценические часы за 7 дней
              </span>
              <span className="text-xs text-amber-400/80 font-mono">
                Пик: {formatMins(maxMins)}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-36 pt-4">
              {dailyStats.map((d) => {
                const heightPercent = maxMins > 0 ? (d.focusMinutes / maxMins) * 100 : 0;
                const isToday = d.date === todayStr;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="text-[10px] text-amber-300/80 font-mono">
                      {d.focusMinutes > 0 ? `${d.focusMinutes}м` : ''}
                    </div>
                    <div className="w-full max-w-[32px] bg-neutral-900 rounded-t-md h-full flex items-end overflow-hidden p-0.5 border-b border-amber-500/40">
                      <div
                        style={{ height: `${Math.max(d.focusMinutes > 0 ? 8 : 0, heightPercent)}%` }}
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 shadow-md shadow-amber-400/50'
                            : d.focusMinutes > 0
                            ? 'bg-gradient-to-t from-rose-900 to-amber-500/80'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[11px] capitalize font-cinzel ${
                        isToday ? 'text-amber-300 font-bold' : 'text-neutral-500'
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
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Журнал сыгранных актов
              </span>
              <span className="text-xs text-neutral-400 font-cinzel">
                Показано {recentFocusSessions.length}
              </span>
            </div>

            {recentFocusSessions.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#09040e] border border-amber-500/20 text-xs text-neutral-400 font-cinzel">
                Сыгранных актов пока нет. Начните первое шоу!
              </div>
            ) : (
              <div className="divide-y divide-amber-500/15 rounded-2xl bg-[#09040e] border border-amber-500/20 overflow-hidden">
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
                      className="px-4 py-3 flex items-center justify-between text-xs hover:bg-amber-500/5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-neutral-200 font-cinzel font-semibold truncate">
                          {session.taskTitle || 'Соло-перформанс'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-neutral-400 font-mono">
                        <span className="text-amber-400 font-bold">+{session.durationMinutes} мин</span>
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
        <div className="px-6 py-4 border-t border-amber-500/25 bg-[#140a1c] flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Очистить весь концертный архив сессий?')) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-cinzel text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Очистить зал славы</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-cinzel font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
