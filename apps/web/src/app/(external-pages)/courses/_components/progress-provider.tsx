'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createClient } from '@/supabase-clients/client';
import { getDemoStudentId } from './demo-student';

interface ProgressContextValue {
  studentId: string;
  completedIds: Set<string>;
  loading: boolean;
  markComplete: (lessonId: string) => Promise<void>;
  isComplete: (lessonId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [studentId] = useState<string>(() => getDemoStudentId());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('cf_progress')
          .select('lesson_id')
          .eq('student_id', getDemoStudentId());
        if (!cancelled && !error && data) {
          setCompletedIds(new Set(data.map((row) => row.lesson_id as string)));
        }
      } catch {
        // Progress is a demo nicety — never break the page over it.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const markComplete = useCallback(async (lessonId: string) => {
    const id = getDemoStudentId();
    setCompletedIds((prev) => new Set(prev).add(lessonId)); // optimistic
    try {
      const supabase = createClient();
      await supabase
        .from('cf_progress')
        .upsert(
          { lesson_id: lessonId, student_id: id },
          { onConflict: 'lesson_id,student_id', ignoreDuplicates: true }
        );
    } catch {
      // keep optimistic state; a refresh will reconcile
    }
  }, []);

  const isComplete = useCallback(
    (lessonId: string) => completedIds.has(lessonId),
    [completedIds]
  );

  const value = useMemo(
    () => ({ studentId, completedIds, loading, markComplete, isComplete }),
    [studentId, completedIds, loading, markComplete, isComplete]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
