'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { analyzeSentiment } from '@/lib/sentiment';
import { Loader2 } from 'lucide-react';

interface SentimentAnalysisProps {
  postId: string;
}

export function SentimentAnalysis({ postId }: SentimentAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSentiment(postId);
      setStats(result.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze sentiment');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={handleAnalyze} className="mt-2">
          Retry Analysis
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {!stats ? (
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analyze Sentiment
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
            <div className="grid gap-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Positive</span>
                  <span>{((stats.positive / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.positive / stats.total) * 100} className="bg-green-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Neutral</span>
                  <span>{((stats.neutral / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.neutral / stats.total) * 100} className="bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Negative</span>
                  <span>{((stats.negative / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.negative / stats.total) * 100} className="bg-red-100" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total Comments:</span>
              <span>{stats.total}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Average Sentiment:</span>
              <span>{stats.averageScore.toFixed(2)}</span>
            </div>
          </div>
          <Button onClick={handleAnalyze} className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh Analysis
          </Button>
        </div>
      )}
    </Card>
  );
}
