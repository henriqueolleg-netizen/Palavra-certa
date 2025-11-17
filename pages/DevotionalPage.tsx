import React, { useState, useEffect, useCallback } from 'react';
import VerseCard from '../components/VerseCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getDailyDevotional } from '../services/geminiService';
import { usePersistentState } from '../App';
import type { VerseResponse } from '../types';
import type { ToastType } from '../components/Toast';
import { Sparkles, Share2 } from 'lucide-react';

interface DevotionalPageProps {
  showToast: (message: string, type?: ToastType) => void;
  saveVerse: (verse: VerseResponse) => void;
}

const DevotionalPage: React.FC<DevotionalPageProps> = ({ showToast, saveVerse }) => {
  const [devotional, setDevotional] = usePersistentState<{ verse: VerseResponse | null, date: string }>('palavraCerta_devotional', { verse: null, date: '' });
  const [loading, setLoading] = useState(false);

  const fetchDevotional = useCallback(async () => {
    setLoading(true);
    const verseResponse = await getDailyDevotional();
    setDevotional({ verse: verseResponse, date: new Date().toISOString().split('T')[0] });
    setLoading(false);
  }, [setDevotional]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (devotional.date !== today) {
      fetchDevotional();
    }
  }, [devotional.date, fetchDevotional]);

  const shareDevotional = useCallback(() => {
    if (devotional.verse) {
      const textToShare = `Devocional do Dia ✨\n\n${devotional.verse.verse}\n\n"${devotional.verse.text}"\n\nReflexão:\n${devotional.verse.reflection}\n\nEnviado por Palavra Certa`;
      if (navigator.share) {
        navigator.share({
          title: `Palavra Certa: Devocional do Dia`,
          text: textToShare,
        }).catch(error => console.log('Erro ao compartilhar', error));
      } else {
        navigator.clipboard.writeText(textToShare);
        showToast('Devocional copiado para a área de transferência!', 'success');
      }
    }
  }, [devotional.verse, showToast]);

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 mx-auto text-amber-500 mb-2" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Sua Palavra Diária</h1>
        <p className="text-gray-600 dark:text-gray-300">Uma mensagem de esperança para o seu dia.</p>
      </div>

      {loading && <LoadingSkeleton />}
      {!loading && devotional.verse && (
         <VerseCard 
            response={devotional.verse}
            onSave={() => saveVerse(devotional.verse!)}
            onShare={shareDevotional}
            feelingForPrayer="um coração grato"
          />
      )}
    </div>
  );
};

export default DevotionalPage;
