// Renders the full month grid of days. Handles drag-to-select animations and arranges DayCell rows.
'use client';

import { useMemo, useState } from 'react';
import { CalendarDay } from '@/types';
import { DAY_NAMES } from '@/utils/dateUtils';
import { DayCell } from './DayCell';
import { Note } from '@/types';
import { dateToISOString } from '@/utils/dateUtils';

const EMPTY_NOTES: Note[] = [];

interface CalendarGridProps {
  monthGrid: CalendarDay[][];
  direction: 'prev' | 'next';
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  isInPreviewRange: (date: Date) => boolean;
  isPreviewStart: (date: Date) => boolean;
  isPreviewEnd: (date: Date) => boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  animationKey: string;
  notes: Note[];
  draggingNoteId: string | null;
  dragTargetIso: string | null;
  onEventDragStart: (noteId: string) => void;
  onEventDragEnd: () => void;
  onCellDragOver: (date: Date, isCurrentMonth: boolean, e: React.DragEvent) => void;
  onCellDragLeave: (date: Date) => void;
  onCellDrop: (date: Date, isCurrentMonth: boolean, e: React.DragEvent) => void;
  onEventMoveByDays: (noteId: string, deltaDays: number) => void;
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
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onMouseLeave,
  animationKey,
  notes,
  draggingNoteId,
  dragTargetIso,
  onEventDragStart,
  onEventDragEnd,
  onCellDragOver,
  onCellDragLeave,
  onCellDrop,
  onEventMoveByDays,
  onNavigate,
}: CalendarGridProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const notesByDate = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const note of notes) {
      const start = note.dateRange?.start;
      if (!start) continue;
      const list = map.get(start) ?? [];
      list.push(note);
      map.set(start, list);
    }
    return map;
  }, [notes]);

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
      onMouseUp={onMouseUp}
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
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            dayNotes={notesByDate.get(dateToISOString(day.date)) ?? EMPTY_NOTES}
            draggingNoteId={draggingNoteId}
            isDropTarget={dragTargetIso === dateToISOString(day.date)}
            onEventDragStart={onEventDragStart}
            onEventDragEnd={onEventDragEnd}
            onCellDragOver={onCellDragOver}
            onCellDragLeave={onCellDragLeave}
            onCellDrop={onCellDrop}
            onEventMoveByDays={onEventMoveByDays}
          />
        ))}
      </div>
    </div>
  );
}
