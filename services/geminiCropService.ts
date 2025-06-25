
import { API_KEY } from '../constants';

export interface GeminiCropResult {
  bestCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  reasoning: string;
}

export const getGeminiSmartCrop = async (
  imageUrl: string,
  context: string,
  originalWidth: number,
  originalHeight: number
): Promise<GeminiCropResult> => {
  if (!API_KEY) {
    console.warn("Gemini API key not configured, using center crop");
    return getCenterCrop(originalWidth, originalHeight);
  }

  try {
    console.log(`🤖 Gemini analyzing image for smart crop: ${context}`);

    // Fetch and convert image to base64
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
    
    const imageBlob = await response.blob();
    const base64Data = await blobToBase64(imageBlob);
    const base64Content = base64Data.split(',')[1];

    const prompt = `Analyze this image and suggest the best crop coordinates for an educational illustration about "${context}".

The original image dimensions are ${originalWidth}x${originalHeight} pixels.

I need crop coordinates that:
1. Focus on the most important visual elements for learning
2. Maintain a 16:9 aspect ratio (landscape)
3. Preserve any faces or text if present
4. Create an engaging focal point

Please respond with ONLY a JSON object in this exact format:
{
  "x": number,
  "y": number, 
  "width": number,
  "height": number,
  "confidence": number (0-1),
  "reasoning": "brief explanation"
}

The coordinates should be in pixels from the top-left corner (0,0).`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Content
                }
              }
            ]
          }]
        })
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }

    const cropData = JSON.parse(jsonMatch[0]);
    
    // Validate and sanitize the crop data
    const sanitizedCrop = sanitizeCropCoordinates(
      cropData.x || 0,
      cropData.y || 0,
      cropData.width || originalWidth,
      cropData.height || originalHeight,
      originalWidth,
      originalHeight
    );

    console.log(`✅ Gemini crop suggestion:`, sanitizedCrop);

    return {
      bestCrop: sanitizedCrop,
      confidence: Math.max(0, Math.min(1, cropData.confidence || 0.7)),
      reasoning: cropData.reasoning || "Gemini analysis"
    };

  } catch (error) {
    console.error("Gemini crop analysis failed:", error);
    return getCenterCrop(originalWidth, originalHeight);
  }
};

function sanitizeCropCoordinates(
  x: number,
  y: number,
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  // Ensure all values are numbers
  x = Math.max(0, Math.floor(Number(x) || 0));
  y = Math.max(0, Math.floor(Number(y) || 0));
  width = Math.max(100, Math.floor(Number(width) || maxWidth));
  height = Math.max(56, Math.floor(Number(height) || maxHeight));

  // Ensure crop doesn't exceed image bounds
  if (x + width > maxWidth) {
    width = maxWidth - x;
  }
  if (y + height > maxHeight) {
    height = maxHeight - y;
  }

  // Adjust to maintain 16:9 aspect ratio
  const targetRatio = 16 / 9;
  const currentRatio = width / height;

  if (currentRatio > targetRatio) {
    // Too wide, reduce width
    width = Math.floor(height * targetRatio);
  } else {
    // Too tall, reduce height
    height = Math.floor(width / targetRatio);
  }

  // Final bounds check
  if (x + width > maxWidth) {
    width = maxWidth - x;
    height = Math.floor(width / targetRatio);
  }
  if (y + height > maxHeight) {
    height = maxHeight - y;
    width = Math.floor(height * targetRatio);
  }

  return { x, y, width, height };
}

function getCenterCrop(width: number, height: number): GeminiCropResult {
  const aspectRatio = 16 / 9;
  let cropWidth = width;
  let cropHeight = height;

  if (width / height > aspectRatio) {
    cropWidth = height * aspectRatio;
  } else {
    cropHeight = width / aspectRatio;
  }

  return {
    bestCrop: {
      x: Math.round((width - cropWidth) / 2),
      y: Math.round((height - cropHeight) / 2),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight)
    },
    confidence: 0.6,
    reasoning: "Center crop fallback"
  };
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
