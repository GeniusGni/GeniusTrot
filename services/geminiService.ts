import { GoogleGenAI } from "@google/genai";
import { DrawnCard } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Helper to get AI instance
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTarotReading = async (
  question: string,
  cards: DrawnCard[]
): Promise<ReadableStream<string>> => {
  const ai = getAI();

  // Format cards for the prompt
  const cardsDescription = cards.map((card, index) => {
    const orientation = card.isReversed ? "逆位 (Reversed)" : "正位 (Upright)";
    return `${index + 1}. ${card.positionName}: ${card.name} - ${orientation}`;
  }).join("\n");

  const prompt = `
    User Question: "${question}"
    
    The Drawn Cards:
    ${cardsDescription}
    
    Please provide a complete Tarot reading following the defined system instructions and output format.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1, 
      }
    });

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(text);
          }
        }
        controller.close();
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};