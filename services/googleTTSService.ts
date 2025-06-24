import { GOOGLE_TTS_API_KEY } from '../constants';

// Language-specific voice configurations
const VOICE_CONFIG = {
  'en': { languageCode: 'en-US', voiceName: 'en-US-Neural2-A' },
  'es': { languageCode: 'es-ES', voiceName: 'es-ES-Neural2-A' },
  'fr': { languageCode: 'fr-FR', voiceName: 'fr-FR-Neural2-A' },
  'de': { languageCode: 'de-DE', voiceName: 'de-DE-Neural2-A' },
  'it': { languageCode: 'it-IT', voiceName: 'it-IT-Neural2-A' },
  'zh': { languageCode: 'zh-CN', voiceName: 'zh-CN-Neural2-A' },
  'ja': { languageCode: 'ja-JP', voiceName: 'ja-JP-Neural2-A' },
  'ko': { languageCode: 'ko-KR', voiceName: 'ko-KR-Neural2-A' }
};

interface LanguageSegment {
  text: string;
  langCode: string;
}

// Global speech controller
class SpeechManager {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private audioQueue: string[] = [];
  private currentIndex = 0;

  async playSequence(audioContents: string[]): Promise<void> {
    this.stop(); // Stop any existing playback
    this.audioQueue = audioContents;
    this.currentIndex = 0;
    this.isPlaying = true;

    await this.playNext();
  }

  private async playNext(): Promise<void> {
    if (this.currentIndex >= this.audioQueue.length || !this.isPlaying) {
      this.isPlaying = false;
      return;
    }

    const audioContent = this.audioQueue[this.currentIndex];
    const audioBlob = this.base64ToBlob(audioContent);
    const audioUrl = URL.createObjectURL(audioBlob);

    this.currentAudio = new Audio(audioUrl);

    return new Promise((resolve, reject) => {
      if (!this.currentAudio) return reject(new Error('Audio creation failed'));

      this.currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentIndex++;
        this.playNext().then(resolve).catch(reject);
      };

      this.currentAudio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Audio playback failed'));
      };

      this.currentAudio.play().catch(reject);
    });
  }

  stop(): void {
    this.isPlaying = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.audioQueue = [];
    this.currentIndex = 0;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'audio/mp3' });
  }
}

const speechManager = new SpeechManager();

/**
 * Parse text with language tags into segments
 */
function parseLanguageSegments(text: string): LanguageSegment[] {
  // Remove content in parentheses first
  const cleanText = text.replace(/\([^)]*\)/g, '');

  const segments: LanguageSegment[] = [];
  const langTagRegex = /<lang:(\w+)>(.*?)<\/lang:\1>/g;
  let lastIndex = 0;
  let match;

  while ((match = langTagRegex.exec(cleanText)) !== null) {
    // Add any English text before this tag
    if (match.index > lastIndex) {
      const englishText = cleanText.slice(lastIndex, match.index).trim();
      if (englishText) {
        segments.push({ text: englishText, langCode: 'en' });
      }
    }

    // Add the foreign language segment
    const langCode = match[1];
    const langText = match[2].trim();
    if (langText) {
      segments.push({ text: langText, langCode });
    }

    lastIndex = langTagRegex.lastIndex;
  }

  // Add any remaining English text
  if (lastIndex < cleanText.length) {
    const remainingText = cleanText.slice(lastIndex).trim();
    if (remainingText) {
      segments.push({ text: remainingText, langCode: 'en' });
    }
  }

  return segments;
}

/**
 * Synthesize speech for a single segment
 */
async function synthesizeSegment(text: string, langCode: string): Promise<string | null> {
  if (!GOOGLE_TTS_API_KEY) {
    console.error('Google TTS API key not configured');
    return null;
  }

  const voiceConfig = VOICE_CONFIG[langCode as keyof typeof VOICE_CONFIG] || VOICE_CONFIG.en;

  console.log(`🎵 Synthesizing "${text}" with voice ${voiceConfig.voiceName}`);

  const requestBody = {
    input: { text },
    voice: {
      languageCode: voiceConfig.languageCode,
      name: voiceConfig.voiceName,
      ssmlGender: 'NEUTRAL'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0.0
    }
  };

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    return data.audioContent;
  } catch (error) {
    console.error(`TTS synthesis failed for "${text}":`, error);
    return null;
  }
}

/**
 * Main function to speak multilingual text
 */
export async function speakMultilingualText(text: string): Promise<void> {
  console.log(`🗣️ Starting multilingual TTS for: "${text.substring(0, 100)}..."`);

  const segments = parseLanguageSegments(text);
  console.log(`🗣️ Parsed into ${segments.length} segments:`, segments.map(s => ({
    langCode: s.langCode,
    text: s.text.substring(0, 30) + '...'
  })));

  if (segments.length === 0) return;

  const audioContents: string[] = [];

  for (const segment of segments) {
    const audioContent = await synthesizeSegment(segment.text, segment.langCode);
    if (audioContent) {
      audioContents.push(audioContent);
    }
  }

  if (audioContents.length > 0) {
    console.log(`🗣️ Playing ${audioContents.length} audio segments`);
    await speechManager.playSequence(audioContents);
  }
}

/**
 * Stop current speech
 */
export function stopSpeech(): void {
  speechManager.stop();
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  return speechManager.getIsPlaying();
}