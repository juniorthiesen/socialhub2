"use client";

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";
import { useInstagramStore } from "@/lib/instagram/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SentimentAnalysis, analyzeSentiment } from '@/lib/openai/sentiment';

interface SentimentAnalysisProps {
  postId: string;
}

export function SentimentAnalysisView({ postId }: SentimentAnalysisProps) {
  const { hasOpenAIEnabled, setOpenAIKey } = useInstagramStore();
  const [apiKey, setApiKey] = useState("");
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeSentiment(postId);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!hasOpenAIEnabled()) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">AI-Powered Sentiment Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get powerful insights about your comments using OpenAI's advanced sentiment analysis.
            To enable this feature, please add your OpenAI API key below.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={() => setOpenAIKey(apiKey)}>Enable</Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Don't have an API key? Get one at{" "}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenAI's platform
          </a>
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing comments...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Analyze the sentiment of comments on this post
            </p>
          </div>
          <Button onClick={handleAnalyze}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Analyze Comments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
        <Button variant="outline" size="sm" onClick={handleAnalyze}>
          Refresh Analysis
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Badge variant={analysis.sentiment === 'positive' ? 'default' : analysis.sentiment === 'negative' ? 'destructive' : 'secondary'}>
            {analysis.sentiment.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Score: {analysis.score.toFixed(1)}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Key Topics:</p>
          <div className="flex flex-wrap gap-2">
            {analysis.topics.map((topic, index) => (
              <Badge key={index} variant="outline">{topic}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Summary:</p>
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>
        </div>

        {analysis.insights && analysis.insights.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Key Insights:</p>
            <ul className="list-disc list-inside space-y-1">
              {analysis.insights.map((insight, index) => (
                <li key={index} className="text-sm text-muted-foreground">{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
