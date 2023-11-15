export const getErrorMessage = (error: unknown): string => {
  if (error === null || error === undefined) {
    return '';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return error.toString();
};
