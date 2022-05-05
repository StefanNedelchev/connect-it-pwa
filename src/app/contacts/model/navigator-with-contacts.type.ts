import { ContactResult } from './contact-result.interface';

export type NavigatorWithContacts = Navigator & {
  contacts: {
    select: (properties: string[], options: { multiple: boolean }) => Promise<ContactResult[]>;
    getProperties: () => Promise<string[]>;
  };
};
