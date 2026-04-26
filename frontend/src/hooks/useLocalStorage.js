/**
 * hooks/useLocalStorage.js
 * Persists any state value in localStorage across page refreshes.
 */

import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value;
      setStoredValue(v);
      localStorage.setItem(key, JSON.stringify(v));
    } catch (err) {
      console.warn('useLocalStorage write failed:', err);
    }
  };

  return [storedValue, setValue];
}
