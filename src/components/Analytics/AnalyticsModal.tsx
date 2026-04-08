// Full-screen analytics modal. Restored to a professional, clean interface
// while maintaining interactive task details.
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Note } from '@/types';
import { isoStringToDate, formatDateRange } from '@/utils/dateUtils';

type AnalyticsView = 'totalEventsInMonth' | 'highPriorityEvents' | 'upcomingEvents';

interface AnalyticsModalProps {
  view: AnalyticsView;
  notes: Note[];
  monthName: string;
  currentMonth: number;
  currentYear: number;
  onClose: () => void;
}

function getNoteDate(note: Note): Date | null {
  if (!note.dateRange?.start) return null;
  return isoStringToDate(note.dateRange.start);
}

function formatNoteDate(note: Note): string {
  if (!note.dateRange) return 'General note';
  const start = note.dateRange.start ? isoStringToDate(note.dateRange.start) : null;
  const end = note.dateRange.end ? isoStringToDate(note.dateRange.end) : null;
  return formatDateRange(start, end);
}

const PRIORITY_CONFIG = {
  high: { label: 'High', dot: 'bg-rose-500', badge: 'bg-rose-500 text-white' },
  medium: { label: 'Medium', dot: 'bg-amber-500', badge: 'bg-amber-500 text-white' },
  low: { label: 'Low', dot: 'bg-emerald-500', badge: 'bg-emerald-500 text-white' },
};

const VIEW_CONFIG: Record<AnalyticsView, { title: string; icon: React.ReactNode; accent: string }> = {
  totalEventsInMonth: {
    title: 'Events This Month',
    accent: 'text-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  highPriorityEvents: {
    title: 'High Priority Events',
    accent: 'text-rose-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-7.12 12.3A1 1 0 004.03 18h15.94a1 1 0 00.86-1.5l-7.12-12.3a1 1 0 00-1.72 0z" />
      </svg>
    ),
  },
  upcomingEvents: {
    title: 'Upcoming Events',
    accent: 'text-emerald-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
};

export function AnalyticsModal({ view, notes, monthName, currentMonth, currentYear, onClose }: AnalyticsModalProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedNote) setSelectedNote(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handle);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, selectedNote]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const startDate = getNoteDate(note);
      if (view === 'totalEventsInMonth') {
        if (startDate) {
          const endIso = note.dateRange?.end;
          const end = endIso ? isoStringToDate(endIso) : startDate;
          const monthStart = new Date(currentYear, currentMonth, 1);
          const monthEnd = new Date(currentYear, currentMonth + 1, 0);
          return startDate <= monthEnd && end >= monthStart;
        }
        const createdAt = new Date(note.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      }
      if (view === 'highPriorityEvents') return note.priority === 'high';
      if (view === 'upcomingEvents') return startDate !== null && startDate >= today;
      return false;
    });
  }, [notes, view, currentMonth, currentYear, today]);

  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    const priorities = { high: 0, medium: 0, low: 0 };
    filteredNotes.forEach((n) => {
      const cat = n.category ?? 'other';
      categories[cat] = (categories[cat] ?? 0) + 1;
      if (n.priority) priorities[n.priority]++;
    });
    return { categories, priorities };
  }, [filteredNotes]);

  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      if (view === 'upcomingEvents') {
        return (getNoteDate(a)?.getTime() ?? 0) - (getNoteDate(b)?.getTime() ?? 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredNotes, view]);

  const config = VIEW_CONFIG[view];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-cal-card border border-cal-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-cal-border shrink-0">
          <div className="flex items-center gap-3">
            <span className={config.accent}>{config.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-cal-text font-display uppercase tracking-wide">{config.title}</h2>
              <p className="text-xs text-cal-muted mt-0.5">{monthName} · {filteredNotes.length} items</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-cal-muted hover:bg-cal-bg hover:text-cal-text transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            
            {/* Stats section */}
            {filteredNotes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <article className="bg-cal-bg rounded-xl p-4 border border-cal-border">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cal-muted mb-3">Priorities</p>
                  <div className="space-y-2">
                    {(['high', 'medium', 'low'] as const).map(p => {
                      const count = stats.priorities[p];
                      const pct = Math.round((count / filteredNotes.length) * 100) || 0;
                      const cfg = PRIORITY_CONFIG[p];
                      return (
                        <div key={p} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <div className="flex-1 bg-cal-border h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${cfg.dot}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-cal-muted w-4 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </article>
                <article className="bg-cal-bg rounded-xl p-4 border border-cal-border">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-cal-muted mb-3">Categories</p>
                   <div className="flex flex-wrap gap-1.5">
                     {Object.entries(stats.categories).map(([cat, count]) => (
                       <div key={cat} className="text-[10px] font-bold px-2 py-1 bg-cal-card border border-cal-border rounded text-cal-text uppercase">
                         {cat} · {count}
                       </div>
                     ))}
                   </div>
                </article>
              </div>
            )}

            {/* List */}
            {sortedNotes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-cal-muted text-sm font-medium">Nothing logged for this view yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedNotes.map((note) => {
                  const cfg = PRIORITY_CONFIG[note.priority || 'medium'];
                  return (
                    <button
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className="w-full text-left p-4 rounded-xl border border-cal-border bg-cal-bg hover:border-cal-primary transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-1 h-8 rounded-full ${cfg.dot} opacity-60`} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-cal-text truncate">{note.title || 'Untitled'}</p>
                          <p className="text-[10px] text-cal-muted font-bold uppercase tracking-wider">{formatNoteDate(note)}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cal-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-right shrink-0">Details</span>
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* Task Detail View Overlay */}
        {selectedNote && (
          <div className="absolute inset-0 z-50 bg-cal-card animate-fade-in flex flex-col">
            <header className="px-6 py-4 border-b border-cal-border flex items-center justify-between shrink-0">
              <button onClick={() => setSelectedNote(null)} className="flex items-center gap-2 text-cal-primary font-bold text-xs uppercase tracking-widest hover:text-cal-primary-dark transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
                Back to List
              </button>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${PRIORITY_CONFIG[selectedNote.priority || 'medium'].badge}`}>
                {selectedNote.priority}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
               <div className="mb-6 pb-6 border-b border-cal-border">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-cal-muted uppercase tracking-[0.2em]">
                    <span className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[selectedNote.priority || 'medium'].dot}`} />
                    {selectedNote.category || 'General'}
                  </div>
                  <h3 className="text-3xl font-extrabold text-cal-text font-display leading-tight">{selectedNote.title || 'Untitled Note'}</h3>
               </div>
               
               <div className="mb-8">
                  <h4 className="text-[10px] font-bold text-cal-muted uppercase tracking-widest mb-3 opacity-60">Activity Details</h4>
                  <div className="p-5 bg-cal-bg border border-cal-border rounded-xl">
                    <p className="text-sm text-cal-text leading-relaxed whitespace-pre-wrap font-medium">
                      {selectedNote.content || 'No description provided.'}
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cal-border">
                 <div>
                   <h4 className="text-[10px] font-bold text-cal-muted uppercase tracking-widest mb-2 opacity-60">Scheduled Time</h4>
                   <p className="text-sm font-extrabold text-cal-text flex items-center gap-2">
                     <svg className="w-4 h-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     {selectedNote.eventTime || '--:--'} {selectedNote.eventEndTime ? ` → ${selectedNote.eventEndTime}` : ''}
                   </p>
                 </div>
                 <div>
                   <h4 className="text-[10px] font-bold text-cal-muted uppercase tracking-widest mb-2 opacity-60">Date Range</h4>
                   <p className="text-sm font-extrabold text-cal-text flex items-center gap-2">
                     <svg className="w-4 h-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     {formatNoteDate(selectedNote)}
                   </p>
                 </div>
               </div>
            </div>
            
            <footer className="p-6 border-t border-cal-border shrink-0">
               <button onClick={onClose} className="w-full h-12 rounded-xl bg-cal-primary text-white font-bold tracking-widest uppercase text-xs hover:bg-cal-primary-dark transition-all transform active:scale-[0.98]">
                 Go to Calendar
               </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
