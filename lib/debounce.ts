function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): [(...args: Parameters<T>) => void, () => void] {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const clear = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const debouncedFunc = (...args: Parameters<T>) => {
    clear();

    timeoutId = setTimeout(() => {
      func(...args);
      clear();
    }, delay);
  };

  return [debouncedFunc, clear];
}
