
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DevotionalPage from './pages/DevotionalPage';
import MyVersesPage from './pages/MyVersesPage';
import SettingsPage from './pages/SettingsPage';

import type { VerseResponse, SavedVerse, SearchHistoryItem, Plan, Page, Theme } from './types';
import type { ToastType } from './components/Toast';

// FIX: Export usePersistentState hook to be used in other components.
export const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
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

export const planLimits = {
  FREE: { search: 5, save: 5, history: 3 },
  BASIC: { search: Infinity, save: 50, history: 20 },
  PRO: { search: Infinity, save: Infinity, history: 50 },
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [plan, setPlan] = usePersistentState<Plan>('palavraCerta_plan', 'FREE');
  const [savedVerses, setSavedVerses] = usePersistentState<SavedVerse[]>('palavraCerta_savedVerses', []);
  const [searchHistory, setSearchHistory] = usePersistentState<SearchHistoryItem[]>('palavraCerta_searchHistory', []);
  const [dailySearch, setDailySearch] = usePersistentState<{ count: number, date: string }>('palavraCerta_dailySearch', { count: 0, date: new Date().toISOString().split('T')[0] });
  const [theme, setTheme] = usePersistentState<Theme>('palavraCerta_theme', 'system');

  const currentLimits = useMemo(() => planLimits[plan], [plan]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
  }, [theme]);

  useEffect(() => {
      const today = new Date().toISOString().split('T')[0];
      if (dailySearch.date !== today) {
          setDailySearch({ count: 0, date: today });
      }
  }, [dailySearch.date, setDailySearch]);

  const showToast = (message: string, type: ToastType = 'info') => {
      setToast({ message, type });
  };
  
  const saveVerse = useCallback((verseToSave: VerseResponse) => {
    if (savedVerses.length >= currentLimits.save) {
      showToast(`Você atingiu seu limite de ${currentLimits.save} versículos salvos.`, 'error');
      setActivePage('settings');
      return;
    }

    if (!savedVerses.some(v => v.verse === verseToSave.verse)) {
      const newSavedVerse: SavedVerse = { ...verseToSave, savedAt: new Date().toLocaleString('pt-BR') };
      setSavedVerses(prev => [newSavedVerse, ...prev]);
      showToast('Versículo salvo com sucesso!', 'success');
    } else {
      showToast('Este versículo já foi salvo.', 'info');
    }
  }, [savedVerses, currentLimits.save, setSavedVerses]);
  
  const deleteVerse = useCallback((verseRef: string) => {
    setSavedVerses(prev => prev.filter(v => v.verse !== verseRef));
    showToast('Versículo excluído.', 'info');
  }, [setSavedVerses]);

  const handlePlanChange = (newPlan: Plan) => {
    const oldPlan = plan;
    setPlan(newPlan);
    if (oldPlan === 'FREE' && newPlan !== 'FREE') {
        setDailySearch(prev => ({...prev, count: 0}));
    }
    if (newPlan === 'FREE' && plan !== 'FREE') { // Reset count if downgrading to free
        setDailySearch({ count: 0, date: new Date().toISOString().split('T')[0] });
    }
    setSavedVerses(prev => prev.slice(0, planLimits[newPlan].save));
    setSearchHistory(prev => prev.slice(0, planLimits[newPlan].history));
    showToast(`Plano alterado para ${newPlan}! Aproveite os novos benefícios.`, 'success');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage 
          plan={plan}
          showToast={showToast}
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
          dailySearch={dailySearch}
          setDailySearch={setDailySearch}
          currentLimits={currentLimits}
          saveVerse={saveVerse}
        />;
      case 'devotional':
        return <DevotionalPage showToast={showToast} saveVerse={saveVerse} />;
      case 'saved':
        return <MyVersesPage savedVerses={savedVerses} onDelete={deleteVerse} />;
      case 'settings':
        return <SettingsPage 
          plan={plan}
          theme={theme}
          onPlanChange={handlePlanChange}
          onThemeChange={setTheme}
        />;
      default:
        return <HomePage 
          plan={plan}
          showToast={showToast}
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
          dailySearch={dailySearch}
          setDailySearch={setDailySearch}
          currentLimits={currentLimits}
          saveVerse={saveVerse}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 p-4 font-sans selection:bg-purple-200 dark:selection:bg-purple-700">
      <main className="max-w-2xl mx-auto pb-24">
        {renderPage()}
      </main>
      
      <Footer />
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
