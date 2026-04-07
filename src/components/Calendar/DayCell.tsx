'use client';

import { memo, useCallback } from 'react';
import { CalendarDay } from '@/types';

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isInPreview: boolean;
  isPreviewStart: boolean;
  isPreviewEnd: boolean;
  onClick: (date: Date) => void;
  onHover: (date: Date) => void;
}

function DayCellComponent({
  day,
  isStart,
  isEnd,
  isInRange,
  isInPreview,
  isPreviewStart,
  isPreviewEnd,
  onClick,
  onHover,
}: DayCellProps) {
  const handleClick = useCallback(() => {
    if (day.isCurrentMonth) onClick(day.date);
  }, [day.date, day.isCurrentMonth, onClick]);

  const handleMouseEnter = useCallback(() => {
    if (day.isCurrentMonth) onHover(day.date);
  }, [day.date, day.isCurrentMonth, onHover]);

  // Build CSS classes
  const classes: string[] = ['day-cell'];
  if (!day.isCurrentMonth) classes.push('other-month');
  if (day.isToday) classes.push('today');
  if (isStart) classes.push('range-start');
  if (isEnd) classes.push('range-end');
  if (isInRange) classes.push('in-range');
  if (isInPreview && !isStart && !isEnd) classes.push('in-preview');
  if (isPreviewStart && !isStart) classes.push('preview-start');
  if (isPreviewEnd && !isEnd) classes.push('preview-end');

  return (
    <div
      className={classes.join(' ')}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="gridcell"
      aria-selected={isStart || isEnd}
      aria-label={`${day.dayOfMonth}${day.isHoliday ? `, ${day.holidayName}` : ''}`}
      tabIndex={day.isCurrentMonth ? 0 : -1}
    >
      <span className="day-number">{day.dayOfMonth}</span>
      {day.isHoliday && day.isCurrentMonth && (
        <span className="holiday-dot">
          <span className="holiday-tooltip">{day.holidayName}</span>
        </span>
      )}
    </div>
  );
}

export const DayCell = memo(DayCellComponent);
