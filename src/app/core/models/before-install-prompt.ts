export type InstallPromptOutcome = 'accepted' | 'dismissed';

export type BeforeInstallPromptEvent = Event & {
  prompt(): void;
  userChoice: Promise<{ outcome: InstallPromptOutcome }>;
};
