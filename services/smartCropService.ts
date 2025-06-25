
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

  console.log(`📍 Face bounding box: (${minX}, ${minY}) to (${maxX}, ${maxY})`);

  // For multiple faces, be more generous with padding to ensure all faces are visible
  const isMultipleFaces = faces.length > 1;
  const basePadding = Math.min(width, height) * 0.15;
  
  // Extra generous padding for multiple faces and head space
  const paddingX = basePadding * (isMultipleFaces ? 1.5 : 1.2);
  const paddingY = basePadding * (isMultipleFaces ? 1.8 : 1.5); // More padding above for hair/head
  
  // Apply padding with special attention to not cropping heads
  minX = Math.max(0, minX - paddingX);
  minY = Math.max(0, minY - paddingY * 1.2); // Extra space above faces
  maxX = Math.min(width, maxX + paddingX);
  maxY = Math.min(height, maxY + paddingY * 0.8); // Less space below faces

  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;

  // For business/professional context, ensure we show upper torso
  const minCropWidth = width * (isMultipleFaces ? 0.6 : 0.5);
  const minCropHeight = height * (isMultipleFaces ? 0.6 : 0.5);

  if (faceWidth < minCropWidth) {
    const widthDiff = minCropWidth - faceWidth;
    minX = Math.max(0, minX - widthDiff / 2);
    maxX = Math.min(width, maxX + widthDiff / 2);
  }

  if (faceHeight < minCropHeight) {
    const heightDiff = minCropHeight - faceHeight;
    // Prefer expanding upward and downward, but prioritize upward for head space
    const upwardExpansion = heightDiff * 0.6;
    const downwardExpansion = heightDiff * 0.4;
    
    minY = Math.max(0, minY - upwardExpansion);
    maxY = Math.min(height, maxY + downwardExpansion);
  }

  console.log(`📏 Final face crop area before aspect ratio adjustment: (${minX}, ${minY}) ${maxX - minX}x${maxY - minY}`);

  // Adjust to target aspect ratio while preserving faces
  return adjustToAspectRatioForFaces(minX, minY, maxX - minX, maxY - minY, width, height, aspectRatio, faces);
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
 * Face-aware aspect ratio adjustment that prioritizes keeping faces visible
 */
function adjustToAspectRatioForFaces(
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  maxWidth: number, 
  maxHeight: number, 
  targetRatio: number,
  faces: any[]
): CropArea {
  const currentRatio = w / h;

  // Find the topmost face position to ensure we don't crop heads
  let topmostFaceY = maxHeight;
  faces.forEach(face => {
    const vertices = face.boundingPoly.vertices;
    vertices.forEach(vertex => {
      topmostFaceY = Math.min(topmostFaceY, vertex.y || maxHeight);
    });
  });

  if (currentRatio > targetRatio) {
    // Too wide, need to make taller
    const newHeight = w / targetRatio;
    const heightDiff = newHeight - h;
    
    // Ensure we don't crop above the topmost face
    const maxUpwardExpansion = Math.max(0, y - Math.max(0, topmostFaceY - 50)); // 50px buffer above faces
    const upwardExpansion = Math.min(heightDiff * 0.7, maxUpwardExpansion);
    const downwardExpansion = heightDiff - upwardExpansion;
    
    y = Math.max(0, y - upwardExpansion);
    h = Math.min(maxHeight - y, newHeight);
    
    // If we hit constraints, adjust width instead
    if (y + h > maxHeight) {
      h = maxHeight - y;
      w = h * targetRatio;
      const widthDiff = w - (maxWidth - x);
      if (widthDiff > 0) {
        x = Math.max(0, x - widthDiff / 2);
        w = Math.min(maxWidth - x, w);
      }
    }
  } else {
    // Too tall, need to make wider
    const newWidth = h * targetRatio;
    const widthDiff = newWidth - w;
    x = Math.max(0, x - widthDiff / 2);
    w = Math.min(maxWidth - x, newWidth);
    
    // If we hit the right edge, adjust height while preserving face visibility
    if (x + w > maxWidth) {
      w = maxWidth - x;
      const newHeight = w / targetRatio;
      const heightReduction = h - newHeight;
      
      // Reduce from bottom first to preserve face area
      h = newHeight;
      // Only adjust y if absolutely necessary and we won't crop faces
      if (y + h > maxHeight) {
        const yAdjustment = (y + h) - maxHeight;
        if (y - yAdjustment >= Math.max(0, topmostFaceY - 100)) {
          y = y - yAdjustment;
        }
      }
    }
  }

  console.log(`🎯 Face-aware crop result: (${Math.round(x)}, ${Math.round(y)}) ${Math.round(w)}x${Math.round(h)}`);

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
