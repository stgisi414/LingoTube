
import { GOOGLE_TTS_API_KEY } from '../constants';

export interface TTSOptions {
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: 'NEUTRAL' | 'FEMALE' | 'MALE';
  audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS';
  speakingRate?: number;
  pitch?: number;
}

interface GoogleTTSRequest {
  input: { text: string };
  voice: { languageCode: string; name?: string; ssmlGender: string };
  audioConfig: { audioEncoding: string; speakingRate?: number; pitch?: number };
}

interface GoogleTTSResponse {
  audioContent: string;
}

interface ParsedSegment {
  type: 'plain' | 'lang';
  text: string;
  langCode?: string;
}

// Voice configurations for each language
const VOICE_CONFIG: Record<string, { languageCode: string; voiceName: string; gender: 'NEUTRAL' | 'FEMALE' | 'MALE' }> = {
  'en': { languageCode: 'en-US', voiceName: 'en-US-Neural2-A', gender: 'FEMALE' },
  'es': { languageCode: 'es-ES', voiceName: 'es-ES-Neural2-A', gender: 'FEMALE' },
  'fr': { languageCode: 'fr-FR', voiceName: 'fr-FR-Neural2-A', gender: 'FEMALE' },
  'de': { languageCode: 'de-DE', voiceName: 'de-DE-Neural2-A', gender: 'FEMALE' },
  'it': { languageCode: 'it-IT', voiceName: 'it-IT-Neural2-A', gender: 'FEMALE' },
  'zh': { languageCode: 'zh-CN', voiceName: 'zh-CN-Neural2-A', gender: 'FEMALE' },
  'ja': { languageCode: 'ja-JP', voiceName: 'ja-JP-Neural2-A', gender: 'FEMALE' },
  'ko': { languageCode: 'ko-KR', voiceName: 'ko-KR-Neural2-A', gender: 'FEMALE' }
};

// Parse text with language tags
export const parseLanguageText = (text: string): ParsedSegment[] => {
  const segments: ParsedSegment[] = [];
  const langTagRegex = /<lang code="([^"]+)">([^<]+)<\/lang>/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = langTagRegex.exec(text)) !== null) {
    // Add text before the language tag
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index).trim();
      if (plainText) {
        segments.push({ type: 'plain', text: plainText });
      }
    }
    
    // Add the language segment
    const langCode = match[1];
    const langText = match[2].trim();
    if (langText) {
      segments.push({ type: 'lang', text: langText, langCode });
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const plainText = text.slice(lastIndex).trim();
    if (plainText) {
      segments.push({ type: 'plain', text: plainText });
    }
  }
  
  return segments;
};

// Clean text by removing parenthetical content
const cleanText = (text: string): string => {
  return text.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
};

// Synthesize speech for a single segment
const synthesizeSegment = async (text: string, langCode: string = 'en'): Promise<string | null> => {
  if (!GOOGLE_TTS_API_KEY) {
    console.warn("GOOGLE_TTS_API_KEY not configured");
    return null;
  }

  const cleanedText = cleanText(text);
  if (!cleanedText) return null;

  const voiceConfig = VOICE_CONFIG[langCode] || VOICE_CONFIG['en'];
  
  const requestBody: GoogleTTSRequest = {
    input: { text: cleanedText },
    voice: {
      languageCode: voiceConfig.languageCode,
      name: voiceConfig.voiceName,
      ssmlGender: voiceConfig.gender
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0.0
    }
  };

  try {
    console.log(`🎵 TTS: Synthesizing "${cleanedText}" with ${voiceConfig.voiceName}`);
    
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google TTS API error:", response.status, errorData);
      throw new Error(`TTS API request failed: ${response.statusText}`);
    }

    const data: GoogleTTSResponse = await response.json();
    return data.audioContent;
  } catch (error) {
    console.error("Failed to synthesize speech:", error);
    return null;
  }
};

// Play audio from base64 content
const playAudioContent = async (audioContent: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const binaryString = atob(audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Global audio controller
class SpeechController {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }

  async playSequence(audioContents: string[]): Promise<void> {
    this.stop();
    this.isPlaying = true;

    for (const audioContent of audioContents) {
      if (!this.isPlaying) break;
      
      try {
        await playAudioContent(audioContent);
      } catch (error) {
        console.warn("Error playing audio segment:", error);
      }
    }
    
    this.isPlaying = false;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Global speech controller instance
const speechController = new SpeechController();

// Main multilingual TTS function
export const speakMultilingualText = async (text: string): Promise<void> => {
  console.log(`🗣️ Starting multilingual TTS for: "${text.substring(0, 100)}..."`);
  
  const segments = parseLanguageText(text);
  console.log(`🗣️ Parsed ${segments.length} segments:`, segments.map(s => ({
    type: s.type,
    langCode: s.langCode,
    text: s.text.substring(0, 50) + (s.text.length > 50 ? '...' : '')
  })));

  if (segments.length === 0) return;

  const audioContents: string[] = [];
  
  for (const segment of segments) {
    const langCode = segment.type === 'lang' ? segment.langCode! : 'en';
    const audioContent = await synthesizeSegment(segment.text, langCode);
    
    if (audioContent) {
      audioContents.push(audioContent);
    }
  }

  if (audioContents.length > 0) {
    console.log(`🗣️ Playing ${audioContents.length} audio segments sequentially`);
    await speechController.playSequence(audioContents);
  }
};

// Stop current speech
export const stopSpeech = (): void => {
  speechController.stop();
};

// Check if currently speaking
export const isSpeaking = (): boolean => {
  return speechController.getIsPlaying();
};

// Legacy function for compatibility
export const synthesizeSpeech = async (text: string, options: Partial<TTSOptions> = {}): Promise<string | null> => {
  return synthesizeSegment(text, 'en');
};

// Legacy function for compatibility
export const playTTSAudio = async (audioContent: string, audioRef?: React.MutableRefObject<HTMLAudioElement | null>, onComplete?: () => void): Promise<void> => {
  try {
    await playAudioContent(audioContent);
    if (onComplete) onComplete();
  } catch (error) {
    console.error("Failed to play TTS audio:", error);
    throw error;
  }
};

// New main function for multilingual synthesis - replaces synthesizeMultilingualSpeech
export const synthesizeMultilingualSpeech = speakMultilingualText;
