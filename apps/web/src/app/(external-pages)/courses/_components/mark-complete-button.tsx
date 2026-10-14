'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from './progress-provider';

export function MarkCompleteButton({
  lessonId,
  nextLesson,
}: {
  lessonId: string;
  nextLesson: { id: string; title: string; href: string } | null;
}) {
  const { isComplete, markComplete } = useProgress();
  const [saving, setSaving] = useState(false);
  const done = isComplete(lessonId);

  const handleClick = async () => {
    setSaving(true);
    await markComplete(lessonId);
    setSaving(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <p className="flex items-center gap-2 font-medium text-green-800 dark:text-green-200">
          <CheckCircle2 className="h-5 w-5" /> Lesson complete — nice work!
        </p>
        {nextLesson && (
          <Button asChild>
            <Link href={nextLesson.href}>
              Next: {nextLesson.title} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={handleClick} disabled={saving} size="lg">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as complete
          </>
        )}
      </Button>
      {nextLesson && (
        <Link
          href={nextLesson.href}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Skip to next lesson →
        </Link>
      )}
    </div>
  );
}
