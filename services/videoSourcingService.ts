import { GOOGLE_CUSTOM_SEARCH_API_KEY, YOUTUBE_CUSTOM_SEARCH_CX, SUPADATA_API_KEY } from '../constants';

export interface SearchedVideo {
  youtubeId: string;
  title: string;
  educationalScore: number;
  transcript?: string | null;
}

export const searchYouTube = async (query: string): Promise<SearchedVideo[]> => {
    console.log(`SEARCH: Using Custom Search for: "${query}"`);
    if (!GOOGLE_CUSTOM_SEARCH_API_KEY || !YOUTUBE_CUSTOM_SEARCH_CX) {
        console.error("YouTube Custom Search API Key or CX is not configured.");
        return [];
    }

    const searchParams = new URLSearchParams({
        key: GOOGLE_CUSTOM_SEARCH_API_KEY,
        cx: YOUTUBE_CUSTOM_SEARCH_CX,
        q: query,
        num: '10',
        filter: '1'
    });

    try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?${searchParams}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Youtube failed: ${response.status} ${errorData.error?.message || ''}`);
        }
        const data = await response.json();

        if (!data.items || data.items.length === 0) return [];

        const results = data.items.map((item: any): SearchedVideo | null => {
            const videoIdMatch = item.link.match(/(?:watch\?v=)([a-zA-Z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (videoId) {
                let score = 1;
                const title = (item.title || '').toLowerCase();

                if (title.includes('tutorial') || title.includes('explained') || title.includes('how to')) score += 3;
                if (title.includes('course') || title.includes('lesson') || title.includes('learn')) score += 2;
                if (title.includes('lecture') || title.includes('documentary')) score += 2;

                return { youtubeId: videoId, title: item.title || 'Untitled', educationalScore: score };
            }
            return null;
        }).filter((item): item is SearchedVideo => item !== null && item.youtubeId.length === 11);

        return results;
    } catch (error) {
        console.error(`SEARCH: Error for "${query}":`, error);
        return [];
    }
};

export const getVideoTranscript = async (youtubeId: string): Promise<string | null> => {
    console.log(`TRANSCRIPT: Fetching transcript for video: ${youtubeId}`);
    if (!SUPADATA_API_KEY) {
        console.warn("Supadata API key is not configured.");
        return null;
    }

    try {
        const response = await fetch(`https://api.supadata.ai/v1/youtube/video?id=${youtubeId}`, {
            method: 'GET',
            headers: { 'x-api-key': SUPADATA_API_KEY, 'Content-Type': 'application/json' }
        });

        if (!response.ok) return null;
        const data = await response.json();

        if (data && data.transcript) {
            return Array.isArray(data.transcript) 
                ? data.transcript.map(item => item.text || item.content || '').join(' ')
                : typeof data.transcript === 'string' ? data.transcript : JSON.stringify(data.transcript);
        }
        return null;
    } catch (error) {
        console.error(`TRANSCRIPT: Error fetching transcript for ${youtubeId}:`, error);
        return null;
    }
};