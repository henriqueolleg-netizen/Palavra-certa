import React from 'react';
import { Home, Sparkles, Bookmark, Settings } from 'lucide-react';
import type { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'devotional', icon: Sparkles, label: 'Devocional' },
  { id: 'saved', icon: Bookmark, label: 'Salvos' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-slate-700 z-40">
      <div className="max-w-2xl mx-auto flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className="flex flex-col items-center justify-center w-full pt-3 pb-2 text-sm font-medium transition-colors"
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <item.icon 
                size={24} 
                className={`mb-1 transition-all ${activePage === item.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
                strokeWidth={activePage === item.id ? 2.5 : 2}
            />
            <span className={`transition-colors ${activePage === item.id ? 'text-purple-700 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
              {item.label}
            </span>
             {activePage === item.id && (
                <div className="w-8 h-1 bg-purple-600 dark:bg-purple-400 rounded-full mt-1 transition-all"></div>
             )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
