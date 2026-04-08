'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types';
import { isoStringToDate, isSameDay } from '@/utils/dateUtils';

interface DailySummaryModalProps {
  notes: Note[];
  onClose: () => void;
}

export function DailySummaryModal({ notes, onClose }: DailySummaryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [todaysNotes, setTodaysNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Check if we should show the modal today
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const lastSummary = localStorage.getItem('calendar-last-summary');

    if (lastSummary !== todayStr) {
      // Find today's events
      const todays = notes.filter((note) => {
        if (!note.dateRange?.start) return false;
        const noteDate = isoStringToDate(note.dateRange.start);
        return isSameDay(noteDate, now);
      });

      // Sort by time
      todays.sort((a, b) => {
        const timeA = a.eventTime || '23:59';
        const timeB = b.eventTime || '23:59';
        return timeA.localeCompare(timeB);
      });

      setTodaysNotes(todays);
      setIsOpen(true);
      localStorage.setItem('calendar-last-summary', todayStr);
    }
  }, [notes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-cal-card rounded-t-3xl sm:rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up sm:animate-scale-in">
        <div className="px-6 py-5 border-b border-cal-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-cal-text" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            Today&apos;s Events
          </h2>
          <button
            onClick={() => {
              setIsOpen(false);
              onClose();
            }}
            className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-cal-bg text-cal-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {todaysNotes.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-cal-primary-50 text-cal-primary flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-cal-muted font-medium mt-2">Your day is free!</p>
              <p className="text-xs opacity-70 mt-1">No events scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysNotes.map(note => {
                const priorityColors = {
                  high: 'bg-red-50 text-red-600 border-red-200',
                  medium: 'bg-amber-50 text-amber-600 border-amber-200',
                  low: 'bg-green-50 text-green-600 border-green-200',
                };
                const p = note.priority || 'medium';
                const colors = priorityColors[p];

                return (
                  <div key={note.id} className="p-4 rounded-xl border border-cal-border bg-cal-bg flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cal-text line-clamp-2">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-cal-text bg-cal-card px-2 py-0.5 rounded border border-cal-border shadow-sm flex items-center gap-1">
                          <svg className="w-3 h-3 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {note.eventTime ? `${note.eventTime}${note.eventEndTime ? ` - ${note.eventEndTime}` : ''}` : 'All Day'}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${colors}`}>
                          {p}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-cal-border bg-cal-bg flex justify-end">
          <button
            onClick={() => {
              setIsOpen(false);
              onClose();
            }}
            className="px-4 py-2 min-h-[44px] w-full sm:w-auto bg-cal-primary text-white text-sm font-medium rounded-lg hover:bg-cal-primary-dark transition-colors"
          >
            Have a great day!
          </button>
        </div>
      </div>
    </div>
  );
}
