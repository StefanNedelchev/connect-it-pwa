import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [FormsModule, IonicModule],
  selector: 'app-speech-synthesis',
  templateUrl: './speech-synthesis.page.html',
  styleUrls: ['./speech-synthesis.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechSynthesisPage implements OnInit, OnDestroy {
  public readonly isSupported = ('speechSynthesis' in window);
  public errorMessage = '';
  public voices: SpeechSynthesisVoice[] = [];
  public voicesTimer?: number;
  public selectedVoice?: string;
  public pitch = 1;
  public rate = 1;
  public text = 'Hello!';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.isSupported) {
      this.getVoices()
        .then((voices) => {
          this.voices = voices;
          this.selectedVoice = this.voices.find((voice) => voice.default)?.name;
          this.cdr.markForCheck();
        })
        .catch((error: Error) => {
          this.errorMessage = error.message;
          this.cdr.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.voicesTimer) {
      clearInterval(this.voicesTimer);
    }
  }

  public pinFormatter(value: number): string | number {
    return value.toFixed(2);
  }

  public speak(): void {
    const utterance = new SpeechSynthesisUtterance(this.text);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    if (this.selectedVoice) {
      const voice = this.voices.find(({ name }) => name === this.selectedVoice);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
        (utterance as (SpeechSynthesisUtterance & { voiceURI: string })).voiceURI = voice.voiceURI;
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  private getVoices(): Promise<SpeechSynthesisVoice[]> {
    let interval: number | undefined;
    let retryCount = 0;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        const voices = window.speechSynthesis.getVoices();

        if (voices.length > 1) {
          clearInterval(interval);
          resolve(voices);
        } else if (retryCount >= 5) {
          clearInterval(interval);
          reject(new Error('No voices were found!'));
        } else {
          retryCount += 1;
        }
      }, 500, null);
    });
  }
}
