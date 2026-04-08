// A small date picker used inside the filter panel to let users filter notes by a date range.
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { generateMonthGrid, MONTH_NAMES, dateToISOString, isSameDay, isoStringToDate } from '@/utils/dateUtils';

interface FilterDatePickerProps {
  value: string | null;
  onChange: (dateObj: string | null) => void;
  placeholder: string;
  align?: 'left' | 'right';
}

export function FilterDatePicker({ value, onChange, placeholder, align = 'left' }: FilterDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(value ?? '');
  const [showMonthYearJump, setShowMonthYearJump] = useState(false);
  
  // Use isoStringToDate for consistent local timezone handling
  const initialDate = value ? isoStringToDate(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDayClick = (date: Date) => {
    const iso = dateToISOString(date);
    onChange(iso);
    setInputValue(iso);
    setIsOpen(false);
  };

  const navigateMonth = (direction: -1 | 1) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthGrid = useMemo(() => {
    return generateMonthGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const parseInputDate = (raw: string): string | null => {
    const text = raw.trim();
    if (!text) return null;

    const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const slashPattern = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;

    let year: number;
    let month: number;
    let day: number;

    const isoMatch = text.match(isoPattern);
    if (isoMatch) {
      year = Number(isoMatch[1]);
      month = Number(isoMatch[2]);
      day = Number(isoMatch[3]);
    } else {
      const slashMatch = text.match(slashPattern);
      if (!slashMatch) return null;
      day = Number(slashMatch[1]);
      month = Number(slashMatch[2]);
      year = Number(slashMatch[3]);
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const next = new Date(year, month - 1, day);
    if (
      next.getFullYear() !== year ||
      next.getMonth() !== month - 1 ||
      next.getDate() !== day
    ) {
      return null;
    }
    return dateToISOString(next);
  };

  const formatInputAsDate = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const commitInputDate = () => {
    if (!inputValue.trim()) {
      onChange(null);
      return;
    }
    const parsed = parseInputDate(inputValue);
    if (!parsed) {
      setInputValue(value ?? '');
      return;
    }
    onChange(parsed);
    const parsedDate = isoStringToDate(parsed);
    setCurrentMonth(parsedDate.getMonth());
    setCurrentYear(parsedDate.getFullYear());
    setInputValue(parsed);
  };

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <div className="w-full min-w-0 flex items-center gap-2 px-2.5 py-1.5 min-h-[44px] text-sm rounded-lg border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-within:bg-black/40 focus-within:border-cal-primary focus-within:ring-1 focus-within:ring-cal-primary transition-all text-left">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(formatInputAsDate(e.target.value))}
          onBlur={commitInputDate}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitInputDate();
            }
          }}
          inputMode="numeric"
          maxLength={10}
          placeholder="DD/MM/YYYY"
          title={`${placeholder} (format: DD/MM/YYYY)`}
          className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder:text-white/50"
          aria-label={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Open date picker"
        >
          <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Mobile Overlay Background */}
          <div className="fixed inset-0 bg-black/50 z-[100] sm:hidden" onClick={() => setIsOpen(false)} />

          <div className={`fixed sm:absolute inset-x-4 bottom-1/2 translate-y-1/2 sm:translate-y-0 sm:bottom-auto sm:top-12 sm:inset-x-auto ${align === 'right' ? 'sm:right-0 sm:origin-top-right' : 'sm:left-0 sm:origin-top-left'} sm:w-72 bg-[#1e293b] border border-white/10 shadow-2xl rounded-2xl z-[101] p-4 animate-fade-in sm:animate-none text-white`}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={(e) => { e.preventDefault(); navigateMonth(-1); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Previous month" title="Previous month">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMonthYearJump((prev) => !prev);
              }}
              className="text-sm font-bold px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
              title="Jump to month and year"
            >
              {MONTH_NAMES[currentMonth]} {currentYear}
            </button>
            <button onClick={(e) => { e.preventDefault(); navigateMonth(1); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Next month" title="Next month">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {showMonthYearJump && (
            <div className="mb-3 rounded-lg border border-white/10 bg-white/5 p-2.5 space-y-2.5">
              <div className="grid grid-cols-3 gap-1.5">
                {MONTH_NAMES.map((month, idx) => (
                  <button
                    key={month}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentMonth(idx);
                    }}
                    className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                      currentMonth === idx
                        ? 'bg-cal-primary text-white'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                    title={month}
                    aria-label={`Select ${month}`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentYear((y) => Math.max(1900, y - 1));
                  }}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  aria-label="Previous year"
                  title="Previous year"
                >
                  -1y
                </button>
                <input
                  type="number"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value) || new Date().getFullYear())}
                  aria-label="Enter year"
                  title="Enter year"
                  className="w-full rounded-md bg-black/30 border border-white/10 px-2 py-1 text-xs text-white outline-none"
                  min={1900}
                  max={2100}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentYear((y) => Math.min(2100, y + 1));
                  }}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  aria-label="Next year"
                  title="Next year"
                >
                  +1y
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <span key={day} className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{day}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.flat().map((day, idx) => {
              const isSelected = value && isSameDay(day.date, isoStringToDate(value));
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); handleDayClick(day.date); }}
                  className={`
                    flex items-center justify-center w-full aspect-square text-xs font-medium rounded-full mt-0.5 transition-all duration-200
                    ${!day.isCurrentMonth ? 'text-white/20 hover:text-white/40' : 'text-white/90 hover:bg-white/10'}
                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm' : ''}
                    ${day.isToday && !isSelected ? 'border border-blue-400/50 text-blue-400' : ''}
                  `}
                >
                  {day.dayOfMonth}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <button onClick={(e) => { e.preventDefault(); onChange(null); setIsOpen(false); }} className="text-xs font-medium text-white/50 hover:text-white transition-colors px-2 py-1 rounded">Clear</button>
            <button onClick={(e) => { e.preventDefault(); handleDayClick(new Date()); }} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded">Today</button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
