import { GoogleGenerativeAI } from "@google/generative-ai";
import { LessonPlan, VideoTimeSegment } from '../types';
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from '../constants';

// This will hold the initialized client. It starts as null.
let aiClient: GoogleGenerativeAI | null = null;

/**
 * This function initializes the GoogleGenerativeAI client only when it's first called.
 * This solves the "API Key must be set" error by ensuring the environment is ready.
 */
const getAiClient = (): GoogleGenerativeAI => {
    if (!aiClient) {
        if (!GEMINI_API_KEY) {
            // This will give a much clearer error if the key is truly missing from the .env file.
            const errorMsg = "FATAL ERROR: VITE_GEMINI_API_KEY is not set in your .env.local file. Please set it and restart the server.";
            alert(errorMsg); // Use an alert to make it impossible to miss.
            throw new Error(errorMsg);
        }
        // Create the client, now that we know the key exists.
        aiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
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
    console.log(`🔍 SEARCH QUERIES: Generating search queries for learning point: "${learningPoint}"`);
    console.log(`🔍 SEARCH QUERIES: Main topic context: "${mainTopic}"`);
    console.log(`🔍 SEARCH QUERIES: Timestamp: ${new Date().toISOString()}`);
    
    // This logic from your original pipeline is simple and effective.
    const baseQueries = [
        `${learningPoint}`,
        `${mainTopic} ${learningPoint}`,
        `${learningPoint} tutorial`,
        `${learningPoint} explained`
    ];
    
    const uniqueQueries = [...new Set(baseQueries)];
    
    console.log(`🔍 SEARCH QUERIES: Generated queries:`, {
        learningPoint,
        mainTopic,
        baseQueries,
        uniqueQueries,
        totalQueries: uniqueQueries.length
    });
    
    return uniqueQueries;
};

/**
 * Uses AI to find the most relevant time segments in a video.
 */
export const findVideoSegments = async (videoTitle: string, learningPoint: string, transcript: string | null): Promise<VideoTimeSegment[]> => {
    console.log(`🎬 VIDEO SEGMENTS: Starting segment analysis for video: "${videoTitle}"`);
    console.log(`🎬 VIDEO SEGMENTS: Analysis parameters:`, {
        videoTitle,
        learningPoint,
        hasTranscript: !!transcript,
        transcriptLength: transcript?.length || 0,
        timestamp: new Date().toISOString()
    });

    const genAI = getAiClient();
    let prompt = `You are a video analyst. For the YouTube video titled "${videoTitle}", find the 1-3 most relevant segments for the learning topic: "${learningPoint}".`;
    if (transcript) {
        prompt += `\n\nUse this transcript to find exact timings:\n"${transcript.substring(0, 5000)}..."`;
        console.log(`🎬 VIDEO SEGMENTS: Using transcript for precise timing (${transcript.length} chars, truncated to 5000)`);
    } else {
        prompt += `\n(No transcript available, use general heuristics for a standard educational video structure).`;
        console.log(`🎬 VIDEO SEGMENTS: No transcript available - using heuristic approach`);
    }
    prompt += `\n\nCRITICAL: Return ONLY a valid JSON array matching this TypeScript interface: VideoTimeSegment[].
interface VideoTimeSegment { startTime: number; endTime: number; reason: string; }
Example: [{"startTime": 45, "endTime": 135, "reason": "Explains the core concept of X"}]
If you cannot find specific segments, return a single, broader segment like [{"startTime": 30, "endTime": 210, "reason": "Main educational content"}].`;

    console.log(`🎬 VIDEO SEGMENTS: Sending analysis request to Gemini AI...`);
    console.log(`🎬 VIDEO SEGMENTS: Prompt length: ${prompt.length} characters`);

    try {
        const startTime = performance.now();
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.3 }
        });
        const endTime = performance.now();

        console.log(`🎬 VIDEO SEGMENTS: AI response received:`, {
            videoTitle,
            responseTime: `${(endTime - startTime).toFixed(2)}ms`,
            rawResponseLength: result.response.text()?.length || 0
        });

        const segments = parseJsonResponse(result.response.text());
        console.log(`🎬 VIDEO SEGMENTS: Parsed AI response:`, {
            videoTitle,
            segments,
            isValidArray: Array.isArray(segments),
            segmentCount: Array.isArray(segments) ? segments.length : 0,
            hasValidStructure: Array.isArray(segments) && segments.length > 0 && typeof segments[0]?.startTime === 'number'
        });

        // Basic validation of the parsed response
        if (Array.isArray(segments) && segments.length > 0 && typeof segments[0].startTime === 'number') {
            console.log(`✅ VIDEO SEGMENTS: Successfully found ${segments.length} segments for "${videoTitle}":`, 
                segments.map((seg, i) => ({
                    segment: i + 1,
                    startTime: seg.startTime,
                    endTime: seg.endTime,
                    duration: seg.endTime - seg.startTime,
                    reason: seg.reason
                }))
            );
            return segments;
        }
        
        console.warn(`⚠️ VIDEO SEGMENTS: Invalid AI response format for "${videoTitle}" - using fallback`);
    } catch (error) {
        console.error(`❌ VIDEO SEGMENTS: Error analyzing "${videoTitle}":`, {
            videoTitle,
            error: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
    
    // Fallback if AI fails or returns invalid data
    const fallbackSegment = { startTime: 30, endTime: 180, reason: "Main educational content" };
    console.log(`🔄 VIDEO SEGMENTS: Using fallback segment for "${videoTitle}":`, fallbackSegment);
    return [fallbackSegment];
};

/**
 * [UPGRADED] Uses AI to check for video relevance, mirroring the proven logic.
 */
export const checkVideoRelevance = async (videoTitle: string, learningPoint: string, mainTopic: string, transcript: string | null): Promise<{ relevant: boolean; reason: string; confidence: number; }> => {
    console.log(`🤖 RELEVANCE CHECK: Starting AI relevance analysis`);
    console.log(`🤖 RELEVANCE CHECK: Input parameters:`, {
        videoTitle,
        learningPoint,
        mainTopic,
        hasTranscript: !!transcript,
        transcriptLength: transcript?.length || 0,
        timestamp: new Date().toISOString()
    });

    const genAI = getAiClient();
    const prompt = `
Analyze if this YouTube video is relevant for a lesson.

- Main Lesson Topic: "${mainTopic}"
- Current Learning Point: "${learningPoint}"
- Video Title: "${videoTitle}"
${transcript ? `- Video Transcript Snippet: "${transcript.substring(0, 1000)}..."` : ''}

CRITERIA:
1.  **Topic Match**: Is the video about the learning point?
2.  **Educational Tone**: Is it a tutorial, explanation, or documentary? Avoid vlogs, music videos, or unrelated content.
3.  **No Sales Pitches**: The video should not primarily be an ad for a product or service.

Return ONLY a valid JSON object matching this interface:
{ "relevant": boolean, "reason": "A brief justification for your decision.", "confidence": number }`;

    console.log(`🤖 RELEVANCE CHECK: Sending request to Gemini AI...`);
    console.log(`🤖 RELEVANCE CHECK: Prompt length: ${prompt.length} characters`);

    try {
        const startTime = performance.now();
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        });
        const endTime = performance.now();

        console.log(`🤖 RELEVANCE CHECK: AI response received:`, {
            responseTime: `${(endTime - startTime).toFixed(2)}ms`,
            rawResponseLength: result.response.text()?.length || 0
        });

        const relevanceResult = parseJsonResponse(result.response.text());
        console.log(`🤖 RELEVANCE CHECK: Parsed AI response:`, {
            videoTitle,
            relevanceResult,
            isValid: relevanceResult && typeof relevanceResult.relevant === 'boolean'
        });

        if (relevanceResult && typeof relevanceResult.relevant === 'boolean') {
            console.log(`✅ RELEVANCE CHECK: Successfully analyzed video "${videoTitle}":`, {
                relevant: relevanceResult.relevant,
                confidence: relevanceResult.confidence,
                reason: relevanceResult.reason
            });
            return relevanceResult;
        }
        
        console.warn(`⚠️ RELEVANCE CHECK: Invalid AI response format for "${videoTitle}"`);
        return { relevant: false, reason: "AI response was not valid.", confidence: 0 };
    } catch (error) {
        console.error(`❌ RELEVANCE CHECK: Error analyzing "${videoTitle}":`, {
            videoTitle,
            error: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return { relevant: false, reason: "An error occurred during relevance check.", confidence: 0 };
    }
};