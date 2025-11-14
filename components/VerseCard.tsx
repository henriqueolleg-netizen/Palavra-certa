import React from 'react';
import { Book, BookmarkPlus, Share2 } from 'lucide-react';
import type { VerseResponse } from '../types';

interface VerseCardProps {
  response: VerseResponse;
  onSave: () => void;
  onShare: () => void;
}

const VerseCard: React.FC<VerseCardProps> = ({ response, onSave, onShare }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-purple-600">
          <Book size={24} />
          <h2 className="text-2xl font-bold">{response.verse}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="p-2 hover:bg-purple-50 rounded-full transition-all"
            aria-label="Salvar Versículo"
          >
            <BookmarkPlus size={20} className="text-purple-600" />
          </button>
          <button
            onClick={onShare}
            className="p-2 hover:bg-purple-50 rounded-full transition-all"
            aria-label="Compartilhar"
          >
            <Share2 size={20} className="text-purple-600" />
          </button>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-4">
        <p className="text-gray-800 text-lg leading-relaxed italic">
          "{response.text}"
        </p>
      </div>
      
      <div className="border-l-4 border-purple-400 pl-4 py-2">
        <p className="text-gray-700 leading-relaxed">
          {response.reflection}
        </p>
      </div>
    </div>
  );
};

export default VerseCard;
