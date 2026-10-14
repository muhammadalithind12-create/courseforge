import Footer from '@/components/Footer';
import Navbar from '@/app/Navbar';
import { Suspense, type ReactNode } from 'react';

export default function ExternalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
