// Debounce helper for async functions
export function debouncePromise<T>(fn: (...args: any[]) => Promise<T>, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  let pendingPromise: Promise<T>;
  let resolvePromise: (value: T) => void;

  return (...args: any[]): Promise<T> => {
    if (timer) {
      clearTimeout(timer);
    }

    pendingPromise = new Promise<T>((resolve) => {
      resolvePromise = resolve;
    });

    timer = setTimeout(async () => {
      const result = await fn(...args);
      resolvePromise(result);
    }, delay);

    return pendingPromise;
  };
}
