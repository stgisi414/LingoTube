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

  // Regex to split the text by any potential lang tag, keeping the tags in the result array
  const splitter = /(<\/?lang:\w{2,3}>)/g;
  const parts = inputText.replace(/\([^)]*\)/g, '').trim().split(splitter);

  const segments: ParsedSegment[] = [];
  let isInsideLangTag = false;
  let currentLangCode: string | undefined = undefined;

  for (const part of parts) {
    if (!part) continue;

    const openTagMatch = part.match(/<lang:(\w{2,3})>/);
    const isCloseTag = part.startsWith('</lang:');

    if (openTagMatch) {
      isInsideLangTag = true;
      currentLangCode = openTagMatch[1];
    } else if (isCloseTag) {
      isInsideLangTag = false;
      currentLangCode = undefined;
    } else {
      // This part is actual text content
      if (isInsideLangTag && currentLangCode) {
        segments.push({ type: 'lang', text: part, langCode: currentLangCode });
      } else {
        segments.push({ type: 'plain', text: part });
      }
    }
  }

  // If no segments were produced, it means there were no tags.
  // Return the original text as a single plain segment.
  if (segments.length === 0 && inputText) {
      return [{type: 'plain', text: inputText}]
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