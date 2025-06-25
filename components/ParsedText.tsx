// components/ParsedText.tsx

import React, { useState, useEffect } from "react";
import { SpeakerPlayIcon, SpeakerStopIcon } from "../constants";
import { generateIllustrationUrls } from "../services/falAiService";

export interface ParsedSegment {
  type: "plain" | "lang";
  text: string;
  langCode?: string;
}

interface ParsedTextProps {
  text: string;
  onPlayAudio?: (text: string) => void;
  onStopAudio?: () => void;
  isPlaying?: boolean;
  lessonTopic?: string;
  generateIllustration?: boolean;
}

/**
 * Parser that handles language tags for both display and TTS compatibility.
 * Maintains compatibility with the TTS service's parseLanguageSegments function.
 */
export const parseLangText = (inputText: string): ParsedSegment[] => {
  if (!inputText || typeof inputText !== "string") return [];

  // Remove content in parentheses first but preserve the original text structure for TTS
  let workingText = inputText.replace(/\([^)]*\)/g, "").trim();

  const segments: ParsedSegment[] = [];

  // Use the same regex pattern as the TTS service for consistency
  const langTagRegex = /<lang:(\w+)>(.*?)<\/lang:\1>/g;
  let lastIndex = 0;
  let match;

  while ((match = langTagRegex.exec(workingText)) !== null) {
    // Add any English text before this tag
    if (match.index > lastIndex) {
      const englishText = workingText.slice(lastIndex, match.index).trim();
      if (englishText) {
        segments.push({ type: "plain", text: englishText });
      }
    }

    // Add the foreign language segment
    const langCode = match[1];
    const langText = match[2].trim();
    if (langText) {
      segments.push({ type: "lang", text: langText, langCode });
    }

    lastIndex = langTagRegex.lastIndex;
  }

  // Add any remaining English text
  if (lastIndex < workingText.length) {
    const remainingText = workingText.slice(lastIndex).trim();
    if (remainingText) {
      segments.push({ type: "plain", text: remainingText });
    }
  }

  // If no language tags were found, return the original cleaned text as plain
  if (segments.length === 0 && workingText) {
    return [{ type: "plain", text: workingText }];
  }

  return segments;
};

const ParsedText: React.FC<ParsedTextProps> = ({
  text,
  onPlayAudio,
  onStopAudio,
  isPlaying = false,
  lessonTopic,
  generateIllustration = false,
}) => {
  const [illustrationImage, setIllustrationImage] = useState<string | null>(
    null,
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    const generateIllustrationAsync = async () => {
      // Only generate illustrations for substantial content (>100 chars) when explicitly requested
      if (text.length > 100 && generateIllustration) {
        setIsLoadingImage(true);
        try {
          // Create a clean prompt from the text for image generation
          const cleanText = text
            .replace(/<lang:[^>]*>|<\/lang:[^>]*>/g, "")
            .replace(/\([^)]*\)/g, "")
            .trim();
          const imagePrompt = cleanText.slice(0, 150); // Use first 150 chars as prompt
          const imageUrls = await generateIllustrationUrls(
            imagePrompt,
            lessonTopic,
          );
          if (imageUrls && imageUrls.length > 0) {
            setIllustrationImage(imageUrls[0]);
          }
        } catch (error) {
          console.error("Failed to generate illustration:", error);
        } finally {
          setIsLoadingImage(false);
        }
      } else {
        setIllustrationImage(null);
        setIsLoadingImage(false);
      }
    };

    // Add a small delay to prevent immediate loading states during quick transitions
    const timeoutId = setTimeout(generateIllustrationAsync, 500);
    return () => clearTimeout(timeoutId);
  }, [text, lessonTopic, generateIllustration]);

  const parsedSegments = parseLangText(text);

  const renderParsedContent = (text: string) => {
    const parsedSegments = parseLangText(text);

    // Fallback to prevent crashing if text is weird
    if (!parsedSegments || parsedSegments.length === 0) {
      return <>{text || ""}</>;
    }

    return (
      <>
        {parsedSegments.map((segment, index) => {
          if (segment.type === "lang" && segment.text.trim()) {
            // Render the language-specific text with special styling
            return (
              <span
                key={index}
                className="mx-1 font-semibold text-yellow-300"
                lang={segment.langCode}
              >
                {segment.text}
              </span>
            );
          } else if (segment.type === "plain" && segment.text.trim()) {
            // Render plain text segments, preserving spaces
            return <span key={index}>{segment.text}</span>;
          }
          return null; // Don't render empty segments
        })}
      </>
    );
  };

  return (
    <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700 min-h-fit">
      <div className="flex items-start space-x-3 min-h-fit">
        {onPlayAudio && (
          <button
            onClick={() => (isPlaying ? onStopAudio?.() : onPlayAudio(text))}
            className={`flex-shrink-0 p-2 rounded-full transition-colors ${
              isPlaying
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
            aria-label={isPlaying ? "Stop narration" : "Play narration"}
          >
            {isPlaying ? SpeakerStopIcon : SpeakerPlayIcon}
          </button>
        )}
        <div className="flex-1">
          {generateIllustration && illustrationImage && (
            <div className="mb-3">
              <img
                src={illustrationImage.split('#')[0]} // Remove crop hash if present
                alt="Illustration for narration"
                className="w-full h-48 object-cover rounded-lg border border-slate-600"
                style={{
                  // Apply smart crop positioning if available
                  ...(illustrationImage.includes('#crop=') && (() => {
                    try {
                      const cropString = illustrationImage.split('#crop=')[1];
                      console.log(`🔍 Raw crop string: ${cropString}`);
                      
                      // Parse the crop string format: x:123,y:456,w:789,h:012
                      const cropParts = cropString.split(',');
                      const cropData = {};
                      
                      cropParts.forEach(part => {
                        const [key, value] = part.split(':');
                        cropData[key] = parseInt(value);
                      });
                      
                      const x = cropData['x'] || 0;
                      const y = cropData['y'] || 0;
                      const w = cropData['w'] || 800;
                      const h = cropData['h'] || 600;
                      
                      console.log(`🎯 Parsed crop coordinates: x=${x}, y=${y}, w=${w}, h=${h}`);
                      
                      // Calculate object-position based on crop area center with face-safe adjustments
                      const centerX = x + w / 2;
                      const centerY = y + h / 2;
                      
                      // Use actual image dimensions from FAL (landscape_4_3 = 1024x768)
                      const imageWidth = 1024;
                      const imageHeight = 768;
                      
                      // For face safety, bias positioning to show more of the upper area
                      // This helps prevent chin cropping on wider screens
                      let posX = Math.max(0, Math.min(100, (centerX / imageWidth) * 100));
                      let posY = Math.max(0, Math.min(100, (centerY / imageHeight) * 100));
                      
                      // Apply responsive adjustments based on container width
                      const containerWidth = window.innerWidth;
                      if (containerWidth > 900) {
                        // On wider screens, show more of the top to prevent face cropping
                        posY = Math.max(15, posY - 10); // Move up but not too much
                        console.log(`📱 Wide screen adjustment: moved Y from ${posY + 10}% to ${posY}%`);
                      }
                      
                      // Extra safety: if Y position suggests faces might be cut, adjust upward
                      if (posY > 60) {
                        posY = Math.max(25, posY - 15);
                        console.log(`👤 Face safety adjustment: moved Y to ${posY}%`);
                      }
                      
                      console.log(`✅ Final object-position: ${posX}% ${posY}%`);
                      
                      return {
                        objectPosition: `${posX}% ${posY}%`
                      };
                    } catch (error) {
                      console.error('❌ Failed to parse crop coordinates:', error);
                      return { objectPosition: 'center 25%' };
                    }
                  })() || { objectPosition: 'center 25%' })
                }}
                onError={(e) => {
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    container.style.display = "none";
                  }
                }}
              />
            </div>
          )}
          {isLoadingImage && generateIllustration && (
            <div className="mb-3 w-full h-48 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-zinc-400"></div>
                <span className="text-slate-400 text-sm">
                  Generating illustration...
                </span>
              </div>
            </div>
          )}
          <div className="text-slate-200 leading-relaxed">
            {renderParsedContent(text)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParsedText;
