'use client';

import { useEffect, useState } from 'react';
import { useInstagramStore } from '@/lib/instagram/store';
import { InstagramPost } from '@/lib/instagram/types';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { format } from 'date-fns';
import { PostComments } from '@/components/posts/post-comments';
import { SentimentAnalysisView } from '@/components/comments/sentiment-analysis';
import { Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateAutomationDialog } from '@/components/automation/create-automation-dialog';
import { Badge } from '@/components/ui/badge';

interface PostDetailsProps {
  postId: string;
}

export function PostDetails({ postId }: PostDetailsProps) {
  const { posts } = useInstagramStore();
  const [post, setPost] = useState<InstagramPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentPost = posts.find((p) => p.id === postId);
    if (currentPost) {
      setPost(currentPost);
      setLoading(false);
    }
  }, [postId, posts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-4">
            <AspectRatio ratio={1}>
              <Image
                src={post.displayUrl || ''}
                alt={post.caption || 'Instagram post'}
                fill
                className="object-cover rounded-md"
              />
            </AspectRatio>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Posted {format(new Date(post.timestamp), 'PPp')}
              </p>
              {post.caption && <p className="text-sm">{post.caption}</p>}
            </div>
          </Card>

          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{post.like_count}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{post.comments_count}</p>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {post.engagement_rate.toFixed(2)}%
                </p>
                <p className="text-sm text-muted-foreground">Engagement</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
              <SentimentAnalysisView postId={post.id} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Automation</h3>
                {post.automationRule ? (
                  <Badge
                    variant={
                      post.automationRule.isActive ? 'default' : 'secondary'
                    }
                  >
                    {post.automationRule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                ) : null}
              </div>

              {post.automationRule ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Trigger:</span>{' '}
                    {post.automationRule.trigger}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Action:</span>{' '}
                    {post.automationRule.action}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    No automation rule set for this post
                  </p>
                  <CreateAutomationDialog
                    trigger={
                      <Button>
                        <Zap className="mr-2 h-4 w-4" />
                        Create Automation
                      </Button>
                    }
                    postId={post.id}
                  />
                </div>
              )}
            </div>
          </Card>

          <PostComments postId={post.id} showSentiment={false} />
        </div>
      </div>
    </div>
  );
}
