// CourseForge data layer — public (login-free) course catalog + progress tracking.
// 'use server' functions so pages can kick off fetches and stream them
// inside <Suspense> (the cacheComponents-compatible pattern used by this starter).
// Reads use the anon/publishable key; RLS allows public read of published content.

'use server';

import { createSupabaseClient } from '@/supabase-clients/server';
import type { CfCourse, CfCourseDetail, CfLesson, CfModule, CfModuleWithLessons } from '@/lib/courseforge';

async function getPublicClient() {
  // The SSR client works for anonymous public reads too; RLS governs access.
  return createSupabaseClient();
}

export async function getCourses(): Promise<
  Array<CfCourse & { lesson_count: number; total_minutes: number }>
> {
  const supabase = await getPublicClient();
  const { data: courses, error } = await supabase
    .from('cf_courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const { data: lessons, error: lessonError } = await supabase
    .from('cf_lessons')
    .select('course_id, duration_minutes');
  if (lessonError) throw lessonError;

  return (courses as CfCourse[]).map((course) => {
    const courseLessons = (lessons ?? []).filter((l) => l.course_id === course.id);
    return {
      ...course,
      lesson_count: courseLessons.length,
      total_minutes: courseLessons.reduce((sum, l) => sum + (l.duration_minutes ?? 0), 0),
    };
  });
}

export async function getCourseBySlug(slug: string): Promise<CfCourseDetail | null> {
  const supabase = await getPublicClient();
  const { data: course, error } = await supabase
    .from('cf_courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error || !course) return null;

  const { data: modules, error: moduleError } = await supabase
    .from('cf_modules')
    .select('*')
    .eq('course_id', (course as CfCourse).id)
    .order('position', { ascending: true });
  if (moduleError) throw moduleError;

  const { data: lessons, error: lessonError } = await supabase
    .from('cf_lessons')
    .select('*')
    .eq('course_id', (course as CfCourse).id)
    .order('position', { ascending: true });
  if (lessonError) throw lessonError;

  const modulesWithLessons: CfModuleWithLessons[] = ((modules ?? []) as CfModule[]).map((m) => ({
    ...m,
    lessons: ((lessons ?? []) as CfLesson[]).filter((l) => l.module_id === m.id),
  }));

  return { ...(course as CfCourse), modules: modulesWithLessons };
}

export async function getLesson(lessonId: string): Promise<CfLesson | null> {
  const supabase = await getPublicClient();
  const { data, error } = await supabase.from('cf_lessons').select('*').eq('id', lessonId).single();
  if (error || !data) return null;
  return data as CfLesson;
}
