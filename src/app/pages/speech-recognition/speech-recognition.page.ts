import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';

interface ISpeechRecognition {
  new (): typeof SpeechRecognition;
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

interface ISpeechGrammarList {
  new (): typeof SpeechGrammarList;
  addFromString(value: string, weight?: number): void;
}

interface SpeechRecognitionEvent extends Event {
  emma: string;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [key: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [key: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare const SpeechRecognition: ISpeechRecognition;
declare const webkitSpeechRecognition: ISpeechRecognition;
declare const SpeechGrammarList: ISpeechGrammarList;
declare const webkitSpeechGrammarList: ISpeechGrammarList;

@Component({
  selector: 'app-speech-recognition',
  templateUrl: './speech-recognition.page.html',
  styleUrls: ['./speech-recognition.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechRecognitionPage implements OnInit, OnDestroy {
  public readonly isSupported = ('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window);
  public errorMessage = '';
  public squareColor = 'red';
  public isListening = false;

  private readonly isWebkitPrefixed = ('webkitSpeechRecognition' in window);
  private readonly grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;';
  private recognition: ISpeechRecognition | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.isSupported) {
      this.recognition = new (this.isWebkitPrefixed ? webkitSpeechRecognition : SpeechRecognition)();

      const speechRecognitionList = new (this.isWebkitPrefixed ? webkitSpeechGrammarList : SpeechGrammarList)();
      speechRecognitionList.addFromString(this.grammar, 1);

      this.recognition.grammars = speechRecognitionList;
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.onresult = (event) => {
        this.isListening = false;
        const color = event.results[0][0].transcript;
        this.squareColor = color;
        this.cdr.markForCheck();
      };
      this.recognition.onnomatch = () => {
        this.isListening = false;
        this.cdr.markForCheck();
      };
      this.recognition.onerror = () => {
        this.isListening = false;
        this.cdr.markForCheck();
      };

      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.recognition = null;
    }
  }

  recognizeColor(): void {
    if (this.recognition) {
      this.recognition.start();
      this.isListening = true;
      this.cdr.markForCheck();
    }
  }
}
