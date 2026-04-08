// A settings panel that lets users pick a color theme, toggle dark/light mode, and turn seasonal effects on or off.
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode, ColorTheme } from '@/contexts/ThemeContext';

export function ThemeCustomizer() {
  const { theme, resolvedTheme, color, ambientEffects, setTheme, setColor, setAmbientEffects } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const colors: { name: string; value: ColorTheme; bgClass: string }[] = [
    { name: 'Emerald', value: 'emerald', bgClass: 'bg-emerald-600' },
    { name: 'Blue', value: 'blue', bgClass: 'bg-blue-600' },
    { name: 'Violet', value: 'violet', bgClass: 'bg-violet-600' },
    { name: 'Rose', value: 'rose', bgClass: 'bg-rose-600' },
  ];

  const modes: { name: string; value: ThemeMode; icon: React.ReactNode }[] = [
    {
      name: 'Light',
      value: 'light',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    {
      name: 'System',
      value: 'system',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-cal-muted hover:text-cal-primary hover:bg-cal-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-cal-primary focus:ring-offset-1 dark:focus:ring-offset-cal-bg"
        aria-label="Theme Settings"
        title="Theme Settings"
      >
        {resolvedTheme === 'dark' ? modes[1].icon : modes[0].icon}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-cal-card rounded-xl shadow-xl border border-cal-border py-4 px-4 z-[70] animate-fade-in flex flex-col gap-4">
          
          {/* Mode Switcher */}
          <div>
            <h3 className="text-xs font-semibold text-cal-muted uppercase tracking-wider mb-2">Appearance</h3>
            <div className="flex bg-cal-bg rounded-lg p-1">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setTheme(mode.value)}
                  className={`flex-1 flex justify-center py-1.5 rounded-md text-sm transition-colors ${
                    theme === mode.value 
                      ? 'bg-cal-card text-cal-primary shadow-sm font-semibold' 
                      : 'text-cal-muted hover:text-cal-text'
                  }`}
                  title={mode.name}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Switcher */}
          <div>
            <h3 className="text-xs font-semibold text-cal-muted uppercase tracking-wider mb-2">Color Theme</h3>
            <div className="flex gap-3 justify-between px-1">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.bgClass} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-cal-primary dark:ring-offset-cal-card scale-110' : ''
                  }`}
                  title={c.name}
                  aria-label={c.name}
                >
                  {color === c.value && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Ambient Effects Switcher */}
          <div>
            <h3 className="text-xs font-semibold text-cal-muted uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Ambient Effects</span>
            </h3>
            <button
              onClick={() => setAmbientEffects(!ambientEffects)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cal-primary focus:ring-offset-2 dark:focus:ring-offset-cal-card ${
                ambientEffects ? 'bg-cal-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={ambientEffects}
            >
              <span className="sr-only">Enable ambient effects</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ambientEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <p className="text-[10px] text-cal-muted mt-1 leading-snug">
              Seasonal rain, snow, and sunlight overlays. Disable for best performance.
            </p>
          </div>
          
        </div>
      )}
    </div>
  );
}
