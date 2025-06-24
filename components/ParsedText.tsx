import React from 'react';

// Exporting ParsedSegment for use elsewhere
export interface ParsedSegment {
  type: 'plain' | 'lang';
  text: string;
  langCode?: string;
  translation?: {
    langCode: string;
    text: string;
  };
}

interface ParsedTextProps {
  text: string;
}

// Clean text by removing parenthetical content for TTS
const cleanTextForTTS = (text: string): string => {
  return text
    .replace(/\([^)]*\)/g, '') // Remove content in parentheses
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Exporting parseLangText for use elsewhere (e.g. TTS logic)
export const parseLangText = (inputText: string): ParsedSegment[] => {
  const segments: ParsedSegment[] = [];
  const regex = /\[LANG:(\w{2,3})\]\s*([^[]+?)\s*(?:\[LANG:(\w{2,3})\]\s*([^[]+?)\s*)?(?=\[LANG:\w{2,3}\]|$)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(inputText)) !== null) {
    if (match.index > lastIndex) {
      const plainText = cleanTextForTTS(inputText.substring(lastIndex, match.index));
      if (plainText) {
        segments.push({ type: 'plain', text: plainText });
      }
    }

    const langCode1 = match[1];
    const text1 = cleanTextForTTS(match[2]);
    const langCode2 = match[3];
    const text2 = match[4] ? cleanTextForTTS(match[4]) : undefined;

    if (text1) {
      const langSegment: ParsedSegment = {
        type: 'lang',
        langCode: langCode1,
        text: text1,
      };

      if (langCode2 && text2) {
        langSegment.translation = {
          langCode: langCode2,
          text: text2,
        };
      }
      segments.push(langSegment);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < inputText.length) {
    const remainingText = cleanTextForTTS(inputText.substring(lastIndex));
    if (remainingText) {
      segments.push({ type: 'plain', text: remainingText });
    }
  }

  // Filter out empty segments
  const nonEmptySegments = segments.filter(seg => seg.text.length > 0);

  if (nonEmptySegments.length === 0 && inputText.length > 0) {
    const cleanedText = cleanTextForTTS(inputText);
    if (cleanedText) {
      return [{ type: 'plain', text: cleanedText }];
    }
  }

  return nonEmptySegments;
};


const ParsedText: React.FC<ParsedTextProps> = ({ text }) => {
  const parsedSegments = parseLangText(text);

  if (!parsedSegments || parsedSegments.length === 0) {
    return <p className="text-slate-300 whitespace-pre-line leading-relaxed">{text}</p>;
  }

  return (
    <div className="text-slate-300 whitespace-pre-line leading-relaxed">
      {parsedSegments.map((segment, index) => {
        if (segment.type === 'lang') {
          return (
            <span key={index} className="my-1 block">
              <span 
                className="text-lg font-semibold text-purple-300 block" 
                lang={segment.langCode}
              >
                {segment.text}
              </span>
              {segment.translation && (
                <span 
                  className="text-sm text-slate-400 italic ml-1 block" 
                  lang={segment.translation.langCode}
                >
                  ({segment.translation.text})
                </span>
              )}
            </span>
          );
        }
        // Ensure plain text segments are also rendered, not just React.Fragment
        return <span key={index}>{segment.text}</span>;
      })}
    </div>
  );
};

// Default export for better bundler compatibility
export default ParsedText;