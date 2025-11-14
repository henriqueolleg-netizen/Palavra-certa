
import { GoogleGenAI, Type } from "@google/genai";
import type { VerseResponse, Plan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const verseSchema = {
  type: Type.OBJECT,
  properties: {
    verse: {
      type: Type.STRING,
      description: "A referência do versículo bíblico (ex: João 3:16)."
    },
    text: {
      type: Type.STRING,
      description: "O texto completo do versículo bíblico."
    },
    reflection: {
      type: Type.STRING,
      description: "Uma reflexão curta, calorosa e encorajadora baseada no sentimento do usuário e no versículo. Para planos PRO, a reflexão deve ser mais profunda e detalhada."
    }
  },
  required: ["verse", "text", "reflection"]
};

export const getVerseForFeeling = async (feeling: string, plan: Plan): Promise<VerseResponse> => {
  try {
    const isPro = plan === 'PRO';
    const model = isPro ? "gemini-2.5-pro" : "gemini-2.5-flash";
    const prompt = isPro 
      ? `Aja como um teólogo experiente e conselheiro espiritual profundo. Baseado no sentimento do usuário, forneça um versículo bíblico relevante, o texto completo do versículo e uma reflexão teologicamente rica, profunda, encorajadora e pessoal. A reflexão deve ter pelo menos 2 parágrafos. Seja sensível e reconfortante. O sentimento do usuário é: "${feeling}"`
      : `Aja como um conselheiro espiritual e teólogo. Baseado no sentimento do usuário, forneça um versículo bíblico relevante, o texto completo do versículo e uma breve reflexão encorajadora e pessoal. Seja sensível e reconfortante. O sentimento do usuário é: "${feeling}"`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: verseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const verseData = JSON.parse(jsonText);

    // Basic validation to ensure the response shape is correct
    if (verseData && typeof verseData.verse === 'string' && typeof verseData.text === 'string' && typeof verseData.reflection === 'string') {
      return verseData as VerseResponse;
    } else {
      throw new Error("Resposta da IA em formato inválido.");
    }

  } catch (error) {
    console.error("Erro ao buscar versículo da IA:", error);
    // Fallback response in case of API error
    return {
      verse: "Salmos 46:1",
      text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
      reflection: "Houve um problema ao buscar uma palavra específica para você, mas lembre-se sempre disto: independente do que você esteja passando, Deus é seu refúgio seguro. Ele está presente e pronto para te ajudar."
    };
  }
};
