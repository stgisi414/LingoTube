
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

export const synthesizeSpeech = async (options: TTSOptions): Promise<string | null> => {
  if (!GOOGLE_TTS_API_KEY) {
    console.warn("GOOGLE_TTS_API_KEY not configured. Cannot synthesize speech.");
    return null;
  }

  // Parse the text to extract language information
  const parsedSegments = parseLangText(options.text);
  let textToSpeak = options.text;
  let languageCode = options.languageCode || 'en-US';

  // Use the first language segment if available
  if (parsedSegments.length > 0) {
    const firstLangSegment = parsedSegments.find(seg => seg.type === 'lang');
    if (firstLangSegment && firstLangSegment.type === 'lang') {
      textToSpeak = parsedSegments.map(seg => seg.text).join(' ');
      // Convert language code to Google TTS format if needed
      const langCode = firstLangSegment.langCode;
      if (langCode === 'es') languageCode = 'es-ES';
      else if (langCode === 'fr') languageCode = 'fr-FR';
      else if (langCode === 'de') languageCode = 'de-DE';
      else if (langCode === 'it') languageCode = 'it-IT';
      else if (langCode === 'pt') languageCode = 'pt-BR';
      else if (langCode === 'ja') languageCode = 'ja-JP';
      else if (langCode === 'ko') languageCode = 'ko-KR';
      else if (langCode === 'zh') languageCode = 'zh-CN';
      else if (langCode.length === 2) languageCode = `${langCode}-US`;
      else languageCode = langCode;
    }
  }

  const requestBody: GoogleTTSRequest = {
    input: {
      text: textToSpeak
    },
    voice: {
      languageCode: languageCode,
      ssmlGender: options.ssmlGender || 'NEUTRAL'
    },
    audioConfig: {
      audioEncoding: options.audioEncoding || 'MP3',
      speakingRate: options.speakingRate || 1.0,
      pitch: options.pitch || 0.0
    }
  };

  if (options.voiceName) {
    requestBody.voice.name = options.voiceName;
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

export const playTTSAudio = async (audioContent: string): Promise<void> => {
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
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
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
