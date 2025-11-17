import React from 'react';
import { X, LoaderCircle } from 'lucide-react';

interface PrayerModalProps {
  prayer: string | null;
  loading: boolean;
  onClose: () => void;
}

const PrayerModal: React.FC<PrayerModalProps> = ({ prayer, loading, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
          aria-label="Fechar"
        >
          <X className="text-gray-600 dark:text-gray-300" />
        </button>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Uma Oração Para Você</h3>

        {loading && (
          <div className="flex items-center justify-center h-24">
            <LoaderCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
          </div>
        )}

        {prayer && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
            {prayer}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrayerModal;
