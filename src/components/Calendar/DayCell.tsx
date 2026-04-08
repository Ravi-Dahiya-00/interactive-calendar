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
      'relative h-10 w-full flex items-center justify-center text-sm transition-all duration-200 cursor-pointer select-none rounded-md',
      !day.isCurrentMonth
        ? 'text-cal-muted opacity-30 cursor-default'
        : 'text-cal-text hover:bg-cal-border/50 hover:shadow-sm',
    ];

    if (isSelected) {
      classes.push('bg-cal-primary/15 text-cal-primary-dark font-semibold');
      if (isStart || isEnd) {
        classes.push('bg-cal-primary text-cal-bg font-bold shadow-md z-10');
        if (isStart) classes.push('rounded-l-lg');
        if (isEnd) classes.push('rounded-r-lg');
        if (isStart && isEnd) classes.push('rounded-lg');
      }
    } else if (isToday && day.isCurrentMonth) {
      classes.push('ring-2 ring-cal-primary/70 ring-inset bg-cal-primary/5 font-semibold');
    } else if (isPast) {
      classes.push('text-cal-muted/80 opacity-70');
    } else if (isFuture) {
      classes.push('text-cal-text');
    }

    if (isPreviewStart || isPreviewEnd || isInPreview) {
      classes.push('bg-cal-primary/5 border-y border-cal-primary/20');
      if (isPreviewStart) classes.push('rounded-l-lg border-l');
      if (isPreviewEnd) classes.push('rounded-r-lg border-r');
    }

    if (isDropTarget && day.isCurrentMonth) {
      classes.push('ring-2 ring-cal-primary/60 ring-inset shadow-lg');
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
      <span className="relative z-10">{day.dayOfMonth}</span>
      {isToday && day.isCurrentMonth && !isSelected ? (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-cal-primary" />
      ) : null}
      {dayNotes.length > 0 && day.isCurrentMonth ? (
        <div className="absolute bottom-0.5 left-0.5 right-0.5 z-20 flex flex-col gap-0.5">
          {dayNotes.slice(0, 2).map((note) => {
            const isDragging = draggingNoteId === note.id;
            const isFocused = focusedEventId === note.id;
            return (
              <button
                key={note.id}
                draggable
                onDragStart={() => onEventDragStart(note.id)}
                onDragEnd={onEventDragEnd}
                onKeyDown={(e) => handleEventKeyDown(e, note.id)}
                onFocus={() => setFocusedEventId(note.id)}
                onBlur={() => setFocusedEventId((prev) => (prev === note.id ? null : prev))}
                className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-left border transition-all ${
                  isDragging
                    ? 'opacity-50 shadow-none'
                    : 'opacity-95 shadow-sm hover:shadow'
                } bg-cal-card border-cal-border text-cal-text`}
                title={note.content}
                aria-label={`Event ${note.content}. Drag to move, or press Alt plus arrow keys to move by day or week.`}
              >
                {note.content}
              </button>
            );
          })}
          {focusedEventId ? (
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cal-border bg-cal-card px-2 py-1 text-[10px] font-medium text-cal-muted shadow-sm">
              Alt + Arrow to move
            </span>
          ) : null}
          {dayNotes.length > 2 ? (
            <span className="text-[10px] text-cal-muted px-1">+{dayNotes.length - 2} more</span>
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
