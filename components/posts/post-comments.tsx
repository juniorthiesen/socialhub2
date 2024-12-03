'use client';

import { useEffect, useState } from 'react';
import { useInstagramStore } from '@/lib/instagram/store';
import { Comment } from '@/lib/instagram/types';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SentimentAnalysis, SentimentAnalyzer } from '@/lib/openai/sentiment';
import { SentimentAnalysisView } from '../comments/sentiment-analysis';

interface PostCommentsProps {
  postId: string;
  showSentiment?: boolean;
}

export function PostComments({
  postId,
  showSentiment = true,
}: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { api } = useInstagramStore();

  useEffect(() => {
    const fetchComments = async () => {
      if (!api) return;
      setIsLoading(true);
      try {
        const response = await api.getComments(postId);
        setComments(response.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [api, postId]);

  const handleAnalyzeComments = async () => {
    if (!comments.length) return;

    setIsAnalyzing(true);
    try {
      const analyzer = new SentimentAnalyzer();
      const result = await analyzer.analyzeComments(
        comments.slice(0, 100).map((c) => ({
          text: c.text,
          username: c.username,
        }))
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing comments:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!comments.length) {
    return (
      <Card className="p-4">
        <p className="text-center text-sm text-muted-foreground">
          No comments yet
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>

        {showSentiment && (
          <SentimentAnalysisView
            analysis={analysis}
            isLoading={isAnalyzing}
            onAnalyze={handleAnalyzeComments}
            postId=""
          />
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">@{comment.username}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.text}</p>
                {comment.like_count > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {comment.like_count} likes
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
