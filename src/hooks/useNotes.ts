'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note, DateRange, SerializedDateRange, NoteCategory } from '@/types';
import { dateToISOString } from '@/utils/dateUtils';

const STORAGE_KEY = 'interactive-calendar-notes';

const NOTE_COLORS = [
  '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899',
  '#06b6d4', '#f97316', '#10b981', '#6366f1',
];

function serializeDateRange(range: DateRange | null): SerializedDateRange | null {
  if (!range || (!range.start && !range.end)) return null;
  return {
    start: range.start ? dateToISOString(range.start) : null,
    end: range.end ? dateToISOString(range.end) : null,
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load notes:', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.error('Failed to save notes:', e);
      }
    }
  }, [notes, isLoaded]);

  const addNote = useCallback((
    content: string,
    dateRange: DateRange | null,
    priority: 'high' | 'medium' | 'low' = 'medium',
    eventTime?: string,
    eventEndTime?: string,
    reminder?: number,
    category?: NoteCategory
  ) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      dateRange: serializeDateRange(dateRange),
      createdAt: new Date().toISOString(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      priority,
      eventTime,
      eventEndTime,
      reminder,
      notified: false,
      category,
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const editNote = useCallback((id: string, content: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, content: content.trim() } : note
      )
    );
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, ...updates } : note))
    );
  }, []);

  return { notes, isLoaded, addNote, deleteNote, editNote, updateNote };
}

export { NOTE_COLORS };
