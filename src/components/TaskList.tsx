import React, { useState } from 'react';
import { Plus, Check, Trash2, Music, Disc } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-neutral-900">
        <div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-neutral-900 stroke-[2.5]" />
            <h2 className="text-2xl font-bebas tracking-wider text-neutral-900 uppercase">
              Концертный сет-лист
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-700 mt-0.5 font-oswald font-semibold uppercase">
            <span>{completedCount} из {tasks.length} партий исполнено</span>
            <span aria-hidden="true">·</span>
            <span>{totalCompletedPomos}/{totalEst} 👑 актов</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border-2 border-neutral-900 poster-shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 font-bebas text-sm uppercase tracking-wider rounded transition-colors ${
              filter === 'all'
                ? 'bg-[#ffd000] text-neutral-900 border border-neutral-900 font-bold'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 font-bebas text-sm uppercase tracking-wider rounded transition-colors ${
              filter === 'active'
                ? 'bg-[#ffd000] text-neutral-900 border border-neutral-900 font-bold'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            На сцене
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 font-bebas text-sm uppercase tracking-wider rounded transition-colors ${
              filter === 'completed'
                ? 'bg-[#ffd000] text-neutral-900 border border-neutral-900 font-bold'
                : 'text-neutral-700 hover:text-neutral-900'
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
            className="p-5 rounded-xl bg-white border-2 border-neutral-900 poster-shadow transition-all"
          >
            <input
              type="text"
              placeholder="Название партии или композиции..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white mb-3.5 font-oswald font-semibold uppercase"
            />

            <div className="flex items-center justify-between gap-3 mb-3.5">
              <span className="text-xs font-oswald font-bold uppercase text-neutral-800">
                Сколько актов (25м) потребуется?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewEst(Math.max(1, newEst - 1))}
                  className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-900 text-neutral-900 hover:bg-[#ffd000] flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-mono text-base font-bold text-neutral-900 w-6 text-center">
                  {newEst}
                </span>
                <button
                  type="button"
                  onClick={() => setNewEst(Math.min(10, newEst + 1))}
                  className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-900 text-neutral-900 hover:bg-[#ffd000] flex items-center justify-center font-bold"
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
              className="w-full px-3.5 py-2 bg-neutral-50 border-2 border-neutral-900 rounded-lg text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:bg-white mb-4 resize-none"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 text-xs font-oswald font-bold uppercase text-neutral-700 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bebas tracking-wider text-neutral-950 bg-[#ffd000] hover:bg-[#ffdc2e] border-2 border-neutral-900 rounded-lg poster-shadow-sm transition-all cursor-pointer font-bold"
              >
                Внести в сет-лист
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-neutral-900 bg-white hover:bg-[#ffd000]/20 text-sm font-bebas tracking-wider text-neutral-900 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 text-neutral-900 stroke-[3]" />
            <span>+ Добавить новый номер в сет-лист</span>
          </button>
        )}
      </div>

      {/* Task List Items */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border-2 border-neutral-900 bg-white poster-shadow-sm">
            <Disc className="w-8 h-8 text-neutral-400 mx-auto mb-2.5 animate-spin" style={{ animationDuration: '16s' }} />
            <p className="font-bebas text-lg tracking-wider text-neutral-900 uppercase">
              {filter === 'completed'
                ? 'Пока нет завершённых номеров'
                : 'Сет-лист пуст. Внесите первую партию!'}
            </p>
            <p className="text-xs text-neutral-600 mt-1 font-oswald font-semibold uppercase">
              «The Show Must Go On — на сцене до конца!»
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`group p-4 rounded-xl border-2 border-neutral-900 transition-all ${
                  isActive
                    ? 'bg-[#ffd000]/30 poster-shadow ring-2 ring-[#ffd000]'
                    : task.completed
                    ? 'bg-neutral-100 opacity-60'
                    : 'bg-white hover:bg-neutral-50 poster-shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => onToggleTaskComplete(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-md border-2 border-neutral-900 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.completed ? 'bg-[#ffd000] text-neutral-900' : 'bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3.5]" />}
                  </button>

                  {/* Title and Notes */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-base font-oswald font-bold leading-snug break-words uppercase ${
                          task.completed
                            ? 'line-through text-neutral-400'
                            : 'text-neutral-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.notes && (
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2 font-medium">
                        {task.notes}
                      </p>
                    )}

                    {/* Metadata & Act Count */}
                    <div className="flex items-center gap-3 mt-3">
                      {!task.completed && (
                        <button
                          onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                          className={`text-xs font-bebas tracking-wide px-3 py-1 rounded transition-all cursor-pointer border border-neutral-900 ${
                            isActive
                              ? 'bg-[#ffd000] text-neutral-950 font-bold'
                              : 'text-neutral-900 hover:bg-[#ffd000] bg-white'
                          }`}
                        >
                          {isActive ? '✓ На сцене' : 'Вывести на сцену'}
                        </button>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-mono">
                        <button
                          onClick={() => onUpdatePomodoroCount(task.id, -1)}
                          disabled={task.completedPomodoros <= 0}
                          className="w-6 h-6 rounded border border-neutral-400 hover:bg-neutral-200 flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-bold text-neutral-900">
                          {task.completedPomodoros}/{task.estPomodoros} 👑
                        </span>
                        <button
                          onClick={() => onUpdatePomodoroCount(task.id, 1)}
                          className="w-6 h-6 rounded border border-neutral-400 hover:bg-neutral-200 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-neutral-400 hover:text-[#dc2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0 opacity-80 group-hover:opacity-100"
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
            className="text-xs font-oswald font-bold uppercase text-neutral-600 hover:text-[#dc2626] transition-colors"
          >
            Очистить исполненные ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
};
