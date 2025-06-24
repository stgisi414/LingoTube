import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from '../constants';
import { LessonPlan, SegmentType, VideoTimeSegment } from '../types';

// Initialize Gemini AI client
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

/**
 * Generate a complete lesson plan with multilingual narration tags
 */
export const generateLessonPlan = async (topic: string): Promise<LessonPlan> => {
  console.log(`🎓 Generating lesson plan for topic: "${topic}"`);

  const genAI = getAiClient();
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    safetySettings 
  });

  const prompt = `Create a detailed lesson plan for: "${topic}"

IMPORTANT: For all narration text, include language code tags using this format:
- English text: regular text
- Spanish text: <lang:es>hola mundo</lang:es>
- French text: <lang:fr>bonjour le monde</lang:fr>
- German text: <lang:de>hallo welt</lang:de>
- Italian text: <lang:it>ciao mondo</lang:it>
- Chinese text: <lang:zh>你好世界</lang:zh>
- Japanese text: <lang:ja>こんにちは世界</lang:ja>
- Korean text: <lang:ko>안녕하세요 세계</lang:ko>

Use foreign language terms naturally when explaining concepts. For example:
"Welcome to our lesson on French cuisine. We'll learn about <lang:fr>croissants</lang:fr>, <lang:fr>baguettes</lang:fr>, and <lang:fr>coq au vin</lang:fr>."

Exclude any text in parentheses from narration as it's for internal notes only.

Return ONLY a valid JSON object:
{
  "topic": "lesson topic",
  "introNarration": "Introduction with language tags...",
  "segments": [
    {
      "type": "narration",
      "id": "unique-id",
      "text": "Narration with language tags..."
    },
    {
      "type": "video", 
      "id": "unique-id",
      "title": "Video section title",
      "youtubeSearchQuery": "search query for YouTube",
      "segmentDescription": "What this video will demonstrate"
    }
  ],
  "outroNarration": "Conclusion with language tags..."
}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const lessonData = parseJsonResponse(result.response.text());

    if (!lessonData || !lessonData.topic) {
      throw new Error('Invalid lesson plan structure received');
    }

    console.log(`✅ Generated lesson plan with ${lessonData.segments?.length || 0} segments`);
    return lessonData;

  } catch (error) {
    console.error('Failed to generate lesson plan:', error);
    throw new Error('Failed to generate lesson plan. Please try again.');
  }
};

/**
 * Generate search queries for video content
 */
export const generateSearchQueries = async (learningPoint: string, mainTopic: string): Promise<string[]> => {
  const baseQueries = [
    `${learningPoint}`,
    `${mainTopic} ${learningPoint}`,
    `${learningPoint} tutorial`,
    `${learningPoint} explained`
  ];

  return [...new Set(baseQueries)];
};

/**
 * Check video relevance using AI
 */
export const checkVideoRelevance = async (
  videoTitle: string, 
  learningPoint: string, 
  mainTopic: string, 
  transcript: string | null
): Promise<{ relevant: boolean; reason: string; confidence: number }> => {
  const genAI = getAiClient();
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    safetySettings 
  });

  const prompt = `Analyze if this YouTube video is relevant for education:

Main Topic: "${mainTopic}"
Learning Point: "${learningPoint}"
Video Title: "${videoTitle}"
${transcript ? `Transcript: "${transcript.substring(0, 1000)}..."` : ''}

Return ONLY valid JSON:
{ "relevant": boolean, "reason": "brief explanation", "confidence": number }`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const relevanceResult = parseJsonResponse(result.response.text());

    if (relevanceResult && typeof relevanceResult.relevant === 'boolean') {
      return relevanceResult;
    }

    return { relevant: false, reason: "Invalid AI response", confidence: 0 };
  } catch (error) {
    console.error('Video relevance check failed:', error);
    return { relevant: false, reason: "Analysis failed", confidence: 0 };
  }
};

/**
 * Find time segments in video transcript
 */
export const findVideoSegments = async (
  videoTitle: string, 
  learningPoint: string, 
  transcript: string | null
): Promise<VideoTimeSegment[]> => {
  if (!transcript) {
    return [{
      startTime: 0,
      endTime: 180,
      reason: "No transcript available - playing first 3 minutes"
    }];
  }

  const genAI = getAiClient();
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    safetySettings 
  });

  const prompt = `Find 2-3 relevant time segments in this video transcript:

Video: "${videoTitle}"
Learning Point: "${learningPoint}"
Transcript: "${transcript.substring(0, 2000)}..."

Return ONLY valid JSON array:
[
  {
    "startTime": number_in_seconds,
    "endTime": number_in_seconds, 
    "reason": "why this segment is relevant"
  }
]`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    const segments = parseJsonResponse(result.response.text());

    if (Array.isArray(segments) && segments.length > 0) {
      return segments;
    }

    return [{
      startTime: 0,
      endTime: 180,
      reason: "Using default segment - AI parsing failed"
    }];
  } catch (error) {
    console.error('Video segment analysis failed:', error);
    return [{
      startTime: 0,
      endTime: 180,
      reason: "Using default segment - analysis error"
    }];
  }
};