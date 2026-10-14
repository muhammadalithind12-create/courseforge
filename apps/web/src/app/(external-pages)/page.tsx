import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookOpen, ChartBar, GraduationCap, PlayCircle, Sparkles, Trophy } from 'lucide-react';
import { HomeCTA } from './home-cta';
import { HomeFeatures, type HomeFeature } from './home-features';
import { HomeHero } from './home-hero';

const features: HomeFeature[] = [
  {
    icon: BookOpen,
    title: 'Structured Curriculum',
    description: 'Courses organized into modules and bite-sized lessons — always know what to learn next.',
  },
  {
    icon: ChartBar,
    title: 'Progress Tracking',
    description: 'Mark lessons complete and watch your course progress bars fill up. Your progress saves automatically.',
  },
  {
    icon: PlayCircle,
    title: 'Free Previews',
    description: 'Try the first lessons of every course free before you commit. No account, no credit card.',
  },
  {
    icon: GraduationCap,
    title: 'Practical Content',
    description: 'Real-world lessons on Next.js, Supabase, and freelancing — written to be useful, not to pad a syllabus.',
  },
  {
    icon: Sparkles,
    title: 'Learn at Your Pace',
    description: 'Pick up exactly where you left off with continue-learning shortcuts on every course.',
  },
  {
    icon: Trophy,
    title: 'Built for Builders',
    description: 'Next.js 16, Supabase Postgres with Row Level Security, and a clean curriculum data model.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <Separator />
      <HomeFeatures features={features} />
      <Separator />
      <HomeCTA />
    </div>
  );
}
