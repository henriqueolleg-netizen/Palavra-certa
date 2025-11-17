import React from 'react';
import PlanSelector from '../components/PremiumBanner';
import { Sun, Moon, Laptop } from 'lucide-react';
import type { Plan, Theme } from '../types';

interface SettingsPageProps {
  plan: Plan;
  onPlanChange: (plan: Plan) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ plan, onPlanChange, theme, onThemeChange }) => {
  const themeOptions: { id: Theme; icon: React.ReactNode; label: string }[] = [
    { id: 'light', icon: <Sun />, label: 'Claro' },
    { id: 'dark', icon: <Moon />, label: 'Escuro' },
    { id: 'system', icon: <Laptop />, label: 'Sistema' },
  ];
  
  return (
    <div className="py-8">
       <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Ajustes</h1>
        <p className="text-gray-600 dark:text-gray-300">Gerencie suas preferências e seu plano.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Aparência</h2>
        <div className="flex justify-center gap-2 bg-gray-100 dark:bg-slate-700 p-2 rounded-xl">
          {themeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => onThemeChange(option.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors text-sm font-semibold ${
                theme === option.id
                  ? 'bg-white dark:bg-slate-900 shadow text-purple-600 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <PlanSelector currentPlan={plan} onSelectPlan={onPlanChange} />
    </div>
  );
};

export default SettingsPage;
