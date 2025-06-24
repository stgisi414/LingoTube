
import { GOOGLE_CUSTOM_SEARCH_API_KEY, IMAGE_CUSTOM_SEARCH_CX } from '../constants';

export interface ImageSearchResult {
  title: string;
  link: string;
  thumbnail: string;
  contextLink: string;
}

export const searchImages = async (query: string, count: number = 4): Promise<ImageSearchResult[]> => {
  if (!GOOGLE_CUSTOM_SEARCH_API_KEY || !IMAGE_CUSTOM_SEARCH_CX) {
    console.warn("Image search API key or CX not configured");
    return [];
  }

  const searchQuery = `${query} educational illustration diagram`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&cx=${IMAGE_CUSTOM_SEARCH_CX}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=${count}&safe=active`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Image search failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.map((item: any) => ({
        title: item.title || '',
        link: item.link || '',
        thumbnail: item.image?.thumbnailLink || item.link || '',
        contextLink: item.image?.contextLink || ''
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Image search error:", error);
    return [];
  }
};
