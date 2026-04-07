'use client';

import { useState, useCallback, KeyboardEvent, useMemo, useRef, useEffect } from 'react';
import { Note, DateRange } from '@/types';
import { isoStringToDate, formatDateRange } from '@/utils/dateUtils';

interface NotesPanelProps {
  notes: Note[];
  dateRange: DateRange;
  isSelectingEnd: boolean;
  onAddNote: (content: string, dateRange: DateRange | null, priority: 'high' | 'medium' | 'low') => void;
  onDeleteNote: (id: string) => void;
  onClearRange: () => void;
}

export function NotesPanel({
  notes,
  dateRange,
  isSelectingEnd,
  onAddNote,
  onDeleteNote,
  onClearRange,
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Priority feature states
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [priorityFilters, setPriorityFilters] = useState<Set<string>>(new Set(['high', 'medium', 'low']));
  const [sortAscending, setSortAscending] = useState(false); // false = High to Low
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rangeText = formatDateRange(dateRange.start, dateRange.end);
  const hasRange = dateRange.start !== null;

  const handleAddNote = useCallback(() => {
    if (!newNote.trim()) return;
    onAddNote(newNote, hasRange ? dateRange : null, priority);
    setNewNote('');
    setPriority('medium');
  }, [newNote, hasRange, dateRange, priority, onAddNote]);

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

  const filteredAndSortedNotes = useMemo(() => {
    return [...notes]
      .filter((note) => priorityFilters.has(note.priority || 'medium'))
      .sort((a, b) => {
        const pmap: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const pa = pmap[a.priority || 'medium'];
        const pb = pmap[b.priority || 'medium'];
        if (pa !== pb) {
          return sortAscending ? pa - pb : pb - pa;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notes, priorityFilters, sortAscending]);

  const toggleFilter = (p: string) => {
    const newFilters = new Set(priorityFilters);
    if (newFilters.has(p)) {
      if (newFilters.size > 1) newFilters.delete(p);
    } else {
      newFilters.add(p);
    }
    setPriorityFilters(newFilters);
  };

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

  return (
    <div className="notes-panel h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
            {notes.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cal-primary-50 text-cal-primary ml-1">
                {notes.length}
              </span>
            )}
          </h3>

          {/* Filters and Sort */}
          {notes.length > 0 && (
            <div className="flex items-center gap-1.5 relative" ref={filterMenuRef}>
              <button
                onClick={() => setSortAscending(!sortAscending)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors tooltip"
                aria-label="Toggle sort order"
                title={sortAscending ? "Sorting Low to High" : "Sorting High to Low"}
              >
                <svg className={`w-4 h-4 transition-transform ${sortAscending ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
              
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${isFilterMenuOpen || priorityFilters.size < 3 ? 'bg-cal-primary-50 text-cal-primary' : 'hover:bg-gray-100 text-gray-500'}`}
                aria-label="Filter priorities"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {priorityFilters.size < 3 && <span className="text-[10px] font-bold">{priorityFilters.size}</span>}
              </button>

              {isFilterMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-fade-in">
                  {(['high', 'medium', 'low'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => toggleFilter(p)}
                      className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full border ${priorityFilters.has(p) ? (p === 'high' ? 'bg-red-500 border-red-500' : p === 'medium' ? 'bg-amber-500 border-amber-500' : 'bg-green-500 border-green-500') : 'bg-transparent border-gray-300'}`} />
                      <span className="capitalize text-gray-700">{p}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Range Badge */}
        {hasRange && !isSelectingEnd && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-cal-primary-50 border border-cal-primary-light">
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
            <button
              onClick={onClearRange}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
      <div className="p-4 sm:p-5 border-b border-gray-100">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasRange && !isSelectingEnd
              ? `Add a note for ${rangeText}...`
              : 'Write a general note...'
          }
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-cal-primary focus:ring-2 focus:ring-cal-primary/20 outline-none resize-none transition-all duration-200 placeholder:text-gray-400"
          rows={3}
          id="note-input"
        />
        
        {/* Priority Selection & Submit Row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500 mr-1">Priority:</span>
            {(['low', 'medium', 'high'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2 py-1 text-xs font-medium rounded-lg border transition-all duration-200 capitalize ${priority === p ? priorityColors[p] : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-1.5 text-sm font-medium rounded-lg bg-cal-primary text-white hover:bg-cal-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
            id="add-note-btn"
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
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">
              No notes yet
            </p>
            <p className="text-xs text-gray-300">
              Select dates and start writing
            </p>
          </div>
        ) : filteredAndSortedNotes.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
             <p className="text-sm">No notes match the selected priority filters.</p>
           </div>
        ) : (
          filteredAndSortedNotes.map((note, index) => {
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
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${indicatorColor}`}
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-2.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider border ${colors}`}>
                        {p}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {formatNoteDate(note)}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(note.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 flex-shrink-0"
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
