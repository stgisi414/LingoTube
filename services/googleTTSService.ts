
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

export const synthesizeSpeech = async (text: string, options: Partial<TTSOptions> = {}): Promise<string | null> => {
  const fullOptions: TTSOptions = {
    text,
    languageCode: options.languageCode || 'en-US',
    voiceName: options.voiceName,
    ssmlGender: options.ssmlGender || 'NEUTRAL',
    audioEncoding: options.audioEncoding || 'MP3',
    speakingRate: options.speakingRate || 1.0,
    pitch: options.pitch || 0.0
  };
  if (!GOOGLE_TTS_API_KEY) {
    console.warn("GOOGLE_TTS_API_KEY not configured. Cannot synthesize speech.");
    return null;
  }

  // Parse the text to extract language information
  const parsedSegments = parseLangText(fullOptions.text);
  let textToSpeak = fullOptions.text;
  let languageCode = fullOptions.languageCode || 'en-US';

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
      ssmlGender: fullOptions.ssmlGender || 'NEUTRAL'
    },
    audioConfig: {
      audioEncoding: fullOptions.audioEncoding || 'MP3',
      speakingRate: fullOptions.speakingRate || 1.0,
      pitch: fullOptions.pitch || 0.0
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

/**
 * Plays multilingual TTS by parsing language segments and synthesizing each separately
 */
export const playMultilingualTTS = async (
  text: string, 
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>, 
  onComplete?: () => void,
  onProgress?: (segmentIndex: number, totalSegments: number, currentText: string) => void
): Promise<void> => {
  console.log(`🎵 MULTILINGUAL TTS: Starting multilingual playback`);
  console.log(`🎵 MULTILINGUAL TTS: Input text length: ${text.length}`);
  
  const { parseLangText } = await import('../components/ParsedText');
  const segments = parseLangText(text);
  
  console.log(`🎵 MULTILINGUAL TTS: Parsed ${segments.length} segments:`, 
    segments.map((seg, i) => ({
      index: i,
      type: seg.type,
      langCode: seg.type === 'lang' ? seg.langCode : 'plain',
      textLength: seg.text.length
    }))
  );

  if (segments.length === 0) {
    console.warn(`🎵 MULTILINGUAL TTS: No segments found, using fallback`);
    const audioContent = await synthesizeSpeech(text);
    if (audioContent) {
      await playTTSAudio(audioContent, audioRef, onComplete);
    } else if (onComplete) {
      onComplete();
    }
    return;
  }

  try {
    let currentAudio: HTMLAudioElement | null = null;
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`🎵 MULTILINGUAL TTS: Processing segment ${i + 1}/${segments.length}:`, {
        type: segment.type,
        langCode: segment.type === 'lang' ? segment.langCode : 'plain',
        text: segment.text.substring(0, 50) + '...'
      });
      
      if (onProgress) {
        onProgress(i, segments.length, segment.text);
      }

      // Determine language code for TTS
      let languageCode = 'en-US';
      if (segment.type === 'lang' && segment.langCode) {
        const langCode = segment.langCode;
        if (langCode === 'es') languageCode = 'es-ES';
        else if (langCode === 'fr') languageCode = 'fr-FR';
        else if (langCode === 'de') languageCode = 'de-DE';
        else if (langCode === 'it') languageCode = 'it-IT';
        else if (langCode === 'zh') languageCode = 'zh-CN';
        else if (langCode === 'ja') languageCode = 'ja-JP';
        else if (langCode === 'ko') languageCode = 'ko-KR';
        else languageCode = 'en-US';
      }

      console.log(`🎵 MULTILINGUAL TTS: Synthesizing with language: ${languageCode}`);
      
      const audioContent = await synthesizeSpeech(segment.text, { 
        languageCode,
        speakingRate: 0.9 // Slightly slower for multilingual content
      });
      
      if (audioContent) {
        await new Promise<void>((resolve, reject) => {
          const binaryString = atob(audioContent);
          const bytes = new Uint8Array(binaryString.length);
          for (let j = 0; j < binaryString.length; j++) {
            bytes[j] = binaryString.charCodeAt(j);
          }
          const blob = new Blob([bytes], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(blob);
          currentAudio = new Audio(audioUrl);
          
          if (audioRef && i === segments.length - 1) {
            audioRef.current = currentAudio;
          }
          
          currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log(`🎵 MULTILINGUAL TTS: Completed segment ${i + 1}/${segments.length}`);
            resolve();
          };
          
          currentAudio.onerror = (error) => {
            URL.revokeObjectURL(audioUrl);
            console.error(`🎵 MULTILINGUAL TTS: Error playing segment ${i + 1}:`, error);
            reject(error);
          };
          
          currentAudio.play().catch(reject);
        });
      } else {
        console.warn(`🎵 MULTILINGUAL TTS: Failed to synthesize segment ${i + 1}, skipping`);
      }
      
      // Small pause between segments
      if (i < segments.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`🎵 MULTILINGUAL TTS: Completed all ${segments.length} segments`);
    if (onComplete) onComplete();
    
  } catch (error) {
    console.error(`🎵 MULTILINGUAL TTS: Error during multilingual playback:`, error);
    if (onComplete) onComplete();
  }
};
