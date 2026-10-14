import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, Clock, ListVideo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getCourseBySlug } from '@/data/courseforge';
import {
  formatDuration,
  formatLevel,
  formatPrice,
  type CfCourseDetail,
} from '@/lib/courseforge';
import { ProgressProvider } from '../_components/progress-provider';
import {
  ContinueLearningButton,
  CourseProgressBar,
  LessonRow,
  type LessonRef,
} from '../_components/course-progress';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const coursePromise = getCourseBySlug(slug);
    return (
      <Suspense fallback={<DetailSkeleton />}>
        <CourseDetail coursePromise={coursePromise} />
      </Suspense>
    );
  } catch {
    return notFound();
  }
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

async function CourseDetail({
  coursePromise,
}: {
  coursePromise: Promise<CfCourseDetail | null>;
}) {
  const course = await coursePromise;
  if (!course) notFound();

  const allLessons: LessonRef[] = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      modulePosition: m.position,
      position: l.position,
    }))
  );
  const totalMinutes = course.modules
    .flatMap((m) => m.lessons)
    .reduce((sum, l) => sum + l.duration_minutes, 0);

  return (
    <ProgressProvider>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All courses
        </Link>

      <div className="flex items-start gap-5">
        <span className="text-6xl" aria-hidden>
          {course.thumbnail_emoji}
        </span>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{formatLevel(course.level)}</Badge>
            <span className="text-sm font-semibold">{formatPrice(course.price_cents)}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{course.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ListVideo className="h-4 w-4" /> {allLessons.length} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {formatDuration(totalMinutes)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-card p-5">
        <CourseProgressBar lessons={allLessons} />
        <div className="mt-4">
          <ContinueLearningButton courseSlug={course.slug} lessons={allLessons} />
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight">Curriculum</h2>
      <div className="space-y-8">
        {course.modules.map((module) => (
          <section key={module.id}>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {module.position + 1}
              </span>
              {module.title}
              <span className="text-sm font-normal text-muted-foreground">
                · {module.lessons.length} lessons
              </span>
            </h3>
            <div className="space-y-2">
              {module.lessons.map((lesson, i) => (
                <LessonRow
                  key={lesson.id}
                  courseSlug={course.slug}
                  lesson={lesson}
                  index={i}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Separator className="my-10" />
      <p className="text-center text-sm text-muted-foreground">
        Progress is saved automatically in this browser — no account needed.
      </p>
      </div>
    </ProgressProvider>
  );
}
