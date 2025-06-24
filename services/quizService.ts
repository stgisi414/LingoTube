
import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL_NAME } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY! });

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const generateQuiz = async (topic: string, content: string): Promise<QuizQuestion | null> => {
  const prompt = `Create a multiple-choice quiz question about "${topic}" based on this content: "${content.substring(0, 500)}..."

The question should test understanding of a key concept. Return ONLY valid JSON:
{
  "question": "Clear, specific question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief explanation of why the answer is correct"
}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const text = response.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return null;
  }
};
