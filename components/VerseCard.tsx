import React, { useState, useRef, useEffect } from 'react';
import { Book, BookmarkPlus, Share2, Volume2, MessageSquareQuote, PauseCircle, LoaderCircle, VolumeX } from 'lucide-react';
import type { VerseResponse } from '../types';
import { getSpeechAudio, generatePrayer } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';
import PrayerModal from './PrayerModal';

// Audio context should be created once
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioContext: AudioContext;

interface VerseCardProps {
  response: VerseResponse;
  onSave: () => void;
  onShare: () => void;
  feelingForPrayer: string;
}

const VerseCard: React.FC<VerseCardProps> = ({ response, onSave, onShare, feelingForPrayer }) => {
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [prayer, setPrayer] = useState<{ text: string | null; loading: boolean }>({ text: null, loading: false });
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  
  const initAudioContext = () => {
    if (!audioContext) {
      audioContext = new AudioContext({ sampleRate: 24000 });
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
  };

  useEffect(() => {
    // Reset audio state when the verse changes
    setAudioState('idle');
    return () => {
        if (audioSource.current) {
            audioSource.current.stop();
        }
    };
  }, [response]);

  const handlePlayAudio = async () => {
    initAudioContext();
    if (audioState === 'playing' && audioSource.current) {
        audioSource.current.stop();
        setAudioState('idle');
        return;
    }
    
    if (audioState === 'error') {
        setAudioState('idle'); // Allow retry after error
    }

    setAudioState('loading');
    const textToSpeak = `${response.verse}. ${response.text}. Reflexão: ${response.reflection}`;
    const base64Audio = await getSpeechAudio(textToSpeak);

    if (base64Audio && audioContext) {
      try {
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => setAudioState('idle');
        audioSource.current = source;
        setAudioState('playing');
      } catch (e) {
        console.error("Error playing audio", e);
        setAudioState('error');
      }
    } else {
      setAudioState('error');
    }
  };

  const handlePrayerRequest = async () => {
    setIsPrayerModalOpen(true);
    setPrayer({ text: null, loading: true });
    const prayerText = await generatePrayer(feelingForPrayer, response);
    setPrayer({ text: prayerText, loading: false });
  };
  
  const getAudioIcon = () => {
    switch (audioState) {
        case 'loading': return <LoaderCircle size={20} className="text-purple-600 dark:text-purple-400 animate-spin" />;
        case 'playing': return <PauseCircle size={20} className="text-purple-600 dark:text-purple-400" />;
        case 'error': return <VolumeX size={20} className="text-red-500 dark:text-red-400" />;
        default: return <Volume2 size={20} className="text-purple-600 dark:text-purple-400" />;
    }
  };

  const getAudioButtonClasses = () => {
    let base = 'p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400';
    switch (audioState) {
        case 'playing':
        case 'loading':
            return `${base} bg-purple-100 dark:bg-slate-700`;
        case 'error':
            return `${base} bg-red-100 dark:bg-red-900/50`;
        default: // idle
            return `${base} hover:bg-purple-100 dark:hover:bg-slate-700`;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Book size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{response.verse}</h2>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={handlePlayAudio}
              className={getAudioButtonClasses()}
              aria-label={audioState === 'playing' ? "Pausar áudio" : "Ouvir versículo e reflexão"}
            >
              {getAudioIcon()}
            </button>
             <button
              onClick={handlePrayerRequest}
              className="p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Pedir uma oração"
            >
              <MessageSquareQuote size={20} className="text-purple-600 dark:text-purple-400" />
            </button>
            <button
              onClick={onSave}
              className="p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Salvar Versículo"
            >
              <BookmarkPlus size={20} className="text-purple-600 dark:text-purple-400" />
            </button>
            <button
              onClick={onShare}
              className="p-2 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Compartilhar"
            >
              <Share2 size={20} className="text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl mb-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed italic">
            "{response.text}"
          </p>
        </div>
        
        <div className="border-l-4 border-purple-400 dark:border-purple-500 pl-4 py-2">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {response.reflection}
          </p>
        </div>
      </div>
      {isPrayerModalOpen && (
          <PrayerModal 
            prayer={prayer.text}
            loading={prayer.loading}
            onClose={() => setIsPrayerModalOpen(false)}
          />
      )}
    </>
  );
};

export default VerseCard;
