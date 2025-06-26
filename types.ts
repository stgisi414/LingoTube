export enum SegmentType {
  NARRATION = 'narration',
  VIDEO = 'video',
}

export interface NarrationSegment {
  type: SegmentType.NARRATION;
  id: string;
  text: string;
}

export interface VideoTimeSegment {
  startTime: number;
  endTime: number;
  reason: string;
}

export interface VideoSegment {
  type: SegmentType.VIDEO;
  id: string;
  title: string;
  youtubeVideoId?: string | null;
  youtubeSearchQuery: string;
  segmentDescription: string;
  // This will be populated by the pipeline
  videoSegments?: VideoTimeSegment[];
}

export type LessonSegment = NarrationSegment | VideoSegment;

export interface LessonPlan {
  topic: string;
  introNarration: string;
  segments: LessonSegment[];
  outroNarration: string;
}

export enum AppStatus {
  IDLE = 'idle',
  RECOGNIZING_SPEECH = 'recognizingSpeech',
  PROCESSING_INPUT = 'processingInput',
  DISPLAYING_LESSON = 'displayingLesson',
  ERROR = 'error',
}

export interface SentenceTemplate {
  id: string;
  template: string;
  blanks: { id: string; placeholder: string; options?: string[] }[];
  example: string;
}

// --- Speech Recognition API Types ---
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
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

export interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

export interface SpeechRecognition extends EventTarget {
  grammars: any;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string;

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