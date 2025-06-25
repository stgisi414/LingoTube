import { FAL_API_KEY } from '../constants';
import { getGeminiSmartCrop, GeminiCropResult } from './geminiCropService';

interface FalImageResult {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

interface EnhancedImageResult {
  url: string;
  width: number;
  height: number;
  smartCrop?: GeminiCropResult;
  croppedUrl?: string;
}

export const generateIllustration = async (prompt: string, topic?: string): Promise<EnhancedImageResult[]> => {
  if (!FAL_API_KEY) {
    console.warn("FAL API key not configured");
    return [];
  }

  try {
    console.log(`🎨 Generating illustration for: "${prompt}"`);

    const response = await fetch('https://fal.run/fal-ai/flux-pro', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Educational illustration: ${prompt}. Clean, professional, detailed artwork suitable for learning materials. Focus on main subject, clear composition.`,
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 2,
        enable_safety_checker: true
      }),
    });

    if (!response.ok) {
      throw new Error(`FAL API error: ${response.status}`);
    }

    const result: FalImageResult = await response.json();

    if (result.images && result.images.length > 0) {
      console.log(`✅ Generated ${result.images.length} illustrations, analyzing for smart crops...`);

      // Process each image with smart cropping
      const enhancedResults = await Promise.all(
        result.images.map(async (img): Promise<EnhancedImageResult> => {
          try {
            // Get Gemini smart crop analysis
            const smartCrop = await getGeminiSmartCrop(img.url, topic || prompt, img.width, img.height);
            
            console.log(`🤖 Gemini provided crop:`, {
              x: smartCrop.bestCrop.x,
              y: smartCrop.bestCrop.y,
              width: smartCrop.bestCrop.width,
              height: smartCrop.bestCrop.height,
              confidence: smartCrop.confidence,
              reasoning: smartCrop.reasoning
            });
            
            const croppedUrl = `${img.url}#crop=x:${smartCrop.bestCrop.x},y:${smartCrop.bestCrop.y},w:${smartCrop.bestCrop.width},h:${smartCrop.bestCrop.height}`;
            console.log(`🔗 Generated cropped URL: ${croppedUrl}`);

            return {
              url: img.url,
              width: img.width,
              height: img.height,
              smartCrop,
              croppedUrl
            };
          } catch (error) {
            console.warn("Gemini crop analysis failed for image:", error);
            return {
              url: img.url,
              width: img.width,
              height: img.height
            };
          }
        })
      );

      console.log(`🤖 Gemini crop analysis completed for ${enhancedResults.length} images`);
      return enhancedResults;
    }

    return [];
  } catch (error) {
    console.error("FAL illustration generation failed:", error);
    return [];
  }
};

// Legacy function for backward compatibility
export const generateIllustrationUrls = async (prompt: string, topic?: string): Promise<string[]> => {
  const results = await generateIllustration(prompt, topic);
  return results.map(r => r.croppedUrl || r.url);
};