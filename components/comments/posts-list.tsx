'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useInstagramStore } from '@/lib/instagram/store';
import { InstagramPost } from '@/lib/instagram/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Heart, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PostsListProps {
  selectedPostId: string | null;
  onPostSelect: (postId: string) => void;
}

const POSTS_PER_PAGE = 10;

export function PostsList({ selectedPostId, onPostSelect }: PostsListProps) {
  const { posts, isLoading, error, fetchPosts } = useInstagramStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedPosts, setDisplayedPosts] = useState<InstagramPost[]>([]);
  const [after] = useState<string | undefined>();
  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await fetchPosts(undefined, after);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, [fetchPosts, after]);

  useEffect(() => {
    // Garante que posts é um array
    const postsArray = Array.isArray(posts) ? posts : [];

    const filteredPosts = postsArray.filter(
      (post) =>
        post?.caption
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase() || '') || false
    );

    const paginatedPosts = filteredPosts.slice(0, page * POSTS_PER_PAGE);
    setDisplayedPosts(paginatedPosts);
    setHasMore(paginatedPosts.length < filteredPosts.length);
  }, [posts, page, searchQuery]);

  if (error) {
    return (
      <Card className="p-6 text-center text-red-500">
        <p>Error loading posts: {error}</p>
        <button
          onClick={() => fetchPosts()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </Card>
    );
  }

  if (isLoading && displayedPosts.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {displayedPosts.map((post, index) => (
          <Card
            key={post.id}
            ref={index === displayedPosts.length - 1 ? lastPostRef : null}
            className={cn(
              'p-4 cursor-pointer transition-colors hover:bg-accent',
              selectedPostId === post.id && 'bg-accent'
            )}
            onClick={() => onPostSelect(post.id)}
          >
            <div className="flex gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-md">
                <Image
                  src={post.displayUrl || post.media_url || ''}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-cover"
                  priority={index < 3}
                  sizes="(max-width: 96px) 100vw, 96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2 mb-2">
                  {post.caption || 'No caption'}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {post.like_count || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments_count || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(post.timestamp), 'MMM d, yyyy')}
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {post.media_type}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
