'use client';

import { MONTH_IMAGES, MONTH_THEMES } from '@/utils/dateUtils';
import { NavigationDirection } from '@/types';

interface CalendarHeaderProps {
  monthName: string;
  currentMonth: number;
  currentYear: number;
  direction: NavigationDirection;
  onNavigate: (dir: NavigationDirection) => void;
  onGoToToday: () => void;
}

export function CalendarHeader({
  monthName,
  currentMonth,
  currentYear,
  direction,
  onNavigate,
  onGoToToday,
}: CalendarHeaderProps) {
  const theme = MONTH_THEMES[currentMonth];
  const imageSrc = MONTH_IMAGES[currentMonth];

  const isCurrentMonth =
    new Date().getMonth() === currentMonth &&
    new Date().getFullYear() === currentYear;

  return (
    <div className="hero-section">
      {/* Hero Image */}
      <img
        key={`${currentMonth}-${currentYear}`}
        src={imageSrc}
        alt={`${monthName} scenery`}
        className={`hero-image ${
          direction === 'next'
            ? 'month-transition-enter'
            : 'month-transition-enter-reverse'
        }`}
      />

      {/* Gradient Overlay */}
      <div className="hero-overlay" />

      {/* Month-specific color tint */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{ background: theme.gradient }}
      />

      {/* Content */}
      <div className="hero-content">
        <div className="flex items-end justify-between">
          <div
            key={`${currentMonth}-${currentYear}-text`}
            className={
              direction === 'next'
                ? 'month-transition-enter'
                : 'month-transition-enter-reverse'
            }
          >
            <p className="text-sm font-medium tracking-widest uppercase opacity-80 mb-1">
              {currentYear}
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-wide"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {monthName}
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {!isCurrentMonth && (
              <button
                onClick={onGoToToday}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                aria-label="Go to today"
              >
                Today
              </button>
            )}
            <button
              onClick={() => onNavigate('prev')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              aria-label="Previous month"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              aria-label="Next month"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
