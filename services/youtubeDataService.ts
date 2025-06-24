
import { YOUTUBE_DATA_API_KEY } from '../constants';

export interface YouTubeVideoDetails {
  title: string;
  description: string;
  durationSeconds: number;
}

interface YouTubeApiResponseItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number; }>;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    };
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
  };
  contentDetails: {
    duration: string; // ISO 8601 duration e.g. PT1M35S
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    contentRating: object;
    projection: string;
  };
}

interface YouTubeApiResponse {
  kind: string;
  etag: string;
  items: YouTubeApiResponseItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Helper function to parse ISO 8601 duration to seconds
const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

export const fetchVideoMetadata = async (videoId: string): Promise<YouTubeVideoDetails | null> => {
  if (!YOUTUBE_DATA_API_KEY) {
    console.warn("YOUTUBE_DATA_API_KEY not configured. Cannot fetch video metadata.");
    return null;
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_DATA_API_KEY}&id=${videoId}&part=snippet,contentDetails`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("YouTube Data API error:", response.status, errorData);
      throw new Error(`YouTube Data API request failed: ${response.statusText || response.status}`);
    }
    const data: YouTubeApiResponse = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        title: item.snippet.title,
        description: item.snippet.description,
        durationSeconds: parseISO8601Duration(item.contentDetails.duration),
      };
    }
    console.log("No video details found in YouTube Data API for videoId:", videoId);
    return null;
  } catch (error) {
    console.error("Failed to fetch video metadata from YouTube Data API:", error);
    return null;
  }
};