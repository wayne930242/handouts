const globalTimeouts: { [key: string]: ReturnType<typeof setTimeout> | null } =
  {};

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay?: number,
  key: string = "default"
): [(...args: Parameters<T>) => void, () => void] {
  const clear = () => {
    if (globalTimeouts[key] !== undefined && globalTimeouts[key] !== null) {
      clearTimeout(globalTimeouts[key] as ReturnType<typeof setTimeout>);
      globalTimeouts[key] = null;
    }
  };

  const debouncedFunc = (...args: Parameters<T>) => {
    clear();

    if (delay === undefined || delay <= 0) {
      func(...args);
    } else {
      globalTimeouts[key] = setTimeout(() => {
        func(...args);
        globalTimeouts[key] = null;
      }, delay);
    }
  };

  return [debouncedFunc, clear];
}

export default debounce;
