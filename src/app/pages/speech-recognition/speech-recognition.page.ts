import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ISpeechGrammarList, ISpeechRecognition } from '../../core/models';

declare const SpeechRecognition: { new(): ISpeechRecognition };
declare const webkitSpeechRecognition: { new(): ISpeechRecognition };
declare const SpeechGrammarList: { new(): ISpeechGrammarList };
declare const webkitSpeechGrammarList: { new(): ISpeechGrammarList };

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
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
        this.cdr.detectChanges();
      };
      this.recognition.onnomatch = () => {
        this.isListening = false;
        this.cdr.detectChanges();
      };
      this.recognition.onerror = (event: Event & { error: string; message: string }) => {
        this.isListening = false;
        this.errorMessage = `Error: ${event.error}. ${event.message}`;
        this.cdr.detectChanges();
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
