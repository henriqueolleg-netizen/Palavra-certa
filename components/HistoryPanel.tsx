import React from 'react';
import type { SearchHistoryItem } from '../types';
import { Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  history: SearchHistoryItem[];
  onItemClick: (feeling: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onItemClick, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Buscas Recentes</h3>
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
          className="p-3 bg-gray-50 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-all"
        >
          <p className="text-gray-700 truncate">{item.feeling}</p>
          <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
