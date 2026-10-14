import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Clock, ListVideo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCourses } from '@/data/courseforge';
import {
  formatDuration,
  formatLevel,
  formatPrice,
  type CfCourse,
} from '@/lib/courseforge';

export const metadata = {
  title: 'Browse Courses — CourseForge',
  description: 'Practical courses on web development and freelancing. Learn at your own pace.',
};

const levelVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'outline',
};

type CourseWithStats = CfCourse & { lesson_count: number; total_minutes: number };

export default function CoursesPage() {
  const coursesPromise = getCourses();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Browse courses</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Practical, no-fluff courses. Start learning instantly — no account needed.
        </p>
      </div>
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogGrid coursesPromise={coursesPromise} />
      </Suspense>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}

async function CatalogGrid({
  coursesPromise,
}: {
  coursesPromise: Promise<CourseWithStats[]>;
}) {
  const courses = await coursesPromise;

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-lg font-medium">Courses are being added</p>
        <p className="mt-2 text-muted-foreground">
          Run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">supabase/seeds/demo.sql</code> in
          the Supabase SQL editor to load the demo catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col">
          <CardHeader>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-4xl" aria-hidden>
                {course.thumbnail_emoji}
              </span>
              <Badge variant={levelVariant[course.level] ?? 'secondary'}>
                {formatLevel(course.level)}
              </Badge>
            </div>
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="line-clamp-3">{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ListVideo className="h-4 w-4" /> {course.lesson_count} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {formatDuration(course.total_minutes)}
            </span>
            <span className="ml-auto font-semibold text-foreground">
              {formatPrice(course.price_cents)}
            </span>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full">
              <Link href={`/courses/${course.slug}`}>
                View course <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
