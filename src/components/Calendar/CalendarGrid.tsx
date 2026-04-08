'use client';

import { useState } from 'react';
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
  onNavigate?: (direction: 'prev' | 'next') => void;
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
  onNavigate,
}: CalendarGridProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd || !onNavigate) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      onNavigate('next');
    }
    if (isRightSwipe) {
      onNavigate('prev');
    }
  };

  return (
    <div 
      className="px-3 pb-4 sm:px-5 sm:pb-5 outline-none select-none"
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
    >
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
