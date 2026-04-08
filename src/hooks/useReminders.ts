// Monitors notes and sends browser alerts for scheduled reminders before an event starts.
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Note } from '@/types';
import { useNotifications } from './useNotifications';

export interface ToastData {
  id: string;
  title: string;
  message: string;
}

export function useReminders(
  notes: Note[],
  updateNote: (id: string, updates: Partial<Note>) => void
) {
  const { sendNotification } = useNotifications();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 8000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      notes.forEach((note) => {
        if (!note.notified && note.reminder !== undefined && note.eventTime && note.dateRange?.start) {
          const [hours, minutes] = note.eventTime.split(':').map(Number);
          // Parse YYYY-MM-DD
          const [year, month, day] = note.dateRange.start.split('-').map(Number);
          
          if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            const eventDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
            const timeDiffMs = eventDate.getTime() - now.getTime();
            const timeDiffMins = Math.floor(timeDiffMs / 60000);

            // Trigger notification if within the reminder window, or missed by up to 12 hours (e.g., app was asleep)
            if (timeDiffMins <= note.reminder && timeDiffMins >= -(12 * 60)) {
              const title = `Reminder: ${note.content.split('\n')[0].substring(0, 50)}`;
              const isPast = timeDiffMins < 0;
              let message = isPast
                  ? `Started at ${note.eventTime}`
                  : `Starts at ${note.eventTime} (in ${timeDiffMins} min)`;
                  
              if (timeDiffMins === 0) {
                 message = `Starts now!`;
              }
              
              const sent = sendNotification(title, { body: message });
              if (!sent) {
                addToast(title, message);
              }
              updateNote(note.id, { notified: true });
            }
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [notes, updateNote, sendNotification, addToast]);

  return { toasts, removeToast };
}
