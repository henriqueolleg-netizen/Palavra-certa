import React from 'react';
import type { SavedVerse } from '../types';
import { BookmarkPlus, Trash2 } from 'lucide-react';

interface SavedVersesPanelProps {
  savedVerses: SavedVerse[];
  onDelete: (verseRef: string) => void;
}

const SavedVersesPanel: React.FC<SavedVersesPanelProps> = ({ savedVerses, onDelete }) => {
  if (savedVerses.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn mt-6">
      <div className="flex items-center gap-3 mb-4">
        <BookmarkPlus className="text-purple-600"/>
        <h3 className="font-semibold text-gray-800 text-xl">Versículos Salvos ({savedVerses.length})</h3>
      </div>
      {savedVerses.map((item, idx) => (
        <div key={idx} className="p-4 bg-purple-50 rounded-lg mb-3 group relative">
          <p className="font-semibold text-purple-700">{item.verse}</p>
          
          <button 
            onClick={() => onDelete(item.verse)}
            className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-opacity"
            aria-label={`Excluir versículo ${item.verse}`}
          >
            <Trash2 size={16} />
          </button>

          <p className="text-sm text-gray-600 mt-1 italic">"{item.text.substring(0, 100)}..."</p>
          <p className="text-xs text-gray-500 mt-2">Salvo em: {item.savedAt}</p>
        </div>
      ))}
    </div>
  );
};

export default SavedVersesPanel;
