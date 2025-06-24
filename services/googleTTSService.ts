
import { GOOGLE_TTS_API_KEY } from '../constants';
import { parseLangText } from '../components/ParsedText';

export interface TTSOptions {
  text: string;
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: 'NEUTRAL' | 'FEMALE' | 'MALE';
  audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS';
  speakingRate?: number;
  pitch?: number;
}

interface GoogleTTSRequest {
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    name?: string;
    ssmlGender: string;
  };
  audioConfig: {
    audioEncoding: string;
    speakingRate?: number;
    pitch?: number;
  };
}

interface GoogleTTSResponse {
  audioContent: string; // Base64 encoded audio
}

// Language mappings for Google TTS
const LANGUAGE_MAPPINGS: Record<string, { languageCode: string; voiceName: string }> = {
  'es': { languageCode: 'es-ES', voiceName: 'es-ES-Standard-A' },
  'fr': { languageCode: 'fr-FR', voiceName: 'fr-FR-Standard-A' },
  'de': { languageCode: 'de-DE', voiceName: 'de-DE-Standard-A' },
  'it': { languageCode: 'it-IT', voiceName: 'it-IT-Standard-A' },
  'pt': { languageCode: 'pt-BR', voiceName: 'pt-BR-Standard-A' },
  'ja': { languageCode: 'ja-JP', voiceName: 'ja-JP-Standard-A' },
  'ko': { languageCode: 'ko-KR', voiceName: 'ko-KR-Standard-A' },
  'zh': { languageCode: 'zh-CN', voiceName: 'zh-CN-Standard-A' },
  'en': { languageCode: 'en-US', voiceName: 'en-US-Standard-A' }
};

export const synthesizeSpeech = async (text: string, options: Partial<TTSOptions> = {}): Promise<string | null> => {
  if (!GOOGLE_TTS_API_KEY) {
    console.warn("GOOGLE_TTS_API_KEY not configured. Cannot synthesize speech.");
    return null;
  }

  const fullOptions: TTSOptions = {
    text,
    languageCode: options.languageCode || 'en-US',
    voiceName: options.voiceName,
    ssmlGender: options.ssmlGender || 'NEUTRAL',
    audioEncoding: options.audioEncoding || 'MP3',
    speakingRate: options.speakingRate || 1.0,
    pitch: options.pitch || 0.0
  };

  const requestBody: GoogleTTSRequest = {
    input: {
      text: fullOptions.text
    },
    voice: {
      languageCode: fullOptions.languageCode,
      ssmlGender: fullOptions.ssmlGender
    },
    audioConfig: {
      audioEncoding: fullOptions.audioEncoding,
      speakingRate: fullOptions.speakingRate,
      pitch: fullOptions.pitch
    }
  };

  if (fullOptions.voiceName) {
    requestBody.voice.name = fullOptions.voiceName;
  }

  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google TTS API error:", response.status, errorData);
      throw new Error(`Google TTS API request failed: ${response.statusText || response.status}`);
    }

    const data: GoogleTTSResponse = await response.json();
    return data.audioContent;
  } catch (error) {
    console.error("Failed to synthesize speech with Google TTS:", error);
    return null;
  }
};

// New function for multilingual TTS
export const synthesizeMultilingualSpeech = async (text: string): Promise<void> => {
  const parsedSegments = parseLangText(text);
  
  for (const segment of parsedSegments) {
    if (segment.type === 'lang') {
      // Get the appropriate language config
      const langConfig = LANGUAGE_MAPPINGS[segment.langCode] || LANGUAGE_MAPPINGS['en'];
      
      console.log(`🎵 TTS: Synthesizing "${segment.text}" with voice ${langConfig.voiceName}`);
      
      // Synthesize speech for this language segment with specific voice
      const audioContent = await synthesizeSpeech(segment.text, {
        languageCode: langConfig.languageCode,
        voiceName: langConfig.voiceName
      });
      
      if (audioContent) {
        // Play this segment and wait for it to complete
        await new Promise<void>((resolve, reject) => {
          playTTSAudio(audioContent, undefined, resolve).catch(reject);
        });
      }
    } else if (segment.type === 'plain') {
      // For plain text, use default English
      const englishConfig = LANGUAGE_MAPPINGS['en'];
      const audioContent = await synthesizeSpeech(segment.text, {
        languageCode: englishConfig.languageCode,
        voiceName: englishConfig.voiceName
      });
      
      if (audioContent) {
        await new Promise<void>((resolve, reject) => {
          playTTSAudio(audioContent, undefined, resolve).catch(reject);
        });
      }
    }
  }
};

export const playTTSAudio = async (audioContent: string, audioRef?: React.MutableRefObject<HTMLAudioElement | null>, onComplete?: () => void): Promise<void> => {
  try {
    // Convert base64 to blob
    const binaryString = atob(audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/mp3' });
    
    // Create audio URL and play
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    
    if (audioRef) {
      audioRef.current = audio;
    }
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (onComplete) onComplete();
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error("Failed to play TTS audio:", error);
    throw error;
  }
};
