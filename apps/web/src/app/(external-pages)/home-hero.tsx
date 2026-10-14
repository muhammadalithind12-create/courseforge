import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
      <Badge variant="secondary" className="px-3 py-1">
        Online Course Platform
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-3xl">
        Learn skills that{' '}
        <span className="text-primary">pay the bills</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl">
        Practical, no-fluff courses on web development and freelancing. Track your progress lesson by lesson — no account needed.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/courses">
            Browse courses <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="https://github.com/muhammadalithind12-create/courseforge" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" /> View on GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
}
