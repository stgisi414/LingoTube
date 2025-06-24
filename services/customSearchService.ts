
import { GOOGLE_CUSTOM_SEARCH_API_KEY, YOUTUBE_CUSTOM_SEARCH_CX } from '../constants';

// Interface for the item in Custom Search API response
interface CustomSearchItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string; // This will be the YouTube URL
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId?: string;
  formattedUrl?: string;
  htmlFormattedUrl?: string;
  pagemap?: {
    cse_thumbnail?: Array<{ src: string; width: string; height: string; }>;
    metatags?: Array<Record<string, string>>;
    cse_image?: Array<{ src: string; }>;
    videoobject?: Array<{
        embedurl: string;
        playertype: string;
        isfamilyfriendly: string;
        uploaddate: string;
        description: string;
        videoid: string; // The YouTube video ID
        url: string;
        duration: string;
        unlisted: string;
        name: string;
        paid: string;
        width: string;
        regionsallowed: string;
        genre: string;
        interactioncount: string;
        channelid: string;
        datepublished: string;
        thumbnailurl: string;
        height: string;
    }>;
  };
}

interface CustomSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
      siteSearch?: string;
      siteSearchFilter?: string;
    }>;
    nextPage?: Array<any>;
  };
  context: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items?: CustomSearchItem[];
}


export const fetchYouTubeVideoId = async (query: string): Promise<string | null> => {
  if (!GOOGLE_CUSTOM_SEARCH_API_KEY || !YOUTUBE_CUSTOM_SEARCH_CX) {
    console.warn("Google Custom Search API Key or CX not configured in constants.ts. Cannot fetch YouTube video ID.");
    return null;
  }

  // Ensure the query targets YouTube. The CX should ideally be configured for this,
  // but adding 'site:youtube.com' can be a safeguard if it's a general CX.
  // Or, more simply, ensure the user's CX is set up to search YouTube.
  // For this implementation, we assume the CX is either YouTube-specific or the query is crafted to be YouTube-relevant.
  // To be more explicit, one might add "site:youtube.com" to the query string if the CX is general.
  const searchQuery = query; // Assuming query is specific enough or CX is configured for YouTube
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&cx=${YOUTUBE_CUSTOM_SEARCH_CX}&q=${encodeURIComponent(searchQuery)}&num=1`; // Get 1 result

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Try to parse JSON, default to empty object on failure
      console.error("Custom Search API error:", response.status, errorData);
      throw new Error(`Google Custom Search API request failed: ${response.statusText || response.status}`);
    }
    const data: CustomSearchResponse = await response.json();

    if (data.items && data.items.length > 0) {
      const firstItem = data.items[0];
      // Prefer videoid from pagemap if available
      if (firstItem.pagemap?.videoobject && firstItem.pagemap.videoobject.length > 0 && firstItem.pagemap.videoobject[0].videoid) {
        return firstItem.pagemap.videoobject[0].videoid;
      }
      // Fallback: extract from 'link' if it's a standard YouTube watch URL
      if (firstItem.link && firstItem.link.includes("youtube.com/watch?v=")) {
        try {
            const videoUrl = new URL(firstItem.link);
            const videoId = videoUrl.searchParams.get("v");
            if (videoId) return videoId;
        } catch (e) {
            console.warn("Could not parse video ID from link:", firstItem.link, e);
        }
      }
    }
    console.log("No relevant YouTube video ID found in Custom Search results for query:", query);
    return null;
  } catch (error) {
    console.error("Failed to fetch YouTube video ID via Custom Search:", error);
    return null;
  }
};
