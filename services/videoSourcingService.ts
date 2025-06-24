import { GOOGLE_CUSTOM_SEARCH_API_KEY, YOUTUBE_CUSTOM_SEARCH_CX, SUPADATA_API_KEY } from '../constants';

export interface SearchedVideo {
  youtubeId: string;
  title: string;
  educationalScore: number;
  transcript?: string | null;
}

export const searchYouTube = async (query: string): Promise<SearchedVideo[]> => {
    console.log(`🔍 VIDEO SEARCH: Starting search for query: "${query}"`);
    console.log("🔧 VIDEO SEARCH: API Configuration check:", {
        hasApiKey: !!GOOGLE_CUSTOM_SEARCH_API_KEY,
        hasCX: !!YOUTUBE_CUSTOM_SEARCH_CX,
        apiKeyLength: GOOGLE_CUSTOM_SEARCH_API_KEY?.length || 0,
        cxValue: YOUTUBE_CUSTOM_SEARCH_CX,
        timestamp: new Date().toISOString()
    });
    
    if (!GOOGLE_CUSTOM_SEARCH_API_KEY || !YOUTUBE_CUSTOM_SEARCH_CX) {
        console.error("❌ VIDEO SEARCH: CRITICAL ERROR - YouTube Custom Search API Key or CX is not configured.");
        console.error("❌ VIDEO SEARCH: Missing credentials:", {
            hasApiKey: !!GOOGLE_CUSTOM_SEARCH_API_KEY,
            hasCX: !!YOUTUBE_CUSTOM_SEARCH_CX
        });
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
    console.log("🌐 VIDEO SEARCH: Making API request to Custom Search");
    console.log("🌐 VIDEO SEARCH: Search URL (sanitized):", searchUrl.replace(GOOGLE_CUSTOM_SEARCH_API_KEY, '[REDACTED]'));
    console.log("🌐 VIDEO SEARCH: Request timestamp:", new Date().toISOString());

    try {
        console.log("📡 VIDEO SEARCH: Sending HTTP request to Google Custom Search API...");
        const startTime = performance.now();
        const response = await fetch(searchUrl);
        const endTime = performance.now();
        
        console.log("📡 VIDEO SEARCH: HTTP Response received:", {
            status: response.status, 
            statusText: response.statusText,
            responseTime: `${(endTime - startTime).toFixed(2)}ms`,
            headers: {
                contentType: response.headers.get('content-type'),
                contentLength: response.headers.get('content-length')
            }
        });
        
        if (!response.ok) {
            console.error("❌ VIDEO SEARCH: API request failed with status:", response.status);
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ VIDEO SEARCH: Full error response:", {
                status: response.status,
                statusText: response.statusText,
                errorData,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Video search failed: ${response.status} ${errorData.error?.message || response.statusText}`);
        }
        
        console.log("✅ VIDEO SEARCH: Successfully received API response");
        const data = await response.json();
        console.log("📊 VIDEO SEARCH: Response analysis:", {
            hasItems: !!data.items,
            itemCount: data.items?.length || 0,
            searchInformation: data.searchInformation,
            kind: data.kind,
            totalResults: data.searchInformation?.totalResults,
            searchTime: data.searchInformation?.searchTime
        });

        if (!data.items || data.items.length === 0) {
            console.warn("⚠️ VIDEO SEARCH: No search results found for query:", query);
            console.warn("⚠️ VIDEO SEARCH: API returned empty results:", {
                query,
                hasItems: !!data.items,
                itemsLength: data.items?.length,
                searchInfo: data.searchInformation
            });
            return [];
        }

        console.log("📋 VIDEO SEARCH: Processing raw search results:");
        console.log("📋 VIDEO SEARCH: Found items:", data.items.map((item, index) => ({
            index,
            title: item.title,
            link: item.link,
            snippet: item.snippet?.substring(0, 100) + '...'
        })));

        console.log("🔄 VIDEO SEARCH: Processing each search result for video extraction...");
        const results = data.items.map((item: any, index: number): SearchedVideo | null => {
            console.log(`🔄 VIDEO SEARCH: Processing item ${index + 1}/${data.items.length}:`, {
                title: item.title,
                link: item.link
            });
            
            const videoIdMatch = item.link.match(/(?:watch\?v=)([a-zA-Z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            console.log(`🔍 VIDEO SEARCH: Video ID extraction for item ${index + 1}:`, {
                title: item.title,
                link: item.link,
                videoIdMatch: !!videoIdMatch,
                extractedVideoId: videoId,
                isValidId: videoId && videoId.length === 11
            });

            if (videoId && videoId.length === 11) {
                let score = 1;
                const title = (item.title || '').toLowerCase();
                const scoringFactors = [];

                if (title.includes('tutorial') || title.includes('explained') || title.includes('how to')) {
                    score += 3;
                    scoringFactors.push('tutorial/explanation');
                }
                if (title.includes('course') || title.includes('lesson') || title.includes('learn')) {
                    score += 2;
                    scoringFactors.push('educational');
                }
                if (title.includes('lecture') || title.includes('documentary')) {
                    score += 2;
                    scoringFactors.push('academic');
                }

                const result = { 
                    youtubeId: videoId, 
                    title: item.title || 'Untitled', 
                    educationalScore: score 
                };
                
                console.log(`✅ VIDEO SEARCH: Successfully created video result ${index + 1}:`, {
                    ...result,
                    scoringFactors,
                    snippet: item.snippet?.substring(0, 50) + '...'
                });
                return result;
            } else {
                console.log(`❌ VIDEO SEARCH: Invalid or missing video ID for item ${index + 1}:`, {
                    link: item.link,
                    videoId,
                    reason: !videoId ? 'No video ID found' : 'Invalid video ID length'
                });
            }
            return null;
        }).filter((item): item is SearchedVideo => item !== null);

        console.log("🎯 VIDEO SEARCH: Final results summary:", {
            originalQuery: query,
            totalApiResults: data.items?.length || 0,
            validVideoResults: results.length,
            timestamp: new Date().toISOString()
        });
        
        console.log("🎯 VIDEO SEARCH: Valid video results found:", results.map((r, i) => ({
            rank: i + 1,
            youtubeId: r.youtubeId,
            title: r.title,
            educationalScore: r.educationalScore
        })));

        if (results.length === 0) {
            console.warn("⚠️ VIDEO SEARCH: No valid YouTube videos found in search results");
        }

        return results;
    } catch (error) {
        console.error(`❌ VIDEO SEARCH: Critical error during search for "${query}":`, {
            query,
            error: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return [];
    }
};

export const getVideoTranscript = async (youtubeId: string): Promise<string | null> => {
    console.log(`📜 TRANSCRIPT: Starting transcript fetch for video: ${youtubeId}`);
    console.log(`📜 TRANSCRIPT: Timestamp: ${new Date().toISOString()}`);
    
    if (!SUPADATA_API_KEY) {
        console.warn("⚠️ TRANSCRIPT: Supadata API key is not configured - transcript fetch will be skipped");
        console.warn("⚠️ TRANSCRIPT: This will reduce video relevance accuracy");
        return null;
    }

    console.log(`📜 TRANSCRIPT: API key available, making request to Supadata API...`);

    try {
        const startTime = performance.now();
        const apiUrl = `https://api.supadata.ai/v1/youtube/video?id=${youtubeId}`;
        console.log(`📜 TRANSCRIPT: Making request to: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 
                'x-api-key': SUPADATA_API_KEY, 
                'Content-Type': 'application/json' 
            }
        });

        const endTime = performance.now();
        console.log(`📜 TRANSCRIPT: API response received:`, {
            youtubeId,
            status: response.status,
            statusText: response.statusText,
            responseTime: `${(endTime - startTime).toFixed(2)}ms`,
            headers: {
                contentType: response.headers.get('content-type'),
                contentLength: response.headers.get('content-length')
            }
        });

        if (!response.ok) {
            console.warn(`⚠️ TRANSCRIPT: API request failed for ${youtubeId}:`, {
                status: response.status,
                statusText: response.statusText,
                reason: 'Video may not have available transcript or API error'
            });
            return null;
        }
        
        const data = await response.json();
        console.log(`📜 TRANSCRIPT: API response data structure:`, {
            youtubeId,
            hasData: !!data,
            hasTranscript: !!data?.transcript,
            transcriptType: data?.transcript ? (Array.isArray(data.transcript) ? 'array' : typeof data.transcript) : 'none',
            dataKeys: data ? Object.keys(data) : []
        });

        if (data && data.transcript) {
            let processedTranscript: string;
            
            if (Array.isArray(data.transcript)) {
                processedTranscript = data.transcript
                    .map(item => item.text || item.content || '')
                    .join(' ');
                console.log(`📜 TRANSCRIPT: Processed array transcript:`, {
                    youtubeId,
                    segments: data.transcript.length,
                    totalLength: processedTranscript.length,
                    preview: processedTranscript.substring(0, 100) + '...'
                });
            } else if (typeof data.transcript === 'string') {
                processedTranscript = data.transcript;
                console.log(`📜 TRANSCRIPT: Using string transcript:`, {
                    youtubeId,
                    length: processedTranscript.length,
                    preview: processedTranscript.substring(0, 100) + '...'
                });
            } else {
                processedTranscript = JSON.stringify(data.transcript);
                console.log(`📜 TRANSCRIPT: Converting object transcript to string:`, {
                    youtubeId,
                    originalType: typeof data.transcript,
                    stringLength: processedTranscript.length
                });
            }
            
            console.log(`✅ TRANSCRIPT: Successfully obtained transcript for ${youtubeId} (${processedTranscript.length} characters)`);
            return processedTranscript;
        }
        
        console.log(`⚠️ TRANSCRIPT: No transcript found in response for ${youtubeId}`);
        return null;
    } catch (error) {
        console.error(`❌ TRANSCRIPT: Critical error fetching transcript for ${youtubeId}:`, {
            youtubeId,
            error: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return null;
    }
};