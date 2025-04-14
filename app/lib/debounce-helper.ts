// Debounce helper for async functions
export function debouncePromise<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Args): Promise<T> => {
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
