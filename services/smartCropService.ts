
import { GOOGLE_VISION_API_KEY } from '../constants';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SmartCropResult {
  bestCrop: CropArea;
  confidence: number;
  detectedObjects: string[];
  faces: number;
}

/**
 * Analyze image using Google Vision API to find the best crop area
 */
export const getSmartCrop = async (
  imageUrl: string, 
  context: string, 
  originalWidth: number, 
  originalHeight: number
): Promise<SmartCropResult> => {
  if (!GOOGLE_VISION_API_KEY) {
    console.warn("Google Vision API key not configured, using center crop");
    return getCenterCrop(originalWidth, originalHeight);
  }

  try {
    console.log(`🔍 Smart crop analysis for: ${context}`);
    
    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await blobToBase64(imageBlob);

    // Call Google Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
              },
              features: [
                { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
                { type: 'FACE_DETECTION', maxResults: 10 },
                { type: 'LABEL_DETECTION', maxResults: 10 }
              ]
            }
          ]
        })
      }
    );

    if (!visionResponse.ok) {
      throw new Error(`Vision API error: ${visionResponse.status}`);
    }

    const visionData = await visionResponse.json();
    const annotations = visionData.responses[0];

    // Analyze detected objects and faces
    const faces = annotations.faceAnnotations || [];
    const objects = annotations.localizedObjectAnnotations || [];
    const labels = annotations.labelAnnotations || [];

    console.log(`🔍 Vision analysis found:`, {
      faces: faces.length,
      objects: objects.length,
      labels: labels.length
    });

    // Determine best crop area based on detected features
    const bestCrop = calculateOptimalCrop(
      faces,
      objects,
      labels,
      context,
      originalWidth,
      originalHeight
    );

    return {
      bestCrop,
      confidence: calculateConfidence(faces, objects, labels),
      detectedObjects: objects.map(obj => obj.name),
      faces: faces.length
    };

  } catch (error) {
    console.error("Smart crop analysis failed:", error);
    return getCenterCrop(originalWidth, originalHeight);
  }
};

/**
 * Calculate optimal crop area based on Vision API results
 */
function calculateOptimalCrop(
  faces: any[],
  objects: any[],
  labels: any[],
  context: string,
  width: number,
  height: number
): CropArea {
  const targetAspectRatio = 16 / 9; // Landscape aspect ratio
  
  // Priority 1: If faces detected, focus on faces
  if (faces.length > 0) {
    return cropAroundFaces(faces, width, height, targetAspectRatio);
  }

  // Priority 2: Focus on relevant objects based on context
  const relevantObjects = findRelevantObjects(objects, context);
  if (relevantObjects.length > 0) {
    return cropAroundObjects(relevantObjects, width, height, targetAspectRatio);
  }

  // Priority 3: Focus on any prominent objects
  if (objects.length > 0) {
    const prominentObjects = objects.filter(obj => obj.score > 0.7);
    if (prominentObjects.length > 0) {
      return cropAroundObjects(prominentObjects, width, height, targetAspectRatio);
    }
  }

  // Fallback: Center crop
  return getCenterCrop(width, height);
}

/**
 * Create crop area focusing on detected faces
 */
function cropAroundFaces(faces: any[], width: number, height: number, aspectRatio: number): CropArea {
  // Find bounding box that includes all faces
  let minX = width, minY = height, maxX = 0, maxY = 0;

  faces.forEach(face => {
    const vertices = face.boundingPoly.vertices;
    vertices.forEach(vertex => {
      minX = Math.min(minX, vertex.x || 0);
      minY = Math.min(minY, vertex.y || 0);
      maxX = Math.max(maxX, vertex.x || 0);
      maxY = Math.max(maxY, vertex.y || 0);
    });
  });

  // Add generous padding around faces to ensure they're visible
  const paddingX = Math.min(width, height) * 0.2;
  const paddingY = Math.min(width, height) * 0.25; // Extra padding above for head/hair
  
  minX = Math.max(0, minX - paddingX);
  minY = Math.max(0, minY - paddingY);
  maxX = Math.min(width, maxX + paddingX);
  maxY = Math.min(height, maxY + paddingY);

  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;

  // Ensure minimum crop size to show full upper body/context
  const minCropWidth = width * 0.4;
  const minCropHeight = height * 0.4;

  if (faceWidth < minCropWidth) {
    const widthDiff = minCropWidth - faceWidth;
    minX = Math.max(0, minX - widthDiff / 2);
    maxX = Math.min(width, maxX + widthDiff / 2);
  }

  if (faceHeight < minCropHeight) {
    const heightDiff = minCropHeight - faceHeight;
    minY = Math.max(0, minY - heightDiff / 2);
    maxY = Math.min(height, maxY + heightDiff / 2);
  }

  // Adjust to target aspect ratio while preserving faces
  return adjustToAspectRatio(minX, minY, maxX - minX, maxY - minY, width, height, aspectRatio);
}

/**
 * Create crop area focusing on relevant objects
 */
function cropAroundObjects(objects: any[], width: number, height: number, aspectRatio: number): CropArea {
  // Find center of mass of all relevant objects
  let totalX = 0, totalY = 0, count = 0;
  let minX = width, minY = height, maxX = 0, maxY = 0;

  objects.forEach(obj => {
    const vertices = obj.boundingPoly.normalizedVertices;
    vertices.forEach(vertex => {
      const x = vertex.x * width;
      const y = vertex.y * height;
      totalX += x;
      totalY += y;
      count++;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  if (count === 0) return getCenterCrop(width, height);

  // Add padding around objects
  const padding = Math.min(width, height) * 0.15;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width, maxX + padding);
  maxY = Math.min(height, maxY + padding);

  return adjustToAspectRatio(minX, minY, maxX - minX, maxY - minY, width, height, aspectRatio);
}

/**
 * Find objects relevant to the given context
 */
function findRelevantObjects(objects: any[], context: string): any[] {
  const contextLower = context.toLowerCase();
  const relevantKeywords = [
    'person', 'face', 'human', 'man', 'woman', 'child',
    'animal', 'plant', 'building', 'vehicle', 'book',
    'computer', 'phone', 'food', 'instrument', 'tool'
  ];

  return objects.filter(obj => {
    const objName = obj.name.toLowerCase();
    return relevantKeywords.some(keyword => 
      objName.includes(keyword) || contextLower.includes(objName)
    );
  });
}

/**
 * Adjust crop area to maintain target aspect ratio
 */
function adjustToAspectRatio(
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  maxWidth: number, 
  maxHeight: number, 
  targetRatio: number
): CropArea {
  const currentRatio = w / h;

  if (currentRatio > targetRatio) {
    // Too wide, adjust height
    const newHeight = w / targetRatio;
    const heightDiff = newHeight - h;
    // Prefer expanding downward to keep faces/heads visible
    y = Math.max(0, y - heightDiff * 0.3);
    h = Math.min(maxHeight - y, newHeight);
    
    // If we hit the bottom, adjust upward
    if (y + h > maxHeight) {
      h = maxHeight - y;
      w = h * targetRatio;
      x = Math.max(0, x - (w - (maxWidth - x)) / 2);
    }
  } else {
    // Too tall, adjust width  
    const newWidth = h * targetRatio;
    const widthDiff = newWidth - w;
    x = Math.max(0, x - widthDiff / 2);
    w = Math.min(maxWidth - x, newWidth);
    
    // If we hit the right edge, adjust leftward
    if (x + w > maxWidth) {
      w = maxWidth - x;
      h = w / targetRatio;
      y = Math.max(0, y - (h - (maxHeight - y)) / 2);
    }
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(w),
    height: Math.round(h)
  };
}

/**
 * Calculate confidence score based on detected features
 */
function calculateConfidence(faces: any[], objects: any[], labels: any[]): number {
  let confidence = 0.5; // Base confidence

  if (faces.length > 0) confidence += 0.3;
  if (objects.length > 0) confidence += 0.2;
  if (labels.length > 0) confidence += 0.1;

  return Math.min(1.0, confidence);
}

/**
 * Fallback center crop
 */
function getCenterCrop(width: number, height: number): SmartCropResult {
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
    confidence: 0.5,
    detectedObjects: [],
    faces: 0
  };
}

/**
 * Apply smart crop to image URL
 */
export const applySmartCrop = (imageUrl: string, cropArea: CropArea): string => {
  // For demonstration, we'll return the original URL
  // In a real implementation, you'd use an image processing service
  // or client-side canvas to apply the crop
  
  // You could use services like Cloudinary, ImageKit, or implement
  // server-side image processing to apply the crop coordinates
  
  const cropParams = new URLSearchParams({
    x: cropArea.x.toString(),
    y: cropArea.y.toString(),
    w: cropArea.width.toString(),
    h: cropArea.height.toString()
  });

  // For now, return original URL with crop parameters for reference
  return `${imageUrl}#crop=${cropParams.toString()}`;
};

/**
 * Convert blob to base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
