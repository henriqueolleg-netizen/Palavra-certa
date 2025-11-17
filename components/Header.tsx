import React from 'react';
import { Heart, Star, Award } from 'lucide-react';
import type { Plan } from '../types';

interface HeaderProps {
  plan: Plan;
}

const PlanBadge: React.FC<{ plan: Plan }> = ({ plan }) => {
  if (plan === 'FREE') return null;

  const planDetails = {
    BASIC: {
      label: 'BÁSICO',
      icon: <Star size={14} className="fill-white"/>,
      className: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    },
    PRO: {
      label: 'PRO',
      icon: <Award size={14} className="fill-white"/>,
      className: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    }
  };
  
  const details = planDetails[plan];

  return (
    <div className={`${details.className} text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1`}>
      {details.icon}
      <span>{details.label}</span>
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ plan }) => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center items-center gap-3 mb-3">
        <Heart className="text-purple-600 dark:text-purple-400 w-10 h-10" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Palavra Certa</h1>
        <PlanBadge plan={plan} />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg">O versículo que seu coração precisa ouvir hoje</p>
    </div>
  );
};

export default Header;
