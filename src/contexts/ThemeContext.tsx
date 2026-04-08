'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'emerald' | 'blue' | 'violet' | 'rose';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  color: ColorTheme;
  setTheme: (theme: ThemeMode) => void;
  setColor: (color: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [color, setColorState] = useState<ColorTheme>('emerald');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Load from local storage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('calendar-theme') as ThemeMode | null;
      if (savedTheme) setThemeState(savedTheme);

      const savedColor = localStorage.getItem('calendar-color') as ColorTheme | null;
      if (savedColor) setColorState(savedColor);
    } catch (e) {}
  }, []);

  // Sync Theme
  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (mode: 'light' | 'dark') => {
      setResolvedTheme(mode);
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Sync Color
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', color);
  }, [color]);

  // Wrappers to update localized state and local storage safely
  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('calendar-theme', t);
  };

  const setColor = (c: ColorTheme) => {
    setColorState(c);
    localStorage.setItem('calendar-color', c);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, color, setTheme, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

// Script to inject in the document head to avoid FOUC
export const ThemeScript = () => {
  const codeToRunOnClient = `
    (function() {
      try {
        var localTheme = localStorage.getItem('calendar-theme');
        var isDark = localTheme === 'dark' || (localTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
        var localColor = localStorage.getItem('calendar-color');
        if (localColor) {
          document.documentElement.setAttribute('data-theme', localColor);
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
};
