'use client';

import { Card } from '@/components/ui/card';
import { InstagramPost, InstagramInsights } from '@/lib/instagram/types';
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
} from 'lucide-react';

interface PostInsightsProps {
  post: InstagramPost;
  insights: InstagramInsights | null;
}

export function PostInsights({ post, insights }: PostInsightsProps) {
  const stats = [
    {
      label: 'Likes',
      value: post.like_count,
      icon: Heart,
      change: insights?.likes_change || 0,
    },
    {
      label: 'Comments',
      value: post.comments_count,
      icon: MessageCircle,
      change: insights?.comments_change || 0,
    },
    {
      label: 'Shares',
      value: insights?.shares || 0,
      icon: Share2,
      change: insights?.shares_change || 0,
    },
    {
      label: 'Saves',
      value: insights?.saves || 0,
      icon: Bookmark,
      change: insights?.saves_change || 0,
    },
    {
      label: 'Reach',
      value: insights?.reach || 0,
      icon: Eye,
      change: insights?.reach_change || 0,
    },
    {
      label: 'Engagement Rate',
      value: `${post.engagement_rate.toFixed(2)}%`,
      icon: TrendingUp,
      change: insights?.engagement_change || 0,
    },
  ];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            {stat.change !== 0 && (
              <p
                className={`text-xs ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {stat.change > 0 ? '+' : ''}
                {stat.change}%
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
