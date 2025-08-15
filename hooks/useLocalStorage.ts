
import { useState, useEffect } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // This effect ensures that if the localStorage key changes for some reason externally,
  // or if the initial value logic needs to re-run, it's handled.
  // For most cases with a fixed key, this is more about robustness.
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error(`Error re-syncing localStorage key "${key}":`, error);
            setStoredValue(initialValue);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Rerun if key changes, initialValue is stable through closure capture

  return [storedValue, setValue];
}

export default useLocalStorage;
