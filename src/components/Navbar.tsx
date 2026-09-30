import React from 'react';
import { Crown, Settings as SettingsIcon, Maximize2, Disc3, ListMusic, Trophy, Clock } from 'lucide-react';

interface NavbarProps {
  activeView: 'timer' | 'tasks' | 'stats';
  setActiveView: (view: 'timer' | 'tasks' | 'stats') => void;
  onOpenSettings: () => void;
  onToggleZen: () => void;
  onToggleAmbientDrawer: () => void;
  isAmbientPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenSettings,
  onToggleZen,
  onToggleAmbientDrawer,
  isAmbientPlaying,
}) => {
  return (
    <header className="w-full border-b-2 border-neutral-900 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Graphic Brand Lockup matching Poster */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffd000] border-2 border-neutral-900 rounded-lg flex items-center justify-center poster-shadow-sm">
            <span className="font-bebas text-2xl font-black text-neutral-900 leading-none">Q</span>
          </div>

          <button
            onClick={() => setActiveView('timer')}
            className="flex flex-col text-left group cursor-pointer"
          >
            <span className="font-bebas text-2xl sm:text-3xl font-black tracking-wide uppercase text-neutral-900 leading-none group-hover:text-[#ffd000] transition-colors">
              The Show Must Go On
            </span>
            <span className="text-[10px] tracking-[0.25em] font-oswald font-bold text-neutral-600 uppercase">
              Queen Pomodoro Timer
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Buttons */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveView('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider transition-all border-2 ${
              activeView === 'timer'
                ? 'bg-[#ffd000] text-neutral-900 border-neutral-900 poster-shadow-sm'
                : 'bg-white text-neutral-700 border-transparent hover:border-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Clock className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Сцена</span>
          </button>

          <button
            onClick={() => setActiveView('tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider transition-all border-2 ${
              activeView === 'tasks'
                ? 'bg-[#ffd000] text-neutral-900 border-neutral-900 poster-shadow-sm'
                : 'bg-white text-neutral-700 border-transparent hover:border-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <ListMusic className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Сет-лист</span>
          </button>

          <button
            onClick={() => setActiveView('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider transition-all border-2 ${
              activeView === 'stats'
                ? 'bg-[#ffd000] text-neutral-900 border-neutral-900 poster-shadow-sm'
                : 'bg-white text-neutral-700 border-transparent hover:border-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Trophy className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Триумф</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAmbientDrawer}
            title="Винил и звуки сцены"
            className={`p-2 rounded-lg text-sm transition-all border-2 ${
              isAmbientPlaying
                ? 'bg-[#ffd000] text-neutral-900 border-neutral-900 poster-shadow-sm'
                : 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-900'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${isAmbientPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          <button
            onClick={onToggleZen}
            title="Полноэкранный плакат (Дзен-сцена)"
            className="p-2 rounded-lg text-sm bg-white border-2 border-neutral-300 text-neutral-800 hover:border-neutral-900 hover:bg-[#ffd000] transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Настройки"
            className="p-2 rounded-lg text-sm bg-white border-2 border-neutral-300 text-neutral-800 hover:border-neutral-900 hover:bg-[#ffd000] transition-all cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
