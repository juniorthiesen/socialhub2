'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useInstagramStore } from '@/lib/instagram/store';
import { SentimentAnalysis } from '@/components/sentiment-analysis';
import { Loader2 } from 'lucide-react';

interface CommentsViewProps {
  postId: string;
}

export function CommentsView({ postId }: CommentsViewProps) {
  const [openAIKey, setOpenAIKey] = useState('');
  const { setOpenAIKey: saveOpenAIKey } = useInstagramStore();

  const handleSaveKey = () => {
    if (openAIKey) {
      saveOpenAIKey(openAIKey);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">OpenAI Configuration</h3>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
          />
          <Button onClick={handleSaveKey} disabled={!openAIKey}>
            Save Key
          </Button>
        </div>
      </Card>

      <SentimentAnalysis postId={postId} />
    </div>
  );
}
