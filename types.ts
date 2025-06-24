export enum SegmentType {
  NARRATION = 'narration',
  VIDEO = 'video',
}

export interface NarrationSegment {
  type: SegmentType.NARRATION;
  id: string;
  text: string;
}

export interface VideoSegment {
  type: SegmentType.VIDEO;
  id: string;
  title: string;
  youtubeVideoId?: string | null;
  youtubeSearchQuery: string;
  segmentDescription: string;
  estimatedStartSeconds?: number | null;
  estimatedEndSeconds?: number | null;
}

export type LessonSegment = NarrationSegment | VideoSegment;

export interface LessonPlan {
  topic: string;
  introNarration: string;
  segments: LessonSegment[];
  outroNarration: string;
}

// Moved AppStatus enum here for global availability
export enum AppStatus {
  IDLE = 'idle',
  RECOGNIZING_SPEECH = 'recognizingSpeech',
  PROCESSING_INPUT = 'processingInput',
  DISPLAYING_LESSON = 'displayingLesson',
  ERROR = 'error',
}


// --- Speech Recognition API Types ---
// Based on MDN and common usage for Web Speech API (webkitSpeechRecognition)

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  // readonly interpretation: any; // Deprecated or specific to certain implementations
  // readonly emma: Document | null; // Deprecated or specific to certain implementations
}

export interface SpeechRecognitionErrorEvent extends Event { // Changed from ErrorEvent for more specific typing if possible, fallback to Event
  readonly error: string; // SpeechRecognitionErrorCode (e.g., 'no-speech', 'audio-capture', 'not-allowed')
  readonly message: string; // Optional: a human-readable message
}

export interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

export interface SpeechRecognition extends EventTarget {
  grammars: any; // Actually SpeechGrammarList, but 'any' for simplicity if not deeply used
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string; // Optional

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}