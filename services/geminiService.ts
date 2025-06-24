import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LessonPlan, VideoTimeSegment } from '../types';
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from '../constants';

// This will hold the initialized client. It starts as null.
let aiClient: GoogleGenAI | null = null;

/**
 * This function initializes the GoogleGenAI client only when it's first called.
 * This solves the "API Key must be set" error by ensuring the environment is ready.
 */
const getAiClient = (): GoogleGenAI => {
    if (!aiClient) {
        if (!GEMINI_API_KEY) {
            // This will give a much clearer error if the key is truly missing from the .env file.
            const errorMsg = "FATAL ERROR: VITE_GEMINI_API_KEY is not set in your .env.local file. Please set it and restart the server.";
            alert(errorMsg); // Use an alert to make it impossible to miss.
            throw new Error(errorMsg);
        }
        // Create the client, now that we know the key exists.
        aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }
    return aiClient;
};

// Helper function to safely parse JSON from the AI's response.
const parseJsonResponse = (jsonStr: string) => {
    try {
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/si;
        const match = jsonStr.match(fenceRegex);
        const cleanStr = match ? match[1].trim() : jsonStr.trim();
        return JSON.parse(cleanStr);
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response:", error, "\nRaw response:\n", jsonStr);
        return null;
    }
};

/**
 * Generates the initial lesson plan.
 */
export const generateLessonPlan = async (topic: string): Promise<LessonPlan> => {
    const prompt = `
You are an expert instructional designer. Your task is to generate a comprehensive lesson plan for the topic: "${topic}".
The JSON object you return MUST directly match this TypeScript interface. DO NOT wrap it in a parent object.

interface LessonPlan {
  topic: string;
  introNarration: string;
  segments: Array<({ type: 'narration'; id: string; text: string; } | { type: 'video'; id: string; title: string; youtubeSearchQuery: string; segmentDescription: string; })>;
  outroNarration: string;
}

- For video segments, provide a high-quality \`youtubeSearchQuery\`.
- Ensure the lesson has a mix of narration and video segments.`;

    try {
        const genAI = getAiClient(); // Use the getter to ensure the client is ready.
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                maxOutputTokens: 8192,
            }
        });

        const textResponse = result.response.text();
        let parsedData = parseJsonResponse(textResponse);

        if (!parsedData) throw new Error("Response was not valid JSON.");

        // Defensive parsing to handle small variations from the AI
        if (parsedData.lessonPlan) parsedData = parsedData.lessonPlan;
        if (parsedData.title && !parsedData.topic) parsedData.topic = parsedData.title;
        if (parsedData.introduction?.text) parsedData.introNarration = parsedData.introduction.text;
        if (parsedData.conclusion?.text) parsedData.outroNarration = parsedData.conclusion.text;

        if (parsedData.topic && parsedData.introNarration && parsedData.segments) {
            return parsedData as LessonPlan;
        } else {
            throw new Error("Parsed JSON does not match the required LessonPlan structure.");
        }
    } catch (error) {
        console.error("Error in generateLessonPlan:", error);
        throw error;
    }
};

/**
 * Generates search queries for a given learning point.
 */
export const generateSearchQueries = async (learningPoint: string, mainTopic: string): Promise<string[]> => {
    return [`${learningPoint} explained`, `${mainTopic} ${learningPoint} tutorial`];
};

/**
 * Uses AI to find the most relevant time segments in a video.
 */
export const findVideoSegments = async (videoTitle: string, learningPoint: string, transcript: string | null): Promise<VideoTimeSegment[]> => {
    const genAI = getAiClient(); // Use the getter
    let prompt = `For YouTube video "${videoTitle}", find the most relevant 1-3 segments for the topic: "${learningPoint}".`;
    if (transcript) {
        prompt += `\nUse this transcript: "${transcript.substring(0, 4000)}..."`;
    }
    prompt += `\nReturn ONLY a valid JSON array like this: [{"startTime": 45, "endTime": 135, "reason": "Explains core concepts"}].`;

    try {
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        const segments = parseJsonResponse(result.response.text());
        if (Array.isArray(segments) && segments.length > 0 && typeof segments[0].startTime === 'number') {
            return segments;
        }
    } catch (error) {
        console.error("Error finding video segments:", error);
    }
    // Fallback if AI fails
    return [{ startTime: 30, endTime: 180, reason: "Main educational content" }];
};

/**
 * A non-AI function to check video relevance based on keywords.
 */
export const checkVideoRelevance = (videoTitle: string, learningPoint: string, mainTopic: string): { relevant: boolean } => {
    const title = videoTitle.toLowerCase();
    const topic = mainTopic.toLowerCase();
    const point = learningPoint.toLowerCase();
    if (title.includes(topic) || title.includes(point)) {
        return { relevant: true };
    }
    return { relevant: false };
};