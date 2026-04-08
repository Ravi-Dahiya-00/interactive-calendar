'use client';

import { useEffect, useCallback, useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useDateRange } from '@/hooks/useDateRange';
import { useNotes } from '@/hooks/useNotes';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from '@/components/Notes/NotesPanel';
import { DailySummaryModal } from './DailySummaryModal';
import { useReminders } from '@/hooks/useReminders';
import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MiniAnalyticsDashboard } from '@/components/Analytics/MiniAnalyticsDashboard';
import { useEventFilters } from '@/hooks/useEventFilters';
import { useEventDragDrop } from '@/hooks/useEventDragDrop';
import { SeasonalEffects } from '@/components/Theme/SeasonalEffects';

export function Calendar() {
  const {
    currentMonth,
    currentYear,
    monthName,
    monthGrid,
    direction,
    navigateMonth,
    goToToday,
    jumpToDate,
  } = useCalendar();

  const {
    range,
    isDragging,
    handleMouseDown,
    handleMouseEnterDay,
    handleMouseUp,
    handleMouseLeave,
    clearRange,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isInPreviewRange,
    isPreviewStart,
    isPreviewEnd,
  } = useDateRange();

  const { notes, addNote, deleteNote, updateNote } = useNotes();
  const filtersController = useEventFilters(notes);
  const {
    draggingNoteId,
    dragTargetIso,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    moveNoteByDays,
  } = useEventDragDrop({
    notes,
    onUpdateNote: updateNote,
  });
  const { toasts, removeToast } = useReminders(notes, updateNote);
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(false);
  const analytics = useAnalytics({
    notes,
    currentMonth,
    currentYear,
    scopedNotes: filtersController.hasActiveFilters ? filtersController.filteredNotes : notes,
  });

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
      <SeasonalEffects currentMonth={currentMonth} />
      <DailySummaryModal notes={notes} onClose={() => {}} />
      
      {/* Fallback Toasts Container */}
      <div className="fixed bottom-24 right-4 sm:bottom-4 z-50 flex flex-col gap-2 pointer-events-none w-[calc(100%-2rem)] sm:w-auto">
        {toasts.map((toast) => (
          <div key={toast.id} className="bg-cal-card rounded-xl shadow-lg border border-cal-border p-4 w-full sm:w-72 pointer-events-auto animate-slide-in-right">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-cal-text">{toast.title}</h4>
                <p className="text-xs text-cal-muted mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-cal-muted hover:text-cal-primary rounded-lg p-1 transition-colors"
                aria-label="Dismiss reminder notification"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="relative text-center mb-6 sm:mb-8 flex flex-col items-center">
        <div className="absolute top-0 right-0 sm:right-4">
          <ThemeToggle />
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-cal-text mb-1 transition-colors font-display"
        >
          Interactive Calendar
        </h1>
        <p className="text-sm text-cal-muted transition-colors">
          Drag to select a range · Add notes · Navigate with arrow keys
        </p>
      </div>

      {/* Main Layout */}
      <MiniAnalyticsDashboard
        stats={analytics}
        monthName={monthName}
        isFilteredView={filtersController.hasActiveFilters}
      />

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
            onJumpToDate={jumpToDate}
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
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnterDay}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            animationKey={animationKey}
            notes={notes}
            draggingNoteId={draggingNoteId}
            dragTargetIso={dragTargetIso}
            onEventDragStart={handleDragStart}
            onEventDragEnd={handleDragEnd}
            onCellDragOver={handleDragOver}
            onCellDragLeave={handleDragLeave}
            onCellDrop={handleDrop}
            onEventMoveByDays={moveNoteByDays}
          />

          {/* Legend */}
          <div className="px-3 sm:px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cal-muted transition-colors">
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

        {/* Notes Panel (Desktop) */}
        <div className="hidden lg:block flex-1 max-w-[380px]">
          <NotesPanel
            notes={notes}
            dateRange={range}
            isSelectingEnd={isDragging}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onClearRange={clearRange}
            onGoToToday={goToToday}
            filterController={filtersController}
            currentMonth={currentMonth}
            currentYear={currentYear}
            panelId="desktop"
          />
        </div>
      </div>

      {/* FAB - Visible only on mobile */}
      <button
        onClick={() => setIsMobileNotesOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-cal-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-cal-primary/30 min-h-[56px] min-w-[56px]"
        aria-label="Open Events & Notes"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {notes.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold">
            {notes.length}
          </span>
        )}
      </button>

      {/* Mobile Bottom Sheet Modal */}
      {isMobileNotesOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 sm:items-center sm:p-4">
          <div className="w-full sm:max-w-md bg-cal-bg rounded-t-3xl sm:rounded-2xl h-[85vh] sm:h-[80vh] flex flex-col shadow-2xl animate-slide-up relative overflow-hidden">
             {/* Header drag handle area */}
            <div className="w-full flex items-center justify-between p-4 bg-cal-card border-b border-cal-border shrink-0 shadow-sm z-10">
               <h3 className="font-bold text-cal-text text-lg">Events & Notes</h3>
               <button onClick={() => setIsMobileNotesOpen(false)} className="p-3 bg-cal-bg rounded-full text-cal-muted hover:text-cal-text hover:bg-cal-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close Events & Notes">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
            </div>
            
            {/* Content body */}
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 overflow-y-auto w-full h-full custom-scrollbar">
                <NotesPanel
                  notes={notes}
                  dateRange={range}
                  isSelectingEnd={isDragging}
                  onAddNote={addNote}
                  onDeleteNote={deleteNote}
                  onClearRange={clearRange}
                  onGoToToday={goToToday}
                  filterController={filtersController}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  panelId="mobile"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="hidden lg:block text-center mt-8 text-xs text-cal-muted transition-colors">
        <p>← → Arrow keys to navigate months · Esc to clear selection</p>
      </div>
    </div>
  );
}
