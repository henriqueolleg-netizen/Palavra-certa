import React from 'react';
import { Book, Sparkles, History, ArrowUpCircle } from 'lucide-react';
import type { Plan } from '../types';

interface SearchFormProps {
  feeling: string;
  setFeeling: (feeling: string) => void;
  handleSearch: () => void;
  toggleHistory: () => void;
  loading: boolean;
  plan: Plan;
  searchCount: number;
  searchLimit: number;
}

const SearchForm: React.FC<SearchFormProps> = ({ feeling, setFeeling, handleSearch, toggleHistory, loading, plan, searchCount, searchLimit }) => {
  const atLimit = plan === 'FREE' && searchCount >= searchLimit;

  const handleUpgradeClick = () => {
    // This is a simple way to navigate. In a more complex app, this could be a router or state change.
    alert("Por favor, navegue até a aba 'Ajustes' para ver os planos.");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-6">
      <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3 text-lg">
        Como você está se sentindo agora?
      </label>
      <textarea
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
        placeholder={atLimit ? "Você atingiu o seu limite de buscas diárias." : "Ex: Estou ansioso com uma entrevista amanhã..."}
        className="w-full p-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl focus:border-purple-400 focus:outline-none resize-none h-32 text-gray-700 dark:text-gray-200 transition-colors disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
          }
        }}
        disabled={atLimit}
      />
      
      {plan === 'FREE' && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right">
          {atLimit 
            ? <span className="text-red-500 font-semibold">Limite de buscas atingido.</span>
            : `Você tem ${searchLimit - searchCount} buscas restantes.`
          }
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={atLimit ? handleUpgradeClick : handleSearch}
          disabled={loading || (!atLimit && !feeling.trim())}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="animate-spin" size={20} />
              Buscando...
            </>
          ) : atLimit ? (
            <>
                <ArrowUpCircle size={20} />
                Ver Planos
            </>
          ) : (
            <>
              <Book size={20} />
              Buscar Versículo
            </>
          )}
        </button>
        <button
          onClick={toggleHistory}
          className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
          aria-label="Histórico de Buscas"
        >
          <History size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
