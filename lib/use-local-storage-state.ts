"use client";

import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored) as T);
      }
    } finally {
      setLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, loaded, value]);

  function reset() {
    window.localStorage.removeItem(key);
    setValue(initialValue);
  }

  return [value, setValue, reset] as const;
}
