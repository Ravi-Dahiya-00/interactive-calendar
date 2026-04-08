// Top bar of the calendar. Shows the current month and year, and has buttons to go back, forward, or jump to today.
'use client';

import { useState, useRef, useEffect } from 'react';
import { MONTH_IMAGES, MONTH_THEMES, MONTH_NAMES } from '@/utils/dateUtils';
import { NavigationDirection } from '@/types';

interface CalendarHeaderProps {
  monthName: string;
  currentMonth: number;
  currentYear: number;
  direction: NavigationDirection;
  onNavigate: (dir: NavigationDirection) => void;
  onGoToToday: () => void;
  onJumpToDate: (month: number, year: number) => void;
}

export function CalendarHeader({
  monthName,
  currentMonth,
  currentYear,
  direction,
  onNavigate,
  onGoToToday,
  onJumpToDate,
}: CalendarHeaderProps) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState('');
  
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
        setYearSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const theme = MONTH_THEMES[currentMonth];
  const imageSrc = MONTH_IMAGES[currentMonth];

  const isCurrentMonth =
    new Date().getMonth() === currentMonth &&
    new Date().getFullYear() === currentYear;

  const handleMonthSelect = (m: number) => {
    onJumpToDate(m, currentYear);
    setIsMonthOpen(false);
  };

  const handleYearSelect = (y: number) => {
    onJumpToDate(currentMonth, y);
    setIsYearOpen(false);
    setYearSearch('');
  };

  // Generate 200 years spread around current year (100 back, 100 forward)
  const baseYears = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);
  const years = yearSearch 
    ? baseYears.filter(y => y.toString().includes(yearSearch))
    : baseYears;

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
            className={`flex flex-col items-start ${
              direction === 'next'
                ? 'month-transition-enter'
                : 'month-transition-enter-reverse'
            }`}
          >
            {/* Year Selector */}
            <div className="relative" ref={yearRef}>
              <button 
                onClick={() => {
                  setIsYearOpen(!isYearOpen);
                  if (isYearOpen) setYearSearch('');
                }}
                className="text-sm font-medium tracking-widest uppercase opacity-80 mb-1 hover:opacity-100 transition-all flex items-center gap-1.5 outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-2 -ml-2 min-h-[44px]"
                aria-label="Select year"
              >
                {currentYear}
                <svg className={`w-3 h-3 transition-transform duration-200 ${isYearOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isYearOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-32 max-h-[260px] flex flex-col bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-[100] text-white">
                  <div className="p-2 border-b border-white/10">
                    <input 
                      type="text" 
                      value={yearSearch}
                      onChange={e => setYearSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1 text-xs text-white placeholder-white/50 outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto custom-scrollbar flex-1 py-1.5">
                    {years.length === 0 ? (
                      <p className="text-center text-xs text-white/50 py-2">No results</p>
                    ) : (
                      years.map(y => (
                        <button
                          key={y}
                          onClick={() => handleYearSelect(y)}
                          className={`w-full text-center px-4 py-2 text-sm transition-all ${y === currentYear ? 'bg-white/20 font-bold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                        >
                          {y}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Month Selector */}
            <div className="relative" ref={monthRef}>
              <button 
                onClick={() => setIsMonthOpen(!isMonthOpen)}
                className="group flex items-center gap-2.5 hover:opacity-90 transition-all outline-none focus:ring-2 focus:ring-white/30 rounded-xl px-2.5 py-2 -ml-2.5 min-h-[44px]"
                aria-label="Select month"
              >
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-wide"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {monthName}
                </h2>
                <svg className={`w-5 h-5 transition-all duration-200 ${isMonthOpen ? 'opacity-100 rotate-180' : 'opacity-50 group-hover:opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isMonthOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl z-[100] text-white p-2.5 w-max grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((mName, index) => (
                    <button
                      key={mName}
                      onClick={() => handleMonthSelect(index)}
                      className={`w-full text-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${index === currentMonth ? 'bg-white/20 text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                    >
                      {mName.substring(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {!isCurrentMonth && (
              <button
                onClick={onGoToToday}
                className="px-4 py-2 min-h-[44px] text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                aria-label="Go to today"
              >
                Today
              </button>
            )}
            <button
              onClick={() => onNavigate('prev')}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
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
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
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
