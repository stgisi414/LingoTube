import { GOOGLE_CUSTOM_SEARCH_API_KEY, YOUTUBE_CUSTOM_SEARCH_CX, SUPADATA_API_KEY } from '../constants';

export interface SearchedVideo {
  youtubeId: string;
  title: string;
  educationalScore: number;
  transcript?: string | null;
}

export const searchYouTube = async (query: string): Promise<SearchedVideo[]> => {
    console.log(`SEARCH: Using Custom Search for: "${query}"`);
    console.log("DEBUG: API Configuration:", {
        hasApiKey: !!GOOGLE_CUSTOM_SEARCH_API_KEY,
        hasCX: !!YOUTUBE_CUSTOM_SEARCH_CX,
        apiKeyLength: GOOGLE_CUSTOM_SEARCH_API_KEY?.length || 0,
        cxValue: YOUTUBE_CUSTOM_SEARCH_CX
    });
    
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

    const searchUrl = `https://www.googleapis.com/customsearch/v1?${searchParams}`;
    console.log("DEBUG: Search URL (without API key):", searchUrl.replace(GOOGLE_CUSTOM_SEARCH_API_KEY, '[REDACTED]'));

    try {
        console.log("DEBUG: Making fetch request...");
        const response = await fetch(searchUrl);
        console.log("DEBUG: Response status:", response.status, response.statusText);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("DEBUG: API Error Response:", errorData);
            throw new Error(`Youtube failed: ${response.status} ${errorData.error?.message || ''}`);
        }
        
        const data = await response.json();
        console.log("DEBUG: API Response:", {
            hasItems: !!data.items,
            itemCount: data.items?.length || 0,
            searchInformation: data.searchInformation,
            kind: data.kind
        });

        if (!data.items || data.items.length === 0) {
            console.warn("DEBUG: No items returned from search");
            return [];
        }

        console.log("DEBUG: Raw items from API:", data.items.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        })));

        const results = data.items.map((item: any): SearchedVideo | null => {
            const videoIdMatch = item.link.match(/(?:watch\?v=)([a-zA-Z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            console.log("DEBUG: Processing item:", {
                title: item.title,
                link: item.link,
                videoIdMatch,
                extractedVideoId: videoId
            });

            if (videoId) {
                let score = 1;
                const title = (item.title || '').toLowerCase();

                if (title.includes('tutorial') || title.includes('explained') || title.includes('how to')) score += 3;
                if (title.includes('course') || title.includes('lesson') || title.includes('learn')) score += 2;
                if (title.includes('lecture') || title.includes('documentary')) score += 2;

                const result = { youtubeId: videoId, title: item.title || 'Untitled', educationalScore: score };
                console.log("DEBUG: Created video result:", result);
                return result;
            } else {
                console.log("DEBUG: No video ID found for item:", item.link);
            }
            return null;
        }).filter((item): item is SearchedVideo => item !== null && item.youtubeId.length === 11);

        console.log("DEBUG: Final filtered results:", {
            count: results.length,
            results: results.map(r => ({
                youtubeId: r.youtubeId,
                title: r.title,
                educationalScore: r.educationalScore
            }))
        });

        return results;
    } catch (error) {
        console.error(`SEARCH: Error for "${query}":`, error);
        console.error("DEBUG: Full error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
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