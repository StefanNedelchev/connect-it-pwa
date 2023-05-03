import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  selector: 'app-media-session',
  templateUrl: './media-session.page.html',
  styleUrls: ['./media-session.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSessionPage implements AfterViewInit, OnDestroy {
  @ViewChild('audio') audioElRef!: ElementRef;

  public isSupported = ('mediaSession' in navigator);
  public currentTrackIndex = 0;
  public tracks: { src: string; metadata: MediaMetadataInit }[] = [
    {
      src: 'assets/audio/Phase Control - Galactic Rave.m4a',
      metadata: {
        title: 'Galactic Rave',
        artist: 'Phase Control',
        album: 'Galactic Rave',
        artwork: [
          { src: 'assets/images/galactic_rave_cover-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: 'assets/images/galactic_rave_cover-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      },
    },
    {
      src: 'assets/audio/Phase Control - Alien World.m4a',
      metadata: {
        title: 'Alien world',
        artist: 'Phase Control',
        album: 'Deepmission 3',
        artwork: [
          { src: 'assets/images/alien_world_cover-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: 'assets/images/alien_world_cover-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      },
    },
    {
      src: 'assets/audio/Phase Control - Space Explorers.m4a',
      metadata: {
        title: 'Space Explorers',
        artist: 'Phase Control',
        album: 'Space Explorers',
        artwork: [
          { src: 'assets/images/space_explorers_cover-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: 'assets/images/space_explorers_cover-192x192.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      },
    },
  ];

  ngAfterViewInit(): void {
    if (!this.isSupported) {
      return;
    }

    const audioEl = this.audioElRef.nativeElement as HTMLAudioElement;

    this.setTrack();

    audioEl.addEventListener('pause', () => {
      navigator.mediaSession.playbackState = 'paused';
    });

    audioEl.addEventListener('play', () => {
      navigator.mediaSession.playbackState = 'playing';
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audioEl.pause();
      navigator.mediaSession.playbackState = 'paused';
    });

    navigator.mediaSession.setActionHandler('play', () => {
      audioEl.play();
      navigator.mediaSession.playbackState = 'playing';
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      audioEl.currentTime -= (details.seekOffset || 10);
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      audioEl.currentTime += (details.seekOffset || 10);
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number') {
        audioEl.currentTime = details.seekTime;
      }
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.currentTrackIndex = Math.max(0, this.currentTrackIndex - 1);
      this.setTrack();
      audioEl.play();
      navigator.mediaSession.playbackState = 'playing';
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.currentTrackIndex = Math.min(2, this.currentTrackIndex + 1);
      this.setTrack();
      audioEl.play();
      navigator.mediaSession.playbackState = 'playing';
    });
  }

  ngOnDestroy(): void {
    const audioEl = this.audioElRef.nativeElement as HTMLAudioElement;
    audioEl.pause();
    audioEl.remove();
    navigator.mediaSession.setActionHandler('play', null);
    navigator.mediaSession.setActionHandler('pause', null);
    navigator.mediaSession.setActionHandler('seekbackward', null);
    navigator.mediaSession.setActionHandler('seekforward', null);
    navigator.mediaSession.setActionHandler('seekto', null);
    navigator.mediaSession.setActionHandler('previoustrack', null);
    navigator.mediaSession.setActionHandler('nexttrack', null);
    navigator.mediaSession.metadata = null;
  }

  private setTrack(): void {
    const audioEl = this.audioElRef.nativeElement as HTMLAudioElement;

    audioEl.src = this.tracks[this.currentTrackIndex].src;
    navigator.mediaSession.metadata = new MediaMetadata(this.tracks[this.currentTrackIndex].metadata);
    navigator.mediaSession.setPositionState({
      duration: audioEl.duration || 0,
      playbackRate: audioEl.playbackRate || 1,
      position: 0,
    });
  }
}
