export interface ISpeechRecognition {
  grammars: ISpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult(event: SpeechRecognitionEvent): void;
  onerror(event: Event): void;
  onnomatch(event: Event): void;
}

export interface ISpeechGrammarList {
  addFromString(value: string, weight?: number): void;
}

export interface SpeechRecognitionEvent extends Event {
  emma: string;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  [key: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [key: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
