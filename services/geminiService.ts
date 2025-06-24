
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LessonPlan } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will likely fail. Ensure it is configured in your environment.");
  // For a production app, you might throw an error here or have a more robust configuration check.
  // throw new Error("API_KEY for Gemini is not configured.");
}

// Initialize AI client. If API_KEY is undefined, this will likely cause issues at runtime.
// The non-null assertion assumes the environment provides the key as per project guidelines.
const ai = new GoogleGenAI({ apiKey: API_KEY! });


export const generateLessonPlan = async (topic: string): Promise<LessonPlan> => {
  const prompt = `
You are an expert instructional designer creating engaging multimedia lesson plans.
The user wants to learn about: "${topic}".

Your task is to generate a comprehensive lesson plan structured as a single JSON object.
The lesson plan should include:
1.  An introductory narration.
2.  A sequence of learning segments. Each segment can be either:
    a.  A narration: Text to be read out, providing information or transitioning between topics.
    b.  A YouTube video segment: A pointer to a relevant part of a YouTube video.
3.  A concluding outro narration.

For each segment, provide a unique \`id\` string (e.g., "seg-intro", "seg-video-1", "seg-narration-2").

For narration segments, use the format:
{
  "type": "narration",
  "id": "unique-segment-id",
  "text": "The narration content here."
}

For YouTube video segments, use the format:
{
  "type": "video",
  "id": "unique-segment-id",
  "title": "Descriptive title for the video segment (e.g., 'Understanding Photosynthesis Basics')",
  "youtubeVideoId": "YOUTUBE_VIDEO_ID", // (STRONGLY PREFERRED) The 11-character YouTube video ID (e.g., "Zy2PjaVKsB0"). If you are highly confident about a specific, excellent public video, provide its ID. Otherwise, set to null.
  "youtubeSearchQuery": "concise YouTube search query", // (MANDATORY) A query to find relevant videos (e.g., "photosynthesis explained for beginners").
  "segmentDescription": "Guidance on what to watch", // (MANDATORY) E.g., "Focus on the first 2 minutes explaining the overall equation and importance." or "Watch the section demonstrating the experiment from 3:15 to 5:00."
  "estimatedStartSeconds": null, // (Optional) Estimated start time in seconds (e.g., 120). Set to null if unknown.
  "estimatedEndSeconds": null // (Optional) Estimated end time in seconds (e.g., 240). Set to null if unknown.
}

The overall JSON structure MUST adhere to this TypeScript interface:
interface LessonPlan {
  topic: string; // The original topic provided by the user.
  introNarration: string; // The main introductory text for the lesson.
  segments: Array<{
    type: 'narration' | 'video';
    id: string;
    // Plus other fields specific to narration or video
    text?: string; // For narration
    title?: string; // For video
    youtubeVideoId?: string | null;
    youtubeSearchQuery?: string;
    segmentDescription?: string;
    estimatedStartSeconds?: number | null;
    estimatedEndSeconds?: number | null;
  }>;
  outroNarration: string; // The main concluding text for the lesson.
}

Ensure the 'segments' array contains all intermediate narrations and video parts in a logical learning order.
The 'introNarration' and 'outroNarration' fields are for the overall lesson introduction and conclusion, respectively.
Please generate a lesson plan for the topic: "${topic}".
The entire response MUST be a single, valid JSON object. Do not wrap it in markdown backticks.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // temperature: 0.7, // Adjust creativity/determinism if needed
      }
    });

    let jsonStr = response.text.trim();
    // Gemini might still sometimes wrap in ```json ... ``` despite instructions.
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/si; // Made regex case-insensitive for 'json' and more robust
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    // Attempt to parse, even if it looks like plain JSON already
    const parsedData = JSON.parse(jsonStr);

    // Basic validation of the parsed structure
    if (
      parsedData &&
      typeof parsedData.topic === 'string' &&
      typeof parsedData.introNarration === 'string' &&
      Array.isArray(parsedData.segments) &&
      typeof parsedData.outroNarration === 'string'
    ) {
      // Further validation for each segment can be added here if necessary
      // For example, ensuring IDs are unique, required fields are present per type
      parsedData.segments = parsedData.segments.map((segment: any, index: number) => ({
        ...segment,
        id: segment.id || `gen-segment-${index}-${Date.now()}` // Fallback ID
      }));
      return parsedData as LessonPlan;
    } else {
      console.error("Parsed JSON does not match expected LessonPlan structure:", parsedData);
      throw new Error("Invalid lesson plan structure received from API. The response format was not as expected.");
    }

  } catch (error) {
    console.error("Error generating lesson plan from Gemini:", error);
    if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse lesson plan JSON from API response. Please try again. Raw response: ${error.message}`);
    } else if (error instanceof Error) {
        // Potentially check for specific Gemini error types if available/needed
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the lesson plan.");
  }
};