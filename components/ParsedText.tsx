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
 * A more robust parser that splits the text by language tags and reconstructs it.
 * This handles malformed or mismatched tags better for display purposes.
 */
export const parseLangText = (inputText: string): ParsedSegment[] => {
  if (!inputText || typeof inputText !== 'string') return [];

  // Remove content in parentheses first and clean the text
  let cleanText = inputText.replace(/\([^)]*\)/g, '').trim();
  
  // Remove orphaned closing tags that don't have matching opening tags
  cleanText = cleanText.replace(/<\/lang:\w{2,3}>\s*/g, '');

  const segments: ParsedSegment[] = [];
  
  // Use a more sophisticated regex to find properly paired language tags
  const langTagRegex = /<lang:(\w{2,3})>(.*?)(?=<lang:\w{2,3}>|$)/g;
  let lastIndex = 0;
  let match;

  while ((match = langTagRegex.exec(cleanText)) !== null) {
    // Add any English text before this tag
    if (match.index > lastIndex) {
      const englishText = cleanText.slice(lastIndex, match.index).trim();
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

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining English text
  if (lastIndex < cleanText.length) {
    const remainingText = cleanText.slice(lastIndex).trim();
    if (remainingText) {
      segments.push({ type: 'plain', text: remainingText });
    }
  }

  // If no language tags were found, return the original cleaned text as plain
  if (segments.length === 0 && cleanText) {
    return [{ type: 'plain', text: cleanText }];
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