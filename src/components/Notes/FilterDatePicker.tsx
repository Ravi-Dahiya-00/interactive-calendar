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
  
  // Use isoStringToDate for consistent local timezone handling
  const initialDate = value ? isoStringToDate(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

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
    onChange(dateToISOString(date));
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

  const displayFormat = value ? (() => {
    const d = isoStringToDate(value);
    return `${d.getDate()} gap ${MONTH_NAMES[d.getMonth()].substring(0, 3)} ${d.getFullYear()}`.replace(' gap ', ' ');
  })() : placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 min-h-[44px] text-sm rounded-lg border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus:bg-black/40 focus:border-cal-primary focus:ring-1 focus:ring-cal-primary outline-none transition-all text-left"
      >
        <span>{displayFormat}</span>
        <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay Background */}
          <div className="fixed inset-0 bg-black/50 z-[100] sm:hidden" onClick={() => setIsOpen(false)} />

          <div className={`fixed sm:absolute inset-x-4 bottom-1/2 translate-y-1/2 sm:translate-y-0 sm:bottom-auto sm:top-12 sm:inset-x-auto ${align === 'right' ? 'sm:right-0 sm:origin-top-right' : 'sm:left-0 sm:origin-top-left'} sm:w-64 bg-[#1e293b] border border-white/10 shadow-2xl rounded-2xl z-[101] p-4 animate-fade-in sm:animate-none text-white`}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={(e) => { e.preventDefault(); navigateMonth(-1); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-bold">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button onClick={(e) => { e.preventDefault(); navigateMonth(1); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
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
