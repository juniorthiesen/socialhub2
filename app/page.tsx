'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { PostsGrid } from '@/components/posts-grid';
import { EngagementStats } from '@/components/engagement-stats';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PostFilters } from '@/components/post-filters';
import { AccountSelector } from '@/components/account-selector';
import { ContentPerformance } from '@/components/content-performance';
import { BestPostingTimes } from '@/components/best-posting-times';
import { Card } from '@/components/ui/card';

function LoadingStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
}

function LoadingPerformance() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-[300px]" />
      ))}
    </div>
  );
}

function LoadingPosts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[400px]" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="border-b">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Instagram Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and analyze your Instagram posts with advanced
                  automation rules.
                </p>
              </div>
              <AccountSelector />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-6 space-y-8">
          {/* Dashboard Header Stats */}
          <section>
            <Suspense fallback={<Skeleton className="h-20" />}>
              <DashboardHeader />
            </Suspense>
          </section>

          {/* Engagement Stats */}
          <section>
            <Suspense fallback={<LoadingStats />}>
              <EngagementStats />
            </Suspense>
          </section>

          {/* Performance Analysis */}
          <section className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<LoadingPerformance />}>
              <ContentPerformance />
            </Suspense>
            <Suspense fallback={<LoadingPerformance />}>
              <BestPostingTimes />
            </Suspense>
          </section>

          {/* Posts Section */}
          <section className="space-y-6">
            <Card className="p-6">
              <PostFilters />
            </Card>
            <Suspense fallback={<LoadingPosts />}>
              <PostsGrid />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
