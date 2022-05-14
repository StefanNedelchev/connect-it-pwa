import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
} from '@angular/core';

@Component({
  selector: 'app-speech-synthesis',
  templateUrl: './speech-synthesis.page.html',
  styleUrls: ['./speech-synthesis.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechSynthesisPage implements OnInit {
  public readonly isSupported = ('speechSynthesis' in window);
  public errorMessage = '';
  public voices: SpeechSynthesisVoice[] = [];
  public selectedVoice?: string;
  public pitch = 1;
  public rate = 1;
  public text = 'Hello!';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.isSupported) {
      this.voices = window.speechSynthesis.getVoices();
      this.selectedVoice = this.voices.find((voice) => voice.default)?.name;
      this.cdr.detectChanges();
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
