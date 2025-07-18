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
export const generateLessonPlan = async (topic: string, language: string): Promise<LessonPlan> => {
  console.log(`🎓 Generating lesson plan for topic: "${topic}"`);

  const genAI = getAiClient();
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    safetySettings 
  });

  const languageInstructions = {
    'en': 'Generate all content in English.',
    'ko': 'Generate all lesson content in Korean. Write narration, video titles, and descriptions in Korean.',
    'zh': 'Generate all lesson content in Chinese. Write narration, video titles, and descriptions in Chinese.',
    'ja': 'Generate all lesson content in Japanese. Write narration, video titles, and descriptions in Japanese.',
    'es': 'Generate all lesson content in Spanish. Write narration, video titles, and descriptions in Spanish.',
    'fr': 'Generate all lesson content in French. Write narration, video titles, and descriptions in French.',
    'de': 'Generate all lesson content in German. Write narration, video titles, and descriptions in German.',
    'it': 'Generate all lesson content in Italian. Write narration, video titles, and descriptions in Italian.'
  };

  const languageInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions['en'];

  const prompt = `Create a comprehensive educational lesson plan for: "${topic}"

IMPORTANT: ${languageInstruction}

You are an expert educator creating engaging lesson content. Generate a structured lesson plan with alternating narration and video segments.

Format the lesson with these guidelines:
1. Start with an introduction narration
2. Alternate between narration and video segments  
3. End with a conclusion narration
4. Use 4-6 total segments (including intro/outro)
5. Each video segment should have a clear search query for educational content

For narration text, include strategic language tags for key terms:
- For language learning topics: Use <lang:code>term</lang:code> for foreign words/phrases
- For other topics: Only tag specific technical terms, proper nouns, or concepts in other languages
- Keep most content in the target language (${language}) without language tags unless specifically highlighting foreign terms

Examples:
- For "French cuisine": "We'll learn about <lang:fr>croissants</lang:fr> and <lang:fr>baguettes</lang:fr>"
- For "Photosynthesis": "Plants convert sunlight into energy through photosynthesis" (NO language tags)
- For "Japanese culture": "Traditional <lang:ja>おもてなし</lang:ja> (omotenashi) hospitality"
- For "Computer programming": "Variables store data in memory" (NO language tags)

Exclude any text in parentheses from narration as it's for internal notes only.

Return ONLY a valid JSON object:
{
  "topic": "lesson topic in ${language}",
  "introNarration": "Introduction with language tags in ${language}...",
  "segments": [
    {
      "type": "narration",
      "id": "unique-id",
      "text": "Narration with language tags in ${language}..."
    },
    {
      "type": "video", 
      "id": "unique-id",
      "title": "Video section title in ${language}",
      "youtubeSearchQuery": "search query for YouTube",
      "segmentDescription": "What this video will demonstrate in ${language}"
    }
  ],
  "outroNarration": "Conclusion with language tags in ${language}..."
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

  // Pre-filter obviously irrelevant content
  const title = videoTitle.toLowerCase();
  const learning = learningPoint.toLowerCase();
  const topic = mainTopic.toLowerCase();
  
  // Hard filters for completely unrelated content
  const irrelevantKeywords = [
    'draw', 'drawing', 'sketch', 'art', 'paint', 'painting', 'illustration',
    'recipe', 'cooking', 'baking', 'food preparation',
    'workout', 'exercise', 'fitness', 'gym',
    'makeup', 'beauty', 'skincare', 'fashion',
    'gaming', 'gameplay', 'let\'s play', 'walkthrough',
    'unboxing', 'review', 'haul', 'shopping',
    'music video', 'song', 'lyrics', 'album',
    'sports', 'football', 'basketball', 'soccer'
  ];
  
  // Check if video title contains obviously irrelevant keywords that don't match the learning point
  for (const keyword of irrelevantKeywords) {
    if (title.includes(keyword) && !learning.includes(keyword) && !topic.includes(keyword)) {
      return { 
        relevant: false, 
        reason: `Video about "${keyword}" is not relevant to "${learningPoint}"`, 
        confidence: 9 
      };
    }
  }

  const prompt = `You are an expert educator analyzing video relevance. Be VERY STRICT in your assessment.

LEARNING OBJECTIVE: "${learningPoint}"
MAIN TOPIC: "${mainTopic}"
VIDEO TITLE: "${videoTitle}"
${transcript ? `VIDEO TRANSCRIPT SAMPLE: "${transcript.substring(0, 1500)}..."` : 'NO TRANSCRIPT AVAILABLE'}

STRICT EVALUATION CRITERIA:
1. The video content must DIRECTLY relate to the learning objective
2. The video title must contain relevant keywords or concepts
3. If transcript is available, it must contain relevant educational content
4. Generic tutorials unrelated to the topic should be marked as irrelevant
5. Art/drawing videos are only relevant if the learning objective is about art/drawing
6. Language learning videos should match the target language
7. Confidence should be 8-10 for clearly relevant, 4-7 for somewhat relevant, 1-3 for questionable

EXAMPLES OF IRRELEVANT MATCHES:
- Drawing tutorials when looking for language content
- Cooking videos when looking for technology content  
- Music videos when looking for educational content
- Generic "how to" videos unrelated to the specific topic

Be especially strict if the video title suggests completely different subject matter than the learning objective.

Return ONLY valid JSON:
{ "relevant": boolean, "reason": "detailed explanation of why relevant/irrelevant", "confidence": number_1_to_10 }`;

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
      // Apply additional confidence threshold - require higher confidence for positive matches
      if (relevanceResult.relevant && relevanceResult.confidence < 6) {
        return {
          relevant: false,
          reason: `Low confidence match (${relevanceResult.confidence}/10): ${relevanceResult.reason}`,
          confidence: relevanceResult.confidence
        };
      }
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