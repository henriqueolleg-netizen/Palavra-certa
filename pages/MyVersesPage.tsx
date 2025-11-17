import React from 'react';
import SavedVersesPanel from '../components/SavedVersesPanel';
import { BookmarkX } from 'lucide-react';
import type { SavedVerse } from '../types';

interface MyVersesPageProps {
  savedVerses: SavedVerse[];
  onDelete: (verseRef: string) => void;
}

const MyVersesPage: React.FC<MyVersesPageProps> = ({ savedVerses, onDelete }) => {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Meus Versículos Salvos</h1>
        <p className="text-gray-600 dark:text-gray-300">Sua coleção pessoal de palavras de conforto e força.</p>
      </div>

      {savedVerses.length > 0 ? (
        <SavedVersesPanel savedVerses={savedVerses} onDelete={onDelete} />
      ) : (
        <div className="mt-12 text-center animate-fadeIn">
          <BookmarkX size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Nenhum versículo salvo</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Clique no ícone de salvar em um versículo para adicioná-lo aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyVersesPage;
