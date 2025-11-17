import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import VerseCard from '../components/VerseCard';
import HistoryPanel from '../components/HistoryPanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PredictableResponses from '../components/PredictableResponses';
import { getVerseForFeeling } from '../services/geminiService';
import type { VerseResponse, SearchHistoryItem, Plan } from '../types';
import type { ToastType } from '../components/Toast';

interface HomePageProps {
    plan: Plan;
    showToast: (message: string, type?: ToastType) => void;
    searchHistory: SearchHistoryItem[];
    setSearchHistory: React.Dispatch<React.SetStateAction<SearchHistoryItem[]>>;
    dailySearch: { count: number; date: string };
    setDailySearch: React.Dispatch<React.SetStateAction<{ count: number; date: string }>>;
    currentLimits: { search: number; save: number; history: number };
    saveVerse: (verse: VerseResponse) => void;
}

const HomePage: React.FC<HomePageProps> = ({ plan, showToast, searchHistory, setSearchHistory, dailySearch, setDailySearch, currentLimits, saveVerse }) => {
  const [feeling, setFeeling] = useState<string>('');
  const [lastFeeling, setLastFeeling] = useState<string>('');
  const [response, setResponse] = useState<VerseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  const handleSearch = useCallback(async (feelingOverride?: string) => {
    const feelingToSearch = feelingOverride || feeling;
    if (!feelingToSearch.trim() || loading) return;

    if (plan === 'FREE' && dailySearch.count >= currentLimits.search) {
      showToast(`Você atingiu seu limite de ${currentLimits.search} buscas diárias.`, 'error');
      // In a real app, you might navigate to the plans page. Here we just show a toast.
      return;
    }
    
    setLoading(true);
    setResponse(null);
    setShowHistory(false);
    setLastFeeling(feelingToSearch);

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
  }, [feeling, loading, plan, dailySearch.count, currentLimits, setDailySearch, setSearchHistory, showToast]);

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
  }, [response, showToast]);

  const handleHistoryItemClick = (feeling: string) => {
    setFeeling(feeling);
    setShowHistory(false);
    handleSearch(feeling);
  };
  
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    showToast('Histórico de buscas limpo.', 'info');
  }, [setSearchHistory, showToast]);
  
  const handlePredictableClick = (selectedFeeling: string) => {
    setFeeling(selectedFeeling);
    handleSearch(selectedFeeling);
  };

  return (
    <>
        <Header plan={plan} />
        <SearchForm 
          feeling={feeling}
          setFeeling={setFeeling}
          handleSearch={() => handleSearch()}
          toggleHistory={() => setShowHistory(prev => !prev)}
          loading={loading}
          plan={plan}
          searchCount={dailySearch.count}
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
            onSave={() => saveVerse(response)}
            onShare={shareVerse}
            feelingForPrayer={lastFeeling}
          />
        )}
    </>
  );
};

export default HomePage;
