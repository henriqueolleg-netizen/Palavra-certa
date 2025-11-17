import React from 'react';
import { Compass } from 'lucide-react';

interface PredictableResponsesProps {
  onFeelingSelect: (feeling: string) => void;
}

const feelings = [
  "Estou me sentindo ansioso(a).",
  "Estou triste e sem esperança.",
  "Sinto-me sozinho(a).",
  "Estou com medo do futuro.",
  "Preciso de força para continuar.",
  "Estou de luto pela perda de alguém.",
  "Sinto-me culpado(a) por algo que fiz.",
  "Estou com raiva e frustrado(a).",
  "Preciso de paciência.",
  "Sinto inveja de outras pessoas.",
  "Estou grato(a) por minhas bênçãos.",
  "Sinto-me fraco(a) na minha fé.",
  "Estou enfrentando uma grande tentação.",
  "Preciso de sabedoria para uma decisão.",
  "Sinto-me sobrecarregado(a) com o trabalho.",
  "Estou preocupado(a) com minha família.",
  "Preciso de cura física.",
  "Estou lutando contra um vício.",
  "Sinto-me perdido(a) e sem direção.",
  "Preciso perdoar alguém que me magoou.",
  "Quero ser uma pessoa melhor.",
  "Estou feliz e quero celebrar.",
  "Sinto-me desvalorizado(a).",
  "Estou enfrentando problemas financeiros.",
  "Tenho uma entrevista de emprego importante.",
  "Vou passar por uma cirurgia.",
  "Meu casamento está em crise.",
  "Sinto-me exausto(a) mentalmente.",
  "Estou com o coração partido.",
  "Preciso de motivação.",
  "Sinto-me inseguro(a).",
  "Estou decepcionado(a) comigo mesmo(a).",
  "Estou lutando contra pensamentos negativos.",
  "Sinto falta de um ente querido.",
  "Quero ter mais fé.",
  "Estou com dificuldades para dormir.",
  "Sinto-me confuso(a) sobre a vida.",
  "Preciso de paz interior.",
  "Estou começando um novo capítulo na vida.",
  "Sinto-me sem amigos.",
  "Estou preocupado(a) com a saúde de alguém.",
  "Preciso de coragem para enfrentar um desafio.",
  "Sinto-me sem propósito.",
  "Estou com ciúmes.",
  "Preciso de ajuda para controlar meu temperamento.",
  "Sinto-me oprimido(a) pela injustiça.",
  "Estou esperando um resultado importante.",
  "Quero aprender a confiar mais em Deus.",
  "Sinto-me espiritualmente seco(a).",
  "Estou em busca de conforto."
];

const PredictableResponses: React.FC<PredictableResponsesProps> = ({ onFeelingSelect }) => {
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 animate-fadeIn">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-lg flex items-center gap-2">
        <Compass size={20} className="text-purple-600 dark:text-purple-400" />
        Bem-vindo(a)! Compartilhe um sentimento ou tente uma sugestão:
      </h3>
      <div className="flex flex-wrap gap-2">
        {feelings.slice(0, 15).map((feeling, index) => (
          <button
            key={index}
            onClick={() => onFeelingSelect(feeling)}
            className="px-3 py-1.5 bg-purple-100 text-purple-800 dark:bg-slate-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-slate-600 hover:text-purple-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {feeling}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredictableResponses;
