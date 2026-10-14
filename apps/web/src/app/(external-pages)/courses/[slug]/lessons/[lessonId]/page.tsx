import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getCourseBySlug, getLesson } from '@/data/courseforge';
import type { CfCourseDetail, CfLesson } from '@/lib/courseforge';
import { ProgressProvider } from '../../../_components/progress-provider';
import { LessonContent } from '../../../_components/lesson-content';
import { MarkCompleteButton } from '../../../_components/mark-complete-button';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  try {
    const coursePromise = getCourseBySlug(slug);
    const lessonPromise = getLesson(lessonId);
    return (
      <Suspense fallback={<LessonSkeleton />}>
        <LessonView coursePromise={coursePromise} lessonPromise={lessonPromise} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
}

function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

async function LessonView({
  coursePromise,
  lessonPromise,
}: {
  coursePromise: Promise<CfCourseDetail | null>;
  lessonPromise: Promise<CfLesson | null>;
}) {
  const [course, lesson] = await Promise.all([coursePromise, lessonPromise]);
  if (!course || !lesson || lesson.course_id !== course.id) notFound();

  // Curriculum order for prev/next navigation
  const ordered = course.modules
    .slice()
    .sort((a, b) => a.position - b.position)
    .flatMap((m) => m.lessons.slice().sort((a, b) => a.position - b.position));
  const idx = ordered.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const moduleTitle = course.modules.find((m) => m.id === lesson.module_id)?.title;

  return (
    <ProgressProvider>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 flex items-center justify-between text-sm">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {course.title}
        </Link>
        <span className="text-muted-foreground">
          Lesson {idx + 1} of {ordered.length}
        </span>
      </nav>

      {moduleTitle && (
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">
          {moduleTitle}
        </p>
      )}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" /> {lesson.duration_minutes} min read
        {lesson.is_free_preview && (
          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Free preview
          </span>
        )}
      </p>

      <Separator className="my-8" />

      <LessonContent content={lesson.content} />

      <Separator className="my-8" />

      <MarkCompleteButton
        lessonId={lesson.id}
        nextLesson={
          next
            ? {
                id: next.id,
                title: next.title,
                href: `/courses/${course.slug}/lessons/${next.id}`,
              }
            : null
        }
      />

      <nav className="mt-10 grid grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/courses/${course.slug}/lessons/${prev.id}`}
            className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="h-3 w-3" /> Previous
            </span>
            <span className="mt-1 block text-sm font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${course.slug}/lessons/${next.id}`}
            className="rounded-lg border bg-card p-4 text-right transition-colors hover:border-primary/50"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Next <ArrowRight className="h-3 w-3" />
            </span>
            <span className="mt-1 block text-sm font-medium">{next.title}</span>
          </Link>
        ) : (
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-lg border bg-card p-4 text-right transition-colors hover:border-primary/50"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Finish <ArrowRight className="h-3 w-3" />
            </span>
            <span className="mt-1 block text-sm font-medium">Back to course overview</span>
          </Link>
        )}
      </nav>
      </div>
    </ProgressProvider>
  );
}
