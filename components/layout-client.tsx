"use client";

import Sidebar from '@/components/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AuthProvider } from '@/components/auth-provider';

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-muted/10">
            <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}