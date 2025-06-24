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
    cse_image?: Array<{ src:string; }>;
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

export const fetchYouTubeVideoIds = async (query: string): Promise<string[] | null> => {
  if (!GOOGLE_CUSTOM_SEARCH_API_KEY || !YOUTUBE_CUSTOM_SEARCH_CX) {
    console.warn("Google Custom Search API Key or CX not configured. Cannot fetch YouTube video IDs.");
    return null;
  }

  const searchQuery = `${query} tutorial explanation`; // Make search more specific
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&cx=${YOUTUBE_CUSTOM_SEARCH_CX}&q=${encodeURIComponent(searchQuery)}&num=5`; // Fetch 5 results

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Custom Search API error:", response.status, errorData);
      throw new Error(`Google Custom Search API request failed: ${response.statusText || response.status}`);
    }
    const data: CustomSearchResponse = await response.json();

    if (data.items && data.items.length > 0) {
      const videoIds = data.items.map(item => {
        if (item.pagemap?.videoobject && item.pagemap.videoobject.length > 0 && item.pagemap.videoobject[0].videoid) {
          return item.pagemap.videoobject[0].videoid;
        }
        if (item.link && item.link.includes("youtube.com/watch?v=")) {
          try {
            const videoUrl = new URL(item.link);
            return videoUrl.searchParams.get("v");
          } catch {
            return null;
          }
        }
        return null;
      }).filter((id): id is string => id !== null);

      return videoIds.length > 0 ? videoIds : null;
    }

    console.log("No YouTube videos found in Custom Search for query:", query);
    return null;
  } catch (error) {
    console.error("Failed to fetch YouTube video IDs via Custom Search:", error);
    return null;
  }
};