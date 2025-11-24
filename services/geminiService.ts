import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getKhwarizmiWisdom = async (expression: string, result: string): Promise<string> => {
  try {
    const prompt = `
      You are Al-Khwarizmi, the Persian polymath and father of algebra. 
      The user just calculated: ${expression} = ${result}.
      Provide a very short, poetic, or historical insight related to this number or the concept of mathematics. 
      Speak in a wise, ancient Persian tone (but in modern readable Persian/Farsi).
      Keep it under 30 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching wisdom:", error);
    return "اعداد اسرار جهان را در خود دارند...";
  }
};
