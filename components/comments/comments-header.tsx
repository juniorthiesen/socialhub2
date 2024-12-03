'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useInstagramStore } from '@/lib/instagram/store';

export function CommentsHeader() {
  const { fetchPosts } = useInstagramStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to comments across all your posts
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => fetchPosts()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}
