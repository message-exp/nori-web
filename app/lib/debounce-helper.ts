// Debounce helper for async functions
export function debouncePromise<T>(fn: (...args: any[]) => Promise<T>, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]): Promise<T> => {
    if (timer) {
      clearTimeout(timer);
    }

    return new Promise<T>((resolve) => {
      timer = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
  };
}
