const storageMemo: Record<string, string> = {};

export const Storage = {
  get: async (options: { key: string }): Promise<{ value: string }> => Promise.resolve({ value: storageMemo[options.key] }),
  set: async (options: { key: string; value: string }): Promise<void> => {
    storageMemo[options.key] = options.value;
    return Promise.resolve();
  },
  clear: async (): Promise<void> => {
    Object.keys(storageMemo).forEach((key) => delete storageMemo[key]);
    return Promise.resolve();
  },
  configure: (): Promise<void> => Promise.resolve(),
  keys: (): Promise<{ keys: string[] }> => Promise.resolve({ keys: Object.keys(storageMemo) }),
  migrate: (): Promise<{ existing: string[]; migrated: string[] }> => Promise.resolve({ existing: [], migrated: [] }),
  remove: (options: { key: string }): Promise<void> => {
    delete storageMemo[options.key];
    return Promise.resolve();
  },
  removeOld: (): Promise<void> => Promise.resolve(),
};
