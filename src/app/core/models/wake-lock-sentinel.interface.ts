export interface WakeLockSentinel {
  released: boolean;
  type: string;
  release(): Promise<void>;
  addEventListener(eventName: 'release', cb: () => void): void;
}
