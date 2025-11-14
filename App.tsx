import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import VerseCard from './components/VerseCard';
import HistoryPanel from './components/HistoryPanel';
import SavedVersesPanel from './components/SavedVersesPanel';
import PlanSelector from './components/PremiumBanner';
import LoadingSkeleton from './components/LoadingSkeleton';
import Toast from './components/Toast';
import Footer from './components/Footer';
import PredictableResponses from './components/PredictableResponses';
import { getVerseForFeeling } from './services/geminiService';
import type { VerseResponse, SavedVerse, SearchHistoryItem, Plan } from './types';
import type { ToastType } from './components/Toast';

const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
};

const planLimits = {
  FREE: { search: 5, save: 5, history: 3 },
  BASIC: { search: Infinity, save: 50, history: 20 },
  PRO: { search: Infinity, save: Infinity, history: 50 },
};

const App: React.FC = () => {
  const [feeling, setFeeling] = useState<string>('');
  const [response, setResponse] = useState<VerseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [plan, setPlan] = usePersistentState<Plan>('palavraCerta_plan', 'FREE');
  const [savedVerses, setSavedVerses] = usePersistentState<SavedVerse[]>('palavraCerta_savedVerses', []);
  const [searchHistory, setSearchHistory] = usePersistentState<SearchHistoryItem[]>('palavraCerta_searchHistory', []);
  const [dailySearch, setDailySearch] = usePersistentState<{ count: number, date: string }>('palavraCerta_dailySearch', { count: 0, date: new Date().toISOString().split('T')[0] });

  const currentLimits = useMemo(() => planLimits[plan], [plan]);

  useEffect(() => {
      const today = new Date().toISOString().split('T')[0];
      if (dailySearch.date !== today) {
          setDailySearch({ count: 0, date: today });
      }
  }, [dailySearch.date, setDailySearch]);

  const searchCount = dailySearch.count;

  const showToast = (message: string, type: ToastType = 'info') => {
      setToast({ message, type });
  };

  const handleSearch = useCallback(async (feelingOverride?: string) => {
    const feelingToSearch = feelingOverride || feeling;
    if (!feelingToSearch.trim() || loading) return;

    if (plan === 'FREE' && searchCount >= currentLimits.search) {
      showToast(`Você atingiu seu limite de ${currentLimits.search} buscas diárias.`, 'error');
      document.getElementById('plan-selector')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    setResponse(null);
    setShowHistory(false);

    try {
      const verseResponse = await getVerseForFeeling(feelingToSearch, plan);
      setResponse(verseResponse);
      setSearchHistory(prev => [{ feeling: feelingToSearch, timestamp: new Date().toLocaleString('pt-BR') }, ...prev].slice(0, currentLimits.history));
      if (plan === 'FREE') {
        setDailySearch(prev => ({ ...prev, count: prev.count + 1 }));
      }
    } catch (error) {
      console.error("Failed to fetch verse:", error);
      showToast('Ocorreu um erro ao buscar o versículo. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  }, [feeling, loading, plan, searchCount, currentLimits, setDailySearch, setSearchHistory]);

  const saveVerse = useCallback(() => {
    if (!response) return;

    if (savedVerses.length >= currentLimits.save) {
      showToast(`Você atingiu seu limite de ${currentLimits.save} versículos salvos.`, 'error');
      document.getElementById('plan-selector')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!savedVerses.some(v => v.verse === response.verse)) {
      const newSavedVerse: SavedVerse = { ...response, savedAt: new Date().toLocaleString('pt-BR') };
      setSavedVerses(prev => [newSavedVerse, ...prev]);
      showToast('Versículo salvo com sucesso!', 'success');
    } else {
      showToast('Este versículo já foi salvo.', 'info');
    }
  }, [response, savedVerses, currentLimits.save, setSavedVerses]);
  
  const deleteVerse = useCallback((verseRef: string) => {
    setSavedVerses(prev => prev.filter(v => v.verse !== verseRef));
    showToast('Versículo excluído.', 'info');
  }, [setSavedVerses]);

  const shareVerse = useCallback(() => {
    if (response) {
      const textToShare = `${response.verse}\n\n"${response.text}"\n\nReflexão:\n${response.reflection}\n\nEnviado por Palavra Certa`;
      if (navigator.share) {
        navigator.share({
          title: `Palavra Certa: ${response.verse}`,
          text: textToShare,
        }).catch(error => console.log('Erro ao compartilhar', error));
      } else {
        navigator.clipboard.writeText(textToShare);
        showToast('Versículo copiado para a área de transferência!', 'success');
      }
    }
  }, [response]);

  const handleHistoryItemClick = (feeling: string) => {
    setFeeling(feeling);
    setShowHistory(false);
    // Optional: auto-trigger search by uncommenting the line below
    // handleSearch(feeling);
  };
  
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    showToast('Histórico de buscas limpo.', 'info');
  }, [setSearchHistory]);

  const handlePlanChange = (newPlan: Plan) => {
    const oldPlan = plan;
    setPlan(newPlan);
    if (oldPlan === 'FREE' && newPlan !== 'FREE') {
        setDailySearch(prev => ({...prev, count: 0}));
    }
    if (newPlan === 'FREE') {
        setDailySearch(prev => ({...prev, count: 0}));
    }
    setSavedVerses(prev => prev.slice(0, planLimits[newPlan].save));
    setSearchHistory(prev => prev.slice(0, planLimits[newPlan].history));
    showToast(`Plano alterado para ${newPlan}! Aproveite os novos benefícios.`, 'success');
  };
  
  const handlePredictableClick = (selectedFeeling: string) => {
    setFeeling(selectedFeeling);
    handleSearch(selectedFeeling);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 font-sans">
      <main className="max-w-2xl mx-auto">
        <Header plan={plan} />
        <SearchForm 
          feeling={feeling}
          setFeeling={setFeeling}
          handleSearch={() => handleSearch()}
          toggleHistory={() => setShowHistory(prev => !prev)}
          loading={loading}
          plan={plan}
          searchCount={searchCount}
          searchLimit={currentLimits.search}
        />
        
        {showHistory && (
          <HistoryPanel 
            history={searchHistory} 
            onItemClick={handleHistoryItemClick} 
            onClear={clearHistory}
          />
        )}
        
        {!loading && !response && !showHistory && (
          <PredictableResponses onFeelingSelect={handlePredictableClick} />
        )}
        
        {loading && <LoadingSkeleton />}

        {response && !loading && (
          <VerseCard 
            response={response}
            onSave={saveVerse}
            onShare={shareVerse}
          />
        )}
        
        <SavedVersesPanel savedVerses={savedVerses} onDelete={deleteVerse} />
        
        <PlanSelector currentPlan={plan} onSelectPlan={handlePlanChange} />
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Footer />
    </div>
  );
};

export default App;