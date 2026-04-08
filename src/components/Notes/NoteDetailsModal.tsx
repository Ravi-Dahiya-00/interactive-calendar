'use client';

import { Note } from '@/types';
import { isoStringToDate, formatDateRange } from '@/utils/dateUtils';
import { useEffect, useRef } from 'react';

interface NoteDetailsModalProps {
  note: Note;
  onClose: () => void;
}

export function NoteDetailsModal({ note, onClose }: NoteDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const formatNoteDate = (note: Note) => {
    if (!note.dateRange) return 'General note';
    const start = note.dateRange.start ? isoStringToDate(note.dateRange.start) : null;
    const end = note.dateRange.end ? isoStringToDate(note.dateRange.end) : null;
    return formatDateRange(start, end);
  };

  const priorityColors = {
    high: 'bg-red-500 text-white',
    medium: 'bg-amber-500 text-white',
    low: 'bg-green-500 text-white',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] bg-cal-card border border-cal-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cal-border bg-cal-bg/50">
          <div className="flex space-x-3 items-center">
            {note.priority && (
              <span className={`text-[11px] font-bold px-2 py-1 rounded tracking-wide uppercase ${priorityColors[note.priority]}`}>
                {note.priority}
              </span>
            )}
            {note.category && (
              <span className="text-[11px] font-bold px-2 py-1 rounded tracking-wide uppercase bg-cal-primary/10 text-cal-primary">
                {note.category}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-cal-muted hover:bg-cal-border hover:text-cal-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {note.title ? (
            <h2 className="text-2xl sm:text-3xl font-bold text-cal-text mb-4 leading-tight font-display">
              {note.title}
            </h2>
          ) : null}

          {/* Metadata Block */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-cal-muted mb-8 pb-6 border-b border-cal-border/50">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-cal-text">{formatNoteDate(note)}</span>
            </div>
            
            {note.eventTime && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-cal-text">{note.eventTime}{note.eventEndTime ? ` - ${note.eventEndTime}` : ''}</span>
              </div>
            )}

            <div className="w-1 h-1 rounded-full bg-cal-muted" />
            <span>Created {new Date(note.createdAt).toLocaleString()}</span>
          </div>

          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed text-cal-text whitespace-pre-wrap word-break-words">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  );
}
