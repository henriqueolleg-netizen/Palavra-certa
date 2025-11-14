
import React from 'react';
import { CheckCircle, Sparkles, Award } from 'lucide-react';
import type { Plan } from '../types';

interface PlanSelectorProps {
  currentPlan: Plan;
  onSelectPlan: (plan: Plan) => void;
}

const plans = {
  FREE: {
    name: 'Grátis',
    price: 'R$0',
    icon: <Sparkles className="w-8 h-8 mx-auto mb-4 text-gray-500" />,
    features: [
      '5 buscas por dia',
      'Salvar até 5 versículos',
      'Histórico das últimas 3 buscas',
    ],
    cta: 'Seu Plano Atual',
    style: {
      card: 'border-gray-300',
      button: 'bg-gray-200 text-gray-600 cursor-default',
    },
  },
  BASIC: {
    name: 'Básico',
    price: 'R$9,90/mês',
    icon: <CheckCircle className="w-8 h-8 mx-auto mb-4 text-cyan-500" />,
    features: [
      'Buscas ilimitadas',
      'Salvar até 50 versículos',
      'Histórico de 20 buscas',
      'Suporte prioritário',
    ],
    cta: 'Fazer Upgrade',
    style: {
      card: 'border-cyan-500',
      button: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600',
    },
  },
  PRO: {
    name: 'Profissional',
    price: 'R$19,90/mês',
    icon: <Award className="w-8 h-8 mx-auto mb-4 text-amber-500" />,
    features: [
      'Tudo do plano Básico',
      'Reflexões mais profundas (IA Pro)',
      'Devocionais personalizados (Em breve)',
      'Salvar versículos ilimitados',
    ],
    cta: 'Fazer Upgrade',
    style: {
      card: 'border-amber-500',
      button: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white hover:from-amber-500 hover:to-yellow-600',
    },
  },
};

const PlanSelector: React.FC<PlanSelectorProps> = ({ currentPlan, onSelectPlan }) => {
  return (
    <div id="plan-selector" className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nossos Planos</h2>
        <p className="text-gray-600 mb-8">Escolha o plano que mais se encaixa com você.</p>
        <div className="grid md:grid-cols-3 gap-6">
            {(Object.keys(plans) as Plan[]).map(planKey => {
                const plan = plans[planKey];
                const isCurrent = currentPlan === planKey;
                
                return (
                    <div key={planKey} className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${isCurrent ? plan.style.card : 'border-transparent'} transition-all transform hover:scale-105`}>
                        {plan.icon}
                        <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                        <p className="font-semibold text-gray-600 my-3 text-lg">{plan.price}</p>
                        <ul className="text-left space-y-2 text-gray-600 mb-8">
                            {plan.features.map(feat => (
                                <li key={feat} className="flex items-start">
                                    <CheckCircle size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => !isCurrent && onSelectPlan(planKey)}
                            disabled={isCurrent}
                            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${isCurrent ? plan.style.button : plan.style.button + ' opacity-90 hover:opacity-100'}`}
                        >
                            {isCurrent ? 'Seu Plano Atual' : plan.cta}
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default PlanSelector;
