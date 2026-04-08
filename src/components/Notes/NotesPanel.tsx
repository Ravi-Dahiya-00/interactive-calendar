'use client';

import { useState, useCallback, KeyboardEvent, useMemo, useRef, useEffect } from 'react';
import { Note, DateRange, NoteCategory } from '@/types';
import { isoStringToDate, formatDateRange } from '@/utils/dateUtils';
import { EventFiltersController } from '@/hooks/useEventFilters';
import { FilterPanel } from './FilterPanel';
import { SearchMatchHighlight } from './SearchMatchHighlight';
import { EmptyState } from '@/components/Common/EmptyState';

interface NotesPanelProps {
  notes: Note[];
  dateRange: DateRange;
  isSelectingEnd: boolean;
  onAddNote: (content: string, dateRange: DateRange | null, priority: 'high' | 'medium' | 'low', eventTime?: string, eventEndTime?: string, reminder?: number, category?: NoteCategory) => void;
  onDeleteNote: (id: string) => void;
  onClearRange: () => void;
  onGoToToday: () => void;
  filterController: EventFiltersController;
  currentMonth: number;
  currentYear: number;
  panelId: 'desktop' | 'mobile';
}

export function NotesPanel({
  notes,
  dateRange,
  isSelectingEnd,
  onAddNote,
  onDeleteNote,
  onClearRange,
  onGoToToday,
  filterController,
  currentMonth,
  currentYear,
  panelId,
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Priority feature states
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newCategory, setNewCategory] = useState<NoteCategory>('work');
  const [eventTime, setEventTime] = useState('');
  const [reminder, setReminder] = useState<number | undefined>(undefined);
  
  const {
    filters,
    debouncedSearch,
    filteredNotes,
    updateSearchQuery,
    updateDateRange,
    toggleCategory,
    togglePriority,
    clearFilters,
    hasActiveFilters
  } = filterController;

  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const timeMenuRef = useRef<HTMLDivElement>(null);

  const [eventEndTime, setEventEndTime] = useState('');
  const [isEndTimeMenuOpen, setIsEndTimeMenuOpen] = useState(false);
  const endTimeMenuRef = useRef<HTMLDivElement>(null);

  const [isReminderMenuOpen, setIsReminderMenuOpen] = useState(false);
  const reminderMenuRef = useRef<HTMLDivElement>(null);

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const reminderOptions = [
    { label: 'No reminder', value: undefined },
    { label: '5 min before', value: 5 },
    { label: '15 min before', value: 15 },
    { label: '30 min before', value: 30 },
    { label: '1 hr before', value: 60 },
  ];

  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return times;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeMenuRef.current && !timeMenuRef.current.contains(event.target as Node)) {
        setIsTimeMenuOpen(false);
      }
      if (endTimeMenuRef.current && !endTimeMenuRef.current.contains(event.target as Node)) {
        setIsEndTimeMenuOpen(false);
      }
      if (reminderMenuRef.current && !reminderMenuRef.current.contains(event.target as Node)) {
        setIsReminderMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rangeText = formatDateRange(dateRange.start, dateRange.end);
  const hasRange = dateRange.start !== null;

  const handleAddNote = useCallback(() => {
    if (!newNote.trim()) return;
    onAddNote(newNote, hasRange ? dateRange : null, priority, eventTime || undefined, eventEndTime || undefined, reminder, newCategory);
    setNewNote('');
    setPriority('medium');
    setEventTime('');
    setEventEndTime('');
    setReminder(undefined);
  }, [newNote, hasRange, dateRange, priority, eventTime, eventEndTime, reminder, newCategory, onAddNote]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddNote();
      }
    },
    [handleAddNote]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      setTimeout(() => {
        onDeleteNote(id);
        setDeletingId(null);
      }, 200);
    },
    [onDeleteNote]
  );

  const formatNoteDate = (note: Note) => {
    if (!note.dateRange) return 'General note';
    const start = note.dateRange.start
      ? isoStringToDate(note.dateRange.start)
      : null;
    const end = note.dateRange.end
      ? isoStringToDate(note.dateRange.end)
      : null;
    return formatDateRange(start, end);
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  // We sort filteredNotes by timestamp natively
  const filteredAndSortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      const pmap: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const pa = pmap[a.priority || 'medium'];
      const pb = pmap[b.priority || 'medium'];
      if (pa !== pb) return pb - pa;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredNotes]);

  const priorityColors = {
    high: 'bg-red-500 border-red-500 text-white',
    medium: 'bg-amber-500 border-amber-500 text-white',
    low: 'bg-green-500 border-green-500 text-white',
  };

  const priorityColorsLight = {
    high: 'bg-red-50 text-red-600 border-red-200',
    medium: 'bg-amber-50 text-amber-600 border-amber-200',
    low: 'bg-green-50 text-green-600 border-green-200',
  };

  const isNoteInCurrentMonth = useCallback(
    (note: Note) => {
      const referenceDate = note.dateRange?.start
        ? isoStringToDate(note.dateRange.start)
        : new Date(note.createdAt);
      return (
        referenceDate.getMonth() === currentMonth &&
        referenceDate.getFullYear() === currentYear
      );
    },
    [currentMonth, currentYear]
  );

  const monthScopedNotes = useMemo(
    () => filteredAndSortedNotes.filter((note) => isNoteInCurrentMonth(note)),
    [filteredAndSortedNotes, isNoteInCurrentMonth]
  );

  const visibleNotes = hasActiveFilters ? filteredAndSortedNotes : monthScopedNotes;

  return (
    <div className="notes-panel h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-cal-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cal-text flex items-center gap-2">
            <svg
              className="w-5 h-5 text-cal-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Notes
            {visibleNotes.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cal-primary-50 text-cal-primary ml-1">
                {visibleNotes.length}
              </span>
            )}
          </h3>
        </div>

        <FilterPanel
          searchQuery={filters.searchQuery}
          onSearchChange={updateSearchQuery}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onDateRangeChange={updateDateRange}
          categories={filters.categories}
          onToggleCategory={toggleCategory}
          priorities={filters.priorities}
          onTogglePriority={togglePriority}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Selected Range Badge */}
        {hasRange && !isSelectingEnd && (
          <div className="flex items-start gap-2 animate-fade-in">
            <div className="flex-1 flex flex-col gap-1 px-3 py-2 rounded-lg bg-cal-primary-50 border border-cal-primary-light">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-cal-primary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-cal-primary-dark truncate">
                  {rangeText}
                </span>
              </div>
              <p className="text-[11px] text-cal-primary/80">
                Tip: navigate month/year and click another date to extend this range.
              </p>
            </div>
            <button
              onClick={onClearRange}
              className="p-1.5 rounded-lg hover:bg-cal-bg text-cal-muted hover:text-cal-text transition-colors"
              aria-label="Clear selection"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {isSelectingEnd && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 animate-pulse-soft">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-amber-700">
              Click another date to complete the range
            </span>
          </div>
        )}
      </div>

      {/* New Note Input */}
      <div className="p-4 sm:p-5 border-b border-cal-border">
        <textarea
          ref={noteInputRef}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasRange && !isSelectingEnd
              ? `Add a note for ${rangeText}...`
              : 'Write a general note...'
          }
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-cal-border bg-cal-bg text-cal-text focus:border-cal-primary focus:ring-2 focus:ring-cal-primary/20 outline-none resize-none transition-all duration-200 placeholder:text-cal-muted"
          rows={3}
          id={`${panelId}-note-input`}
        />
        
        {/* Time and Reminder Selection */}
        {hasRange && !isSelectingEnd && (
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <div className="relative" ref={timeMenuRef}>
              <button
                onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-cal-bg border rounded-lg transition-all font-medium text-cal-text hover:bg-cal-border ${
                  isTimeMenuOpen ? 'border-cal-primary ring-1 ring-cal-primary' : 'border-cal-border'
                }`}
                title="Event Time"
              >
                <svg className="w-3.5 h-3.5 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {eventTime || 'Time'}
              </button>

              {isTimeMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-28 max-h-48 overflow-y-auto bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-1.5 z-[60] custom-scrollbar animate-fade-in text-white">
                  <button
                    onClick={() => { setEventTime(''); setIsTimeMenuOpen(false); }}
                    className={`w-full text-center px-4 py-1.5 text-sm transition-colors ${!eventTime ? 'bg-white/20 font-bold text-white' : 'text-white/80 hover:bg-white/10'}`}
                  >
                    -- : --
                  </button>
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      onClick={() => { 
                        setEventTime(time); 
                        if (eventEndTime && time > eventEndTime) {
                          setEventEndTime('');
                        }
                        setIsTimeMenuOpen(false); 
                      }}
                      className={`w-full text-center px-4 py-1.5 text-sm transition-colors ${eventTime === time ? 'bg-white/20 font-bold text-white' : 'text-white/80 hover:bg-white/10'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {eventTime && (
              <>
                <span className="text-cal-muted">-</span>
                <div className="relative" ref={endTimeMenuRef}>
                  <button
                    onClick={() => setIsEndTimeMenuOpen(!isEndTimeMenuOpen)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-cal-bg border rounded-lg transition-all font-medium text-cal-text hover:bg-cal-border ${
                      isEndTimeMenuOpen ? 'border-cal-primary ring-1 ring-cal-primary' : 'border-cal-border'
                    }`}
                    title="End Time"
                  >
                    {eventEndTime || 'End Time'}
                  </button>
                  
                  {isEndTimeMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-28 max-h-48 overflow-y-auto bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-1.5 z-[60] custom-scrollbar animate-fade-in text-white">
                      <button
                        onClick={() => { setEventEndTime(''); setIsEndTimeMenuOpen(false); }}
                        className={`w-full text-center px-4 py-1.5 text-sm transition-colors ${!eventEndTime ? 'bg-white/20 font-bold text-white' : 'text-white/80 hover:bg-white/10'}`}
                      >
                        -- : --
                      </button>
                      {timeOptions.map((time) => {
                        // Only show times after the start time
                        if (eventTime && time <= eventTime) return null;
                        return (
                          <button
                            key={time}
                            onClick={() => { setEventEndTime(time); setIsEndTimeMenuOpen(false); }}
                            className={`w-full text-center px-4 py-1.5 text-sm transition-colors ${eventEndTime === time ? 'bg-white/20 font-bold text-white' : 'text-white/80 hover:bg-white/10'}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 ml-1 relative" ref={reminderMenuRef}>
                  <svg className="w-4 h-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <button
                    onClick={() => setIsReminderMenuOpen(!isReminderMenuOpen)}
                    className={`flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] bg-cal-bg border rounded-lg transition-all font-medium text-cal-text hover:bg-cal-border min-w-[110px] ${
                      isReminderMenuOpen ? 'border-cal-primary ring-1 ring-cal-primary' : 'border-cal-border'
                    }`}
                    title="Reminder"
                  >
                    <span>{reminderOptions.find(o => o.value === reminder)?.label || 'No reminder'}</span>
                    <svg className="w-3.5 h-3.5 text-cal-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isReminderMenuOpen && (
                    <div className="absolute bottom-full left-6 mb-2 w-32 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-1.5 z-[60] animate-fade-in text-white text-sm">
                      {reminderOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => { setReminder(option.value); setIsReminderMenuOpen(false); }}
                          className={`w-full text-center px-3 py-2 transition-colors ${reminder === option.value ? 'bg-white/20 font-bold text-white' : 'text-white/80 hover:bg-white/10'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Priority Selection & Submit Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-cal-muted mr-1">Priority:</span>
            {(['low', 'medium', 'high'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 capitalize flex items-center justify-center hover:scale-105 active:scale-95 ${priority === p ? priorityColors[p] : 'bg-cal-bg text-cal-muted border-cal-border hover:bg-cal-card'}`}
              >
                {p}
              </button>
            ))}

            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`ml-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 capitalize shadow-sm hover:scale-105 active:scale-95 ${
                  newCategory === 'work' ? 'bg-blue-500 border-blue-500 text-white' :
                  newCategory === 'personal' ? 'bg-purple-500 border-purple-500 text-white' :
                  newCategory === 'study' ? 'bg-emerald-500 border-emerald-500 text-white' :
                  'bg-gray-500 border-gray-500 text-white'
                }`}
                title="Category"
              >
                {newCategory}
                <svg className={`w-3 h-3 text-white/70 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute bottom-full left-2 mb-2 w-28 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-1.5 z-[60] animate-fade-in text-white flex flex-col">
                  {(['work', 'personal', 'study', 'other'] as const).map(c => {
                    const colorMap: Record<string, string> = {
                      work: newCategory === c ? 'bg-blue-500 font-bold text-white' : 'text-white/80 hover:bg-white/10 hover:text-blue-400',
                      personal: newCategory === c ? 'bg-purple-500 font-bold text-white' : 'text-white/80 hover:bg-white/10 hover:text-purple-400',
                      study: newCategory === c ? 'bg-emerald-500 font-bold text-white' : 'text-white/80 hover:bg-white/10 hover:text-emerald-400',
                      other: newCategory === c ? 'bg-gray-500 font-bold text-white' : 'text-white/80 hover:bg-white/10 hover:text-gray-300',
                    };
                    return (
                      <button
                        key={c}
                        onClick={() => { setNewCategory(c); setIsCategoryMenuOpen(false); }}
                        className={`w-full text-center px-3 py-2 text-xs capitalize transition-all ${colorMap[c] || ''}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="w-full sm:w-auto justify-center px-4 py-2 min-h-[44px] text-sm font-medium rounded-lg bg-cal-primary text-white hover:bg-cal-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
            id={`${panelId}-add-note-btn`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-3 relative">
        {visibleNotes.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No matching events found"
              description="No events match your current filters or search."
              hint="Try clearing filters or searching with another keyword."
              shortcuts={[{ key: 'Esc', label: 'Clear selection' }]}
              actionLabel="Clear Filters"
              onAction={clearFilters}
            />
          ) : (
            <EmptyState
              title="No events yet. Start by adding one 🚀"
              description="Your current month is empty."
              hint="Click on a date to create your first event."
              shortcuts={[
                { key: 'Enter', label: 'Add event' },
                { key: 'Esc', label: 'Clear selection' },
              ]}
              actionLabel="Add Event"
              onAction={() => noteInputRef.current?.focus()}
              secondaryActionLabel="Go to Today"
              onSecondaryAction={onGoToToday}
            />
          )
        ) : (
          visibleNotes.map((note, index) => {
            const p = note.priority || 'medium';
            const colors = priorityColorsLight[p];
            const indicatorColor = p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-green-500';
            
            return (
              <div
                key={note.id}
                className={`note-card pl-4 animate-slide-up ${
                  deletingId === note.id
                    ? 'opacity-0 scale-95 transition-all duration-200'
                    : ''
                }`}
              >
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${indicatorColor}`}
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-cal-text whitespace-pre-wrap break-words">
                      <SearchMatchHighlight text={note.content} query={debouncedSearch} />
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-2.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider border ${colors}`}>
                        {p}
                      </span>
                      {note.category && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider border bg-cal-bg border-cal-border text-cal-muted">
                          {note.category}
                        </span>
                      )}
                      {note.eventTime && (
                        <span className="text-xs font-semibold text-cal-text bg-cal-card px-1.5 py-0.5 rounded border border-cal-border shadow-sm flex items-center gap-1">
                          <svg className="w-3 h-3 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {note.eventTime}{note.eventEndTime ? ` - ${note.eventEndTime}` : ''}
                          {note.reminder !== undefined && (
                            <div title={`Reminder: ${note.reminder} mins before`} className="flex items-center">
                              <svg className="w-3 h-3 text-amber-500 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                            </div>
                          )}
                        </span>
                      )}
                      <span className="text-xs text-cal-muted font-medium">
                        {formatNoteDate(note)}
                      </span>
                      <span className="text-xs text-cal-muted/50">·</span>
                      <span className="text-xs text-cal-muted">
                        {formatTimestamp(note.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 text-cal-muted hover:text-red-500 transition-all duration-200 flex-shrink-0"
                    aria-label="Delete note"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
