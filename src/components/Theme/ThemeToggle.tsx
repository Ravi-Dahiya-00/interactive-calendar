// A simple icon button to toggle between light and dark mode.
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    // If user is on system mode, first toggle sets an explicit preference.
    if (theme === 'system') {
      setTheme(isDark ? 'light' : 'dark');
      return;
    }
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={toggleTheme}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cal-border bg-cal-card text-cal-muted shadow-sm transition-colors hover:bg-cal-bg hover:text-cal-primary focus:outline-none focus:ring-2 focus:ring-cal-primary focus:ring-offset-1 dark:focus:ring-offset-cal-bg"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {theme === 'system' ? (
        <span className="pointer-events-none absolute -bottom-1.5 -right-2 rounded-full border border-cal-border bg-cal-card px-1.5 py-0.5 text-[10px] font-semibold leading-none text-cal-muted shadow-sm">
          System
        </span>
      ) : null}
    </div>
  );
}
