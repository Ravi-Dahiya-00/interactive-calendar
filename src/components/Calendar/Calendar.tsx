'use client';

import { useEffect, useCallback } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useDateRange } from '@/hooks/useDateRange';
import { useNotes } from '@/hooks/useNotes';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from '@/components/Notes/NotesPanel';

export function Calendar() {
  const {
    currentMonth,
    currentYear,
    monthName,
    monthGrid,
    direction,
    navigateMonth,
    goToToday,
  } = useCalendar();

  const {
    range,
    isSelectingEnd,
    handleDayClick,
    handleDayHover,
    handleMouseLeave,
    clearRange,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isInPreviewRange,
    isPreviewStart,
    isPreviewEnd,
  } = useDateRange();

  const { notes, addNote, deleteNote } = useNotes();

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateMonth('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateMonth('next');
      } else if (e.key === 'Escape') {
        clearRange();
      }
    },
    [navigateMonth, clearRange]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const animationKey = `${currentMonth}-${currentYear}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Interactive Calendar
        </h1>
        <p className="text-sm text-gray-400">
          Select a date range · Add notes · Navigate with arrow keys
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Calendar Card */}
        <div className="calendar-card flex-1 lg:max-w-[520px]">
          <CalendarHeader
            monthName={monthName}
            currentMonth={currentMonth}
            currentYear={currentYear}
            direction={direction}
            onNavigate={navigateMonth}
            onGoToToday={goToToday}
          />
          <CalendarGrid
            monthGrid={monthGrid}
            direction={direction}
            isRangeStart={isRangeStart}
            isRangeEnd={isRangeEnd}
            isInRange={isInRange}
            isInPreviewRange={isInPreviewRange}
            isPreviewStart={isPreviewStart}
            isPreviewEnd={isPreviewEnd}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            onMouseLeave={handleMouseLeave}
            animationKey={animationKey}
          />

          {/* Legend */}
          <div className="px-3 sm:px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-cal-primary" />
              Today
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cal-primary" />
              Selected
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-3 rounded-sm bg-cal-primary/10" />
              Range
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cal-holiday" />
              Holiday
            </div>
          </div>
        </div>

        {/* Notes Panel */}
        <div className="flex-1 lg:max-w-[380px]">
          <NotesPanel
            notes={notes}
            dateRange={range}
            isSelectingEnd={isSelectingEnd}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onClearRange={clearRange}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-gray-300">
        <p>← → Arrow keys to navigate months · Esc to clear selection</p>
      </div>
    </div>
  );
}
