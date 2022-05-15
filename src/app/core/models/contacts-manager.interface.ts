import { ContactResult } from './contact-result.interface';

export interface ContactsManager {
  select: (properties: string[], options: { multiple: boolean }) => Promise<ContactResult[]>;
  getProperties: () => Promise<string[]>;
}
