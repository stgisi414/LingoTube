// components/ParsedText.tsx

import React, { useState, useEffect } from 'react';
import { SpeakerPlayIcon, SpeakerStopIcon } from '../constants';
import { generateIllustrationUrls } from '../services/falAiService';

export interface ParsedSegment {
  type: 'plain' | 'lang';
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
  if (!inputText || typeof inputText !== 'string') return [];

  // Remove content in parentheses first but preserve the original text structure for TTS
  let workingText = inputText.replace(/\([^)]*\)/g, '').trim();

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
        segments.push({ type: 'plain', text: englishText });
      }
    }

    // Add the foreign language segment
    const langCode = match[1];
    const langText = match[2].trim();
    if (langText) {
      segments.push({ type: 'lang', text: langText, langCode });
    }

    lastIndex = langTagRegex.lastIndex;
  }

  // Add any remaining English text
  if (lastIndex < workingText.length) {
    const remainingText = workingText.slice(lastIndex).trim();
    if (remainingText) {
      segments.push({ type: 'plain', text: remainingText });
    }
  }

  // If no language tags were found, return the original cleaned text as plain
  if (segments.length === 0 && workingText) {
    return [{ type: 'plain', text: workingText }];
  }

  return segments;
};

const ParsedText: React.FC<ParsedTextProps> = ({ text, onPlayAudio, onStopAudio, isPlaying = false, lessonTopic, generateIllustration = false }) => {
  const [illustrationImage, setIllustrationImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    const generateIllustration = async () => {
      if (text.length > 20 && generateIllustration) { // Only generate for longer text segments and if generateIllustration is true
        setIsLoadingImage(true);
        try {
          // Create a clean prompt from the text for image generation
          const cleanText = text.replace(/<lang:[^>]*>|<\/lang:[^>]*>/g, '').replace(/\([^)]*\)/g, '').trim();
          const imagePrompt = cleanText.slice(0, 150); // Use first 150 chars as prompt
          const imageUrls = await generateIllustrationUrls(imagePrompt, lessonTopic);
          if (imageUrls) {
            setIllustrationImage(imageUrls);
          }
        } catch (error) {
          console.error('Failed to generate illustration:', error);
        } finally {
          setIsLoadingImage(false);
        }
      } else {
        setIllustrationImage(null); // Clear the image if generateIllustration is false
      }
    };

    generateIllustration();
  }, [text, lessonTopic, generateIllustration]);

  const parsedSegments = parseLangText(text);

  const renderParsedContent = (text: string) => {
    const parsedSegments = parseLangText(text);

    // Fallback to prevent crashing if text is weird
    if (!parsedSegments || parsedSegments.length === 0) {
      return <>{text || ''}</>;
    }

    return (
      <>
        {parsedSegments.map((segment, index) => {
          if (segment.type === 'lang' && segment.text.trim()) {
            // Render the language-specific text with special styling
            return (
              <span key={index} className="mx-1 font-semibold text-purple-300" lang={segment.langCode}>
                {segment.text}
              </span>
            );
          } else if (segment.type === 'plain' && segment.text.trim()) {
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
            onClick={() => isPlaying ? onStopAudio?.() : onPlayAudio(text)}
            className={`flex-shrink-0 p-2 rounded-full transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            aria-label={isPlaying ? 'Stop narration' : 'Play narration'}
          >
            {isPlaying ? SpeakerStopIcon : SpeakerPlayIcon}
          </button>
        )}
        <div className="flex-1">
          {generateIllustration && (illustrationImage || isLoadingImage) && (
            <div className="mb-3">
              <img 
                src={illustrationImage} 
                alt="Illustration for narration" 
                className="w-full h-48 object-cover rounded-lg border border-slate-600"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          {isLoadingImage && (
            <div className="mb-3 w-full h-48 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center">
              <span className="text-slate-400 text-sm">Generating illustration...</span>
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