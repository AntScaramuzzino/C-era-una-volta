import { GoogleGenAI, Type } from "@google/genai";
import { CardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateStory = async (prompt: string, sysPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: sysPrompt,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};

export const generateThematicDeck = async (topic: string, count: number): Promise<CardData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crea un set di ${count} carte sul tema del cyberbullismo, focalizzato su: "${topic}". Ogni carta deve avere un TITOLO CREATIVO e SPECIFICO e una breve descrizione.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  desc: { type: Type.STRING },
                  cat: { type: Type.STRING, description: "Deve essere uno tra: PERSONAGGIO, SITUAZIONE, AZIONE, EMOZIONE, AIUTO, FINALE" }
                },
                required: ["title", "desc", "cat"]
              }
            }
          },
          required: ["cards"]
        }
      }
    });
    
    if (!response.text) return [];
    const data = JSON.parse(response.text);
    return data.cards;
  } catch (e) {
    console.error("Failed to parse JSON or generate deck:", e);
    return [];
  }
};

export const generateCardImage = async (card: CardData, stylePrompt: string) => {
  const prompt = `Vertical portrait card illustration for an educational game. Topic: ${card.title}. Description: ${card.desc}. Style: ${stylePrompt}. Cinematic high quality art. No text.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};
