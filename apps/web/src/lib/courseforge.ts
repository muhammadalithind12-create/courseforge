// CourseForge shared types + formatting helpers (no I/O here —
// data fetching lives in `@/data/courseforge` as 'use server' functions).

export interface CfCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_emoji: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price_cents: number;
  is_published: boolean;
  created_at: string;
}

export interface CfModule {
  id: string;
  course_id: string;
  title: string;
  position: number;
  created_at: string;
}

export interface CfLesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string | null;
  duration_minutes: number;
  position: number;
  is_free_preview: boolean;
  created_at: string;
}

export interface CfModuleWithLessons extends CfModule {
  lessons: CfLesson[];
}

export interface CfCourseDetail extends CfCourse {
  modules: CfModuleWithLessons[];
}

export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return 'Free';
  return `$${(priceCents / 100).toFixed(priceCents % 100 === 0 ? 0 : 2)}`;
}

export function formatLevel(level: CfCourse['level']): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
