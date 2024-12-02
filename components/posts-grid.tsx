"use client";

import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, TrendingUp, Zap, ExternalLink, MessageSquare, Calendar } from "lucide-react";
import { useInstagramStore } from "@/lib/instagram/store";
import { useEffect, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateAutomationDialog } from "@/components/automation/create-automation-dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { InstagramPost } from "@/lib/instagram/types";
import { useSortedPosts } from "@/lib/hooks/use-sorted-posts";

const POSTS_PER_PAGE = 9;

export function PostsGrid() {
  const { 
    isLoading,
    error,
    fetchPosts,
    dateFilter,
    paging
  } = useInstagramStore();

  const sortedPosts = useSortedPosts();
  
  const observer = useRef<IntersectionObserver>();
  
  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && paging?.next) {
          fetchPosts(dateFilter, paging.cursors?.after);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, paging?.next, fetchPosts, dateFilter, paging?.cursors?.after]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, dateFilter]);

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Connected Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post, index) => (
          <Card 
            key={post.id} 
            className="overflow-hidden"
            ref={index === sortedPosts.length - 1 ? lastPostRef : null}
          >
            <Link href={`/posts/${post.id}`}>
              <div className="p-4">
                <AspectRatio ratio={1}>
                  <Image
                    src={post.displayUrl || ''}
                    alt={post.caption || "Instagram post"}
                    fill
                    className="object-cover rounded-md transition-transform hover:scale-105"
                  />
                </AspectRatio>
              </div>
            </Link>
            <div className="p-4 pt-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{post.like_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments_count}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {post.engagement_rate.toFixed(1)}%
                </Badge>
              </div>

              {post.caption && (
                <p className="text-sm line-clamp-2 mb-2 text-muted-foreground">
                  {post.caption}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(post.timestamp), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={post.permalink} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <CreateAutomationDialog postId={post.id} />
                </div>
              </div>
            </div>
          </Card>
        ))}
        {isLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-4">
                  <AspectRatio ratio={1}>
                    <Skeleton className="h-full w-full" />
                  </AspectRatio>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}