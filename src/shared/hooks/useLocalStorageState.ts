import { useCallback, useEffect, useRef, useState } from 'react';

type SetStateAction<T> = T | ((current: T) => T);

const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
};

export function useLocalStorageState<T>(key: string, fallback: T) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState<T>(() => readStorage(key, fallbackRef.current));

  useEffect(() => {
    setValue(readStorage(key, fallbackRef.current));
  }, [key]);

  useEffect(() => {
    const syncValue = (event: StorageEvent) => {
      if (event.key === key) setValue(readStorage(key, fallbackRef.current));
    };

    window.addEventListener('storage', syncValue);
    return () => window.removeEventListener('storage', syncValue);
  }, [key]);

  const updateValue = useCallback(
    (action: SetStateAction<T>) => {
      setValue((current) => {
        const next = action instanceof Function ? action(current) : action;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  return [value, updateValue] as const;
}
