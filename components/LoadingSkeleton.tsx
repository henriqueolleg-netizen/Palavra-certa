import React from 'react';
import { Book } from 'lucide-react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Book size={24} className="text-gray-300 dark:text-slate-600" />
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-slate-700 p-6 rounded-xl mb-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4"></div>
      </div>
      
      <div className="border-l-4 border-gray-200 dark:border-slate-700 pl-4 py-2">
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
