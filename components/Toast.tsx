import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed bottom-24 sm:bottom-5 right-5 bg-white dark:bg-slate-700 rounded-xl shadow-2xl p-4 flex items-center gap-4 max-w-sm animate-fadeIn z-50">
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-gray-700 dark:text-gray-100 flex-grow">{message}</p>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 flex-shrink-0" aria-label="Fechar notificação">
        <X size={18} className="text-gray-500 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default Toast;
