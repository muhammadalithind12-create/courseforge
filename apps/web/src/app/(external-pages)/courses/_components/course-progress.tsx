'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from './progress-provider';
import type { CfLesson } from '@/lib/courseforge';

export interface LessonRef {
  id: string;
  title: string;
  modulePosition: number;
  position: number;
}

/** Sort lessons in curriculum order (module, then lesson position). */
export function sortLessons(lessons: LessonRef[]): LessonRef[] {
  return [...lessons].sort(
    (a, b) => a.modulePosition - b.modulePosition || a.position - b.position
  );
}

/** Course-level progress bar + completed/total count. */
export function CourseProgressBar({
  lessons,
  className,
}: {
  lessons: LessonRef[];
  className?: string;
}) {
  const { completedIds, loading } = useProgress();
  const done = lessons.filter((l) => completedIds.has(l.id)).length;
  const pct = lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100);

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">
          {loading ? 'Loading progress…' : `${done} of ${lessons.length} lessons complete`}
        </span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

/** "Continue learning" — jumps to the first incomplete lesson. */
export function ContinueLearningButton({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: LessonRef[];
}) {
  const { isComplete, loading } = useProgress();
  const ordered = sortLessons(lessons);
  const next = ordered.find((l) => !isComplete(l.id)) ?? ordered[0];
  if (!next) return null;

  const label = loading
    ? 'Start learning'
    : ordered.some((l) => isComplete(l.id))
      ? 'Continue learning'
      : 'Start learning';

  return (
    <Button asChild size="lg">
      <Link href={`/courses/${courseSlug}/lessons/${next.id}`}>
        <PlayCircle className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

/** One row in the curriculum list, with completion check + free-preview badge. */
export function LessonRow({
  courseSlug,
  lesson,
  index,
}: {
  courseSlug: string;
  lesson: Pick<CfLesson, 'id' | 'title' | 'duration_minutes' | 'is_free_preview'>;
  index: number;
}) {
  const { isComplete } = useProgress();
  const done = isComplete(lesson.id);

  return (
    <Link
      href={`/courses/${courseSlug}/lessons/${lesson.id}`}
      className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/50"
    >
      {done ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <Circle className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
      )}
      <span className="flex-1">
        <span className={`block text-sm font-medium ${done ? 'text-muted-foreground line-through' : ''}`}>
          <span className="mr-2 text-muted-foreground">{index + 1}.</span>
          {lesson.title}
        </span>
      </span>
      {lesson.is_free_preview && (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          Free preview
        </span>
      )}
      <span className="text-xs text-muted-foreground">{lesson.duration_minutes} min</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
