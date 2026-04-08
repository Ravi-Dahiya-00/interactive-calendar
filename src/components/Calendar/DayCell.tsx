// Represents a single day square in the calendar grid. Handles hover, selection highlight, holidays, and drag events.
'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { CalendarDay, Note } from '@/types';
import { isFutureDate, isPastDate, isTodayDate } from '@/utils/dateUtils';

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isInPreview: boolean;
  isPreviewStart: boolean;
  isPreviewEnd: boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  dayNotes: Note[];
  draggingNoteId: string | null;
  isDropTarget: boolean;
  onEventDragStart: (noteId: string) => void;
  onEventDragEnd: () => void;
  onCellDragOver: (date: Date, isCurrentMonth: boolean, e: React.DragEvent) => void;
  onCellDragLeave: (date: Date) => void;
  onCellDrop: (date: Date, isCurrentMonth: boolean, e: React.DragEvent) => void;
  onEventMoveByDays: (noteId: string, deltaDays: number) => void;
}

function DayCellComponent({
  day,
  isStart,
  isEnd,
  isInRange,
  isInPreview,
  isPreviewStart,
  isPreviewEnd,
  onMouseDown,
  onMouseEnter,
  dayNotes,
  draggingNoteId,
  isDropTarget,
  onEventDragStart,
  onEventDragEnd,
  onCellDragOver,
  onCellDragLeave,
  onCellDrop,
  onEventMoveByDays,
}: DayCellProps) {
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (day.isCurrentMonth) {
      // Prevent default to avoid text selection during drag
      e.preventDefault();
      onMouseDown(day.date);
    }
  }, [day.date, day.isCurrentMonth, onMouseDown]);

  const handleMouseEnter = useCallback(() => {
    if (day.isCurrentMonth) onMouseEnter(day.date);
  }, [day.date, day.isCurrentMonth, onMouseEnter]);

  const handleCellDragOver = useCallback((e: React.DragEvent) => {
    onCellDragOver(day.date, day.isCurrentMonth, e);
  }, [day.date, day.isCurrentMonth, onCellDragOver]);

  const handleCellDrop = useCallback((e: React.DragEvent) => {
    onCellDrop(day.date, day.isCurrentMonth, e);
  }, [day.date, day.isCurrentMonth, onCellDrop]);

  const handleCellDragLeave = useCallback(() => {
    onCellDragLeave(day.date);
  }, [day.date, onCellDragLeave]);

  const handleEventKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, noteId: string) => {
      if (!e.altKey) return;

      let deltaDays = 0;
      if (e.key === 'ArrowLeft') deltaDays = -1;
      if (e.key === 'ArrowRight') deltaDays = 1;
      if (e.key === 'ArrowUp') deltaDays = -7;
      if (e.key === 'ArrowDown') deltaDays = 7;
      if (!deltaDays) return;

      e.preventDefault();
      onEventMoveByDays(noteId, deltaDays);
    },
    [onEventMoveByDays]
  );

  const isSelected = isStart || isEnd || isInRange;
  const isToday = useMemo(() => isTodayDate(day.date), [day.date]);
  const isPast = useMemo(
    () => day.isCurrentMonth && isPastDate(day.date) && !isToday,
    [day.date, day.isCurrentMonth, isToday]
  );
  const isFuture = useMemo(
    () => day.isCurrentMonth && isFutureDate(day.date),
    [day.date, day.isCurrentMonth]
  );

  // Visual priority: Selected range > Today > Normal > Past
  const containerClasses = useMemo(() => {
    const classes = [
      'relative w-full min-h-[58px] flex items-start justify-center pt-1.5 text-sm transition-all duration-300 cursor-pointer select-none rounded-md overflow-hidden',
      !day.isCurrentMonth
        ? 'text-cal-muted opacity-20 cursor-default'
        : 'text-cal-text hover:bg-cal-primary/10',
    ];

    const isSelectedRange = isStart || isEnd || isInRange;
    const isUnderPreview = isPreviewStart || isPreviewEnd || isInPreview;

    if (isSelectedRange) {
      classes.push('bg-cal-primary/20 text-cal-primary-dark font-bold');
      if (isStart) classes.push('rounded-l-xl bg-gradient-to-r from-cal-primary to-cal-primary/20 text-white shadow-md z-20 scale-105');
      if (isEnd) classes.push('rounded-r-xl bg-gradient-to-l from-cal-primary to-cal-primary/20 text-white shadow-md z-20 scale-105');
      if (isStart && isEnd) classes.push('rounded-xl bg-cal-primary shadow-xl scale-110');
    } else if (isUnderPreview) {
      classes.push('bg-amber-100/50 border-y-2 border-dashed border-amber-400/30 text-amber-700');
      if (isPreviewStart) classes.push('rounded-l-xl border-l-2');
      if (isPreviewEnd) classes.push('rounded-r-xl border-r-2');
    } else if (isToday && day.isCurrentMonth) {
      classes.push('ring-2 ring-cal-primary/50 bg-cal-primary-50 rounded-xl font-extrabold text-cal-primary');
    } else if (isPast) {
      classes.push('opacity-40 grayscale-[0.5]');
    }

    if (isDropTarget && day.isCurrentMonth) {
      classes.push('ring-4 ring-cal-accent ring-opacity-50 scale-105 shadow-2xl z-30 bg-cal-accent/10');
    }
    
    return classes.join(' ');
  }, [
    day.isCurrentMonth,
    isDropTarget,
    isEnd,
    isFuture,
    isInPreview,
    isPast,
    isPreviewEnd,
    isPreviewStart,
    isSelected,
    isStart,
    isToday,
  ]);

  return (
    <div
      className={containerClasses}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onDragOver={handleCellDragOver}
      onDragLeave={handleCellDragLeave}
      onDrop={handleCellDrop}
      aria-label={`${day.dayOfMonth}${day.isHoliday ? `, ${day.holidayName}` : ''}`}
      tabIndex={day.isCurrentMonth ? 0 : -1}
    >
      <span className="relative z-10 font-semibold">{day.dayOfMonth}</span>
      {isToday && day.isCurrentMonth && !isSelected ? (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-cal-primary" />
      ) : null}
      {dayNotes.length > 0 && day.isCurrentMonth ? (
        <div className="absolute bottom-1 left-1 right-1 z-20 flex items-center gap-1">
          {(() => {
            const first = dayNotes[0];
            const isDragging = draggingNoteId === first.id;
            return (
              <button
                key={first.id}
                draggable
                onDragStart={() => onEventDragStart(first.id)}
                onDragEnd={onEventDragEnd}
                onKeyDown={(e) => handleEventKeyDown(e, first.id)}
                onFocus={() => setFocusedEventId(first.id)}
                onBlur={() => setFocusedEventId((prev) => (prev === first.id ? null : prev))}
                className={`flex-1 truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium text-left border transition-all ${
                  isDragging
                    ? 'opacity-50 shadow-none'
                    : 'opacity-95 shadow-sm hover:shadow'
                } bg-cal-card/95 border-cal-border text-cal-text`}
                title={first.content}
                aria-label={`Event ${first.content}. Drag to move, or press Alt plus arrow keys to move by day or week.`}
              >
                {first.content}
              </button>
            );
          })()}
          {dayNotes.length > 1 ? (
            <span className="shrink-0 rounded-md bg-cal-primary/10 text-cal-primary border border-cal-primary/20 px-1.5 py-0.5 text-[9px] font-bold">
              +{dayNotes.length - 1}
            </span>
          ) : null}
          {focusedEventId ? (
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cal-border bg-cal-card px-2 py-1 text-[10px] font-medium text-cal-muted shadow-sm">
              Alt + Arrow to move
            </span>
          ) : null}
        </div>
      ) : null}
      {day.isHoliday && day.isCurrentMonth && !isStart && !isEnd && (
        <span className="absolute bottom-1 w-1 h-1 bg-cal-holiday rounded-full" />
      )}
    </div>
  );
}

export const DayCell = memo(DayCellComponent);
