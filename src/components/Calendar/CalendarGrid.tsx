'use client';

import { CalendarDay } from '@/types';
import { DAY_NAMES } from '@/utils/dateUtils';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  monthGrid: CalendarDay[][];
  direction: 'prev' | 'next';
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  isInPreviewRange: (date: Date) => boolean;
  isPreviewStart: (date: Date) => boolean;
  isPreviewEnd: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onMouseLeave: () => void;
  animationKey: string;
}

export function CalendarGrid({
  monthGrid,
  direction,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isInPreviewRange,
  isPreviewStart,
  isPreviewEnd,
  onDayClick,
  onDayHover,
  onMouseLeave,
  animationKey,
}: CalendarGridProps) {
  return (
    <div className="px-3 pb-4 sm:px-5 sm:pb-5">
      {/* Weekday Headers */}
      <div className="day-grid">
        {DAY_NAMES.map((name) => (
          <div key={name} className="weekday-header">
            {name}
          </div>
        ))}
      </div>

      {/* Date Grid */}
      <div
        key={animationKey}
        className={`day-grid ${
          direction === 'next'
            ? 'month-transition-enter'
            : 'month-transition-enter-reverse'
        }`}
        role="grid"
        onMouseLeave={onMouseLeave}
      >
        {monthGrid.flat().map((day, index) => (
          <DayCell
            key={`${day.date.toISOString()}-${index}`}
            day={day}
            isStart={isRangeStart(day.date)}
            isEnd={isRangeEnd(day.date)}
            isInRange={isInRange(day.date)}
            isInPreview={isInPreviewRange(day.date)}
            isPreviewStart={isPreviewStart(day.date)}
            isPreviewEnd={isPreviewEnd(day.date)}
            onClick={onDayClick}
            onHover={onDayHover}
          />
        ))}
      </div>
    </div>
  );
}
