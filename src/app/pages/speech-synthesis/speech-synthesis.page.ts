import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
} from '@angular/core';

@Component({
  selector: 'app-speech-synthesis',
  templateUrl: './speech-synthesis.page.html',
  styleUrls: ['./speech-synthesis.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechSynthesisPage {
  public readonly isSupported = ('speechSynthesis' in window);
  public errorMessage = '';
  public voices: SpeechSynthesisVoice[] = [];
  public selectedVoice?: SpeechSynthesisVoice;
  public pitch = 1;
  public rate = 1;
  public text = 'Hello!';

  constructor(private cdr: ChangeDetectorRef) {
    if (this.isSupported) {
      this.voices = window.speechSynthesis.getVoices();
      this.selectedVoice = this.voices.find((voice) => voice.default);
      this.cdr.markForCheck();
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
      utterance.voice = this.selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}
