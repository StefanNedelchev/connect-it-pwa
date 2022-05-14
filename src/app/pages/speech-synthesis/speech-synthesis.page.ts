import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit,
} from '@angular/core';

@Component({
  selector: 'app-speech-synthesis',
  templateUrl: './speech-synthesis.page.html',
  styleUrls: ['./speech-synthesis.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechSynthesisPage implements OnInit, OnDestroy {
  public readonly isSupported = ('speechSynthesis' in window);
  public errorMessage = '';
  public voices: SpeechSynthesisVoice[] = [];
  public voicesTimer?: NodeJS.Timer;
  public selectedVoice?: string;
  public pitch = 1;
  public rate = 1;
  public text = 'Hello!';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.isSupported) {
      this.voicesTimer = setInterval(() => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 1) {
          this.voices = voices;
          this.selectedVoice = this.voices.find((voice) => voice.default)?.name;
          this.cdr.markForCheck();
          clearInterval(this.voicesTimer);
        }
      }, 300);
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
      }
    }

    window.speechSynthesis.speak(utterance);
  }
}
