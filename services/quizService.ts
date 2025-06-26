
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from '../constants';

const getAiClient = () => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
};

// Helper function for parsing JSON responses
const parseJsonResponse = (responseText: string): any => {
  try {
    const cleanText = responseText.trim().replace(/```json\s*|\s*```/g, '');
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return null;
  }
};

const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_NONE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_NONE',
  },
];

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const generateQuiz = async (topic: string, content: string): Promise<QuizQuestion | null> => {
  console.log(`🧠 Generating quiz for topic: "${topic}" with content length: ${content.length} characters`);

  const genAI = getAiClient();
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    safetySettings 
  });

  const prompt = `Create a comprehensive multiple-choice quiz question about "${topic}" based on this lesson content:

"${content.substring(0, 2000)}..."

The question should test understanding of a key concept covered in the lesson narration. Make it challenging but fair.

Return ONLY valid JSON:
{
  "question": "Clear, specific question that tests comprehension",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief explanation of why the correct answer is right and what concept it tests"
}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const quizData = parseJsonResponse(result.response.text());

    if (!quizData || !quizData.question || !quizData.options || !Array.isArray(quizData.options)) {
      throw new Error('Invalid quiz structure received');
    }

    console.log(`✅ Generated quiz question successfully`);
    return quizData;

  } catch (error) {
    console.error('Quiz generation error:', error);
    return null;
  }
};
