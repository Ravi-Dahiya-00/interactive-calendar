// Lets users move events to a different day by dragging and dropping them with the mouse.
'use client';

import { useCallback, useMemo, useState } from 'react';
import { Note } from '@/types';
import { dateToISOString, isoStringToDate } from '@/utils/dateUtils';

interface UseEventDragDropParams {
  notes: Note[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function useEventDragDrop({ notes, onUpdateNote }: UseEventDragDropParams) {
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [dragTargetIso, setDragTargetIso] = useState<string | null>(null);

  const noteById = useMemo(() => {
    const map = new Map<string, Note>();
    for (const note of notes) map.set(note.id, note);
    return map;
  }, [notes]);

  const handleDragStart = useCallback((noteId: string) => {
    setDraggingNoteId(noteId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingNoteId(null);
    setDragTargetIso(null);
  }, []);

  const handleDragOver = useCallback((date: Date, isCurrentMonth: boolean, e: React.DragEvent) => {
    if (!draggingNoteId || !isCurrentMonth) return;
    e.preventDefault();
    setDragTargetIso(dateToISOString(date));
  }, [draggingNoteId]);

  const handleDragLeave = useCallback((date: Date) => {
    const cellIso = dateToISOString(date);
    setDragTargetIso((prev) => (prev === cellIso ? null : prev));
  }, []);

  const handleDrop = useCallback((date: Date, isCurrentMonth: boolean, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingNoteId || !isCurrentMonth) {
      handleDragEnd();
      return;
    }

    const note = noteById.get(draggingNoteId);
    if (!note?.dateRange?.start) {
      handleDragEnd();
      return;
    }

    const nextStartIso = dateToISOString(date);
    if (note.dateRange.start === nextStartIso) {
      handleDragEnd();
      return;
    }

    const previousStart = isoStringToDate(note.dateRange.start);
    const nextStart = isoStringToDate(nextStartIso);
    const deltaDays = Math.round(
      (nextStart.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    let nextEndIso: string | null = null;
    if (note.dateRange.end) {
      const previousEnd = isoStringToDate(note.dateRange.end);
      nextEndIso = dateToISOString(addDays(previousEnd, deltaDays));
    }

    onUpdateNote(note.id, {
      dateRange: {
        start: nextStartIso,
        end: nextEndIso,
      },
    });

    handleDragEnd();
  }, [draggingNoteId, noteById, onUpdateNote, handleDragEnd]);

  const moveNoteByDays = useCallback((noteId: string, deltaDays: number) => {
    if (!deltaDays) return;
    const note = noteById.get(noteId);
    if (!note?.dateRange?.start) return;

    const currentStart = isoStringToDate(note.dateRange.start);
    const nextStart = addDays(currentStart, deltaDays);
    const nextStartIso = dateToISOString(nextStart);

    let nextEndIso: string | null = null;
    if (note.dateRange.end) {
      const currentEnd = isoStringToDate(note.dateRange.end);
      nextEndIso = dateToISOString(addDays(currentEnd, deltaDays));
    }

    onUpdateNote(note.id, {
      dateRange: {
        start: nextStartIso,
        end: nextEndIso,
      },
    });
  }, [noteById, onUpdateNote]);

  return {
    draggingNoteId,
    dragTargetIso,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    moveNoteByDays,
  };
}
