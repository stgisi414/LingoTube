
// components/ParsedText.tsx

import React from 'react';

export interface ParsedSegment {
  type: 'plain' | 'lang';
  text: string;
  langCode?: string;
}

interface ParsedTextProps {
  text: string;
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

const ParsedText: React.FC<ParsedTextProps> = ({ text }) => {
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

export default ParsedText;
