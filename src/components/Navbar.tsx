import React from 'react';
import { Crown, Sparkles, Settings as SettingsIcon, Maximize2, Disc3, ListMusic, Trophy, Clock } from 'lucide-react';

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
    <header className="w-full border-b border-amber-500/20 bg-[#0c0612]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Royal Crown & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-rose-700 p-0.5 shadow-lg shadow-amber-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0714] rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400 stroke-[2.2]" />
            </div>
          </div>

          <button
            onClick={() => setActiveView('timer')}
            className="flex flex-col text-left group cursor-pointer"
          >
            <span className="font-cinzel text-base sm:text-lg font-extrabold tracking-[0.16em] uppercase gold-text leading-tight group-hover:brightness-110 transition-all">
              The Show Must Go On
            </span>
            <span className="text-[10px] tracking-[0.25em] font-cinzel text-amber-400/70 uppercase">
              Queen Productivity
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveView('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium tracking-wide transition-all ${
              activeView === 'timer'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/40 font-semibold'
                : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/60'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400/80" />
            <span className="hidden sm:inline">Сцена</span>
          </button>

          <button
            onClick={() => setActiveView('tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium tracking-wide transition-all ${
              activeView === 'tasks'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/40 font-semibold'
                : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/60'
            }`}
          >
            <ListMusic className="w-4 h-4 text-amber-400/80" />
            <span className="hidden sm:inline">Сет-лист</span>
          </button>

          <button
            onClick={() => setActiveView('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium tracking-wide transition-all ${
              activeView === 'stats'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/40 font-semibold'
                : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/60'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400/80" />
            <span className="hidden sm:inline">Триумф</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAmbientDrawer}
            title="Винил и атмосфера концерта"
            className={`p-2 rounded-lg text-sm transition-all border ${
              isAmbientPlaying
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20 animate-pulse'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-amber-200 hover:border-amber-500/30'
            }`}
          >
            <Disc3 className={`w-4 h-4 ${isAmbientPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            onClick={onToggleZen}
            title="Гранд-сцена (Полноэкранный режим)"
            className="p-2 rounded-lg text-sm bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-200 hover:border-amber-500/30 transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Кулисы и настройки"
            className="p-2 rounded-lg text-sm bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-200 hover:border-amber-500/30 transition-all cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
