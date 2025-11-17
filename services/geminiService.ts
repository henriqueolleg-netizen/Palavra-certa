
import { GoogleGenAI, Type, Modality } from "@google/genai";
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

    if (verseData && typeof verseData.verse === 'string' && typeof verseData.text === 'string' && typeof verseData.reflection === 'string') {
      return verseData as VerseResponse;
    } else {
      throw new Error("Resposta da IA em formato inválido.");
    }

  } catch (error) {
    console.error("Erro ao buscar versículo da IA:", error);
    return {
      verse: "Salmos 46:1",
      text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
      reflection: "Houve um problema ao buscar uma palavra específica para você, mas lembre-se sempre disto: independente do que você esteja passando, Deus é seu refúgio seguro. Ele está presente e pronto para te ajudar."
    };
  }
};

export const generatePrayer = async (feeling: string, verse: VerseResponse): Promise<string> => {
    try {
        const prompt = `Baseado no sentimento de "${feeling}" e no versículo bíblico "${verse.verse}: ${verse.text}", escreva uma oração curta, pessoal e encorajadora de 2-3 frases. A oração deve refletir o conforto e a esperança encontrados no versículo.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Erro ao gerar oração:", error);
        return "Senhor, mesmo em meio à incerteza, eu me apego à Tua promessa. Dá-me força e paz. Amém.";
    }
};

export const getSpeechAudio = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Leia de forma calma e reconfortante: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' }, // A gentle voice
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio ?? null;

    // FIX: Corrected the malformed catch block syntax.
    } catch (error) {
        console.error("Erro ao gerar áudio:", error);
        return null;
    }
};

export const getDailyDevotional = async (): Promise<VerseResponse> => {
  try {
    const prompt = `Gere um versículo bíblico inspirador e universalmente reconfortante com uma breve reflexão de um parágrafo. Este será o "versículo do dia". A reflexão deve ser calorosa e aplicável a qualquer pessoa.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: verseSchema,
        temperature: 0.6,
      },
    });

    const jsonText = response.text.trim();
    const verseData = JSON.parse(jsonText);

    if (verseData && typeof verseData.verse === 'string' && typeof verseData.text === 'string' && typeof verseData.reflection === 'string') {
      return verseData as VerseResponse;
    } else {
      throw new Error("Resposta da IA em formato inválido para devocional.");
    }

  } catch (error) {
    console.error("Erro ao buscar devocional diário:", error);
    return {
      verse: "Filipenses 4:13",
      text: "Tudo posso naquele que me fortalece.",
      reflection: "Lembre-se hoje que sua força não vem de si mesmo, mas de uma fonte divina e inesgotável. Quaisquer que sejam os desafios que você enfrente, você tem o poder de perseverar e superar. Confie nessa força."
    };
  }
};
