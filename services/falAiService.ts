
interface FalAiImageResult {
  url: string;
  width: number;
  height: number;
}

interface FalAiResponse {
  images: FalAiImageResult[];
}

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${import.meta.env.VITE_FAL_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Educational illustration: ${prompt}. Clean, simple, educational style, high quality`,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      console.error("fal.ai API error:", response.status, response.statusText);
      return null;
    }

    const data: FalAiResponse = await response.json();
    
    if (data.images && data.images.length > 0) {
      return data.images[0].url;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to generate image with fal.ai:", error);
    return null;
  }
};
