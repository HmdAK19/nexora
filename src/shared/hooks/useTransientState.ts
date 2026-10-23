import { useCallback, useEffect, useRef, useState } from 'react';

export function useTransientState<T>(initialValue: T, duration = 3500) {
  const [value, setValue] = useState(initialValue);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const showTemporarily = useCallback(
    (nextValue: T) => {
      if (timer.current) window.clearTimeout(timer.current);
      setValue(nextValue);
      timer.current = window.setTimeout(() => setValue(initialValue), duration);
    },
    [duration, initialValue]
  );

  return [value, showTemporarily] as const;
}
