import React, { useState } from 'react';
import { Plus, Check, Trash2, Crown, Mic, Music, Disc } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectActiveTask: (id: string | null) => void;
  onAddTask: (title: string, estPomodoros: number, notes?: string) => void;
  onToggleTaskComplete: (id: string) => void;
  onUpdatePomodoroCount: (id: string, delta: number) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onAddTask,
  onToggleTaskComplete,
  onUpdatePomodoroCount,
  onDeleteTask,
  onClearCompleted,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEst, setNewEst] = useState(2);
  const [newNotes, setNewNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const totalEst = tasks.reduce((sum, t) => sum + t.estPomodoros, 0);
  const totalCompletedPomos = tasks.reduce((sum, t) => sum + t.completedPomodoros, 0);
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), newEst, newNotes.trim() || undefined);
    setNewTitle('');
    setNewEst(2);
    setNewNotes('');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      {/* Setlist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/25">
        <div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-cinzel tracking-wider text-white">
              Концертный сет-лист
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-300/70 mt-1 font-cinzel">
            <span>{completedCount} из {tasks.length} партий исполнено</span>
            <span aria-hidden="true">·</span>
            <span>{totalCompletedPomos}/{totalEst} 👑 актов</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[#120819] p-1 rounded-xl border border-amber-500/30 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-cinzel font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-amber-200'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 text-xs font-cinzel font-medium rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-amber-200'
            }`}
          >
            На сцене
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-xs font-cinzel font-medium rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-amber-200'
            }`}
          >
            Бис
          </button>
        </div>
      </div>

      {/* Add Task Form or Button */}
      <div className="mt-5 mb-4">
        {isAdding ? (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-2xl bg-[#120819] border border-amber-500/40 shadow-2xl shadow-black/60 transition-all"
          >
            <input
              type="text"
              placeholder="Название партии или композиции..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-2.5 bg-[#09040d] border border-amber-500/30 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 mb-3.5 font-cinzel"
            />

            <div className="flex items-center justify-between gap-3 mb-3.5">
              <span className="text-xs font-cinzel text-amber-300/80">
                Сколько актов (25м) потребуется?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewEst(Math.max(1, newEst - 1))}
                  className="w-7 h-7 rounded-lg bg-neutral-800 text-amber-300 hover:bg-neutral-700 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-amber-400 w-6 text-center">
                  {newEst}
                </span>
                <button
                  type="button"
                  onClick={() => setNewEst(Math.min(10, newEst + 1))}
                  className="w-7 h-7 rounded-lg bg-neutral-800 text-amber-300 hover:bg-neutral-700 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <textarea
              placeholder="Сценические примечания, цитаты или аккорды (необязательно)"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 bg-[#09040d] border border-amber-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 mb-4 resize-none"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-cinzel font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 rounded-lg shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                Внести в сет-лист
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-amber-500/30 hover:border-amber-500/60 bg-[#120819]/50 hover:bg-[#120819] text-xs font-cinzel font-bold tracking-wider text-amber-300/80 hover:text-amber-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Добавить новый номер в сет-лист</span>
          </button>
        )}
      </div>

      {/* Task List Items */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-amber-500/20 bg-[#120819]/40">
            <Disc className="w-8 h-8 text-amber-500/40 mx-auto mb-2.5 animate-spin" style={{ animationDuration: '16s' }} />
            <p className="text-sm font-cinzel font-semibold text-amber-200">
              {filter === 'completed'
                ? 'Пока нет завершённых номеров'
                : 'Сет-лист пуст. Внесите первую партию!'}
            </p>
            <p className="text-xs text-amber-400/60 mt-1 font-playfair italic">
              «Show must go on — ни шагу назад на сцене!»
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`group p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-[#150a1f] border-amber-400/80 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40'
                    : task.completed
                    ? 'bg-[#0d0714]/60 border-neutral-900 opacity-60'
                    : 'bg-[#120819]/70 border-amber-500/20 hover:border-amber-500/40 hover:bg-[#120819]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => onToggleTaskComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-amber-400 text-black shadow-sm shadow-amber-400/50'
                        : 'border border-amber-500/40 hover:border-amber-300'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Title and Notes */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-cinzel font-semibold leading-snug break-words ${
                          task.completed
                            ? 'line-through text-neutral-400'
                            : 'text-neutral-100'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.notes && (
                      <p className="text-xs font-playfair italic text-amber-200/60 mt-1 line-clamp-2">
                        {task.notes}
                      </p>
                    )}

                    {/* Metadata & Act Count */}
                    <div className="flex items-center gap-3 mt-3">
                      {!task.completed && (
                        <button
                          onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                          className={`text-xs font-cinzel px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-400 text-black font-bold shadow-sm shadow-amber-400/40'
                              : 'text-amber-300/70 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/30'
                          }`}
                        >
                          {isActive ? '✓ На сцене' : 'Вывести на сцену'}
                        </button>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-amber-300/80 font-mono">
                        <button
                          onClick={() => onUpdatePomodoroCount(task.id, -1)}
                          disabled={task.completedPomodoros <= 0}
                          className="w-5 h-5 rounded hover:bg-neutral-800 flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-bold text-amber-300">
                          {task.completedPomodoros}/{task.estPomodoros} 👑
                        </span>
                        <button
                          onClick={() => onUpdatePomodoroCount(task.id, 1)}
                          className="w-5 h-5 rounded hover:bg-neutral-800 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0 opacity-80 group-hover:opacity-100"
                    title="Удалить из сет-листа"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Clear */}
      {completedCount > 0 && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClearCompleted}
            className="text-xs font-cinzel text-neutral-400 hover:text-amber-300 transition-colors"
          >
            Очистить исполненные ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
};
