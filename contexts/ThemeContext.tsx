import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>(LOCAL_STORAGE_KEYS.THEME, 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    
    body.classList.remove('bg-gray-100', 'dark:bg-gray-900', 'bg-gray-900', 'dark:bg-gray-100');
    if (currentTheme === 'dark') {
      body.classList.add('bg-gray-900');
    } else {
      body.classList.add('bg-gray-100');
    }

  }, [theme]);
  
  useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
          if (theme === 'system') {
              // This will trigger the other useEffect to re-evaluate classes
              setTheme('system'); 
          }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
