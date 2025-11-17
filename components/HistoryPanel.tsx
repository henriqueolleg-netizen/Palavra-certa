import React from 'react';
import type { SearchHistoryItem } from '../types';
import { Trash2, SearchX } from 'lucide-react';

interface HistoryPanelProps {
  history: SearchHistoryItem[];
  onItemClick: (feeling: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onItemClick, onClear }) => {
  if (history.length === 0) {
    return (
       <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 text-center animate-fadeIn">
         <SearchX size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2"/>
         <p className="text-gray-600 dark:text-gray-400 font-medium">Seu histórico de buscas está vazio.</p>
         <p className="text-sm text-gray-500 dark:text-gray-500">Suas buscas recentes aparecerão aqui.</p>
       </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Buscas Recentes</h3>
        <button 
          onClick={onClear} 
          className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
          aria-label="Limpar histórico de buscas"
        >
          <Trash2 size={14} />
          Limpar
        </button>
      </div>
      {history.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onItemClick(item.feeling)}
          className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
        >
          <p className="text-gray-700 dark:text-gray-200 truncate">{item.feeling}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
