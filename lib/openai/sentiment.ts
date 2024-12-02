import OpenAI from 'openai';
import { useInstagramStore } from '../instagram/store';

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  topics: string[];
  insights: string[];
  summary: string;
}

export class SentimentAnalyzer {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = useInstagramStore.getState().openAIKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async analyzeComments(comments: { text: string; username: string }[]): Promise<SentimentAnalysis> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Sentiment analysis is disabled.');
    }

    try {
      const prompt = `Analyze these Instagram comments and provide a JSON response with the following structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": number between -1 and 1,
  "topics": array of most discussed topics,
  "insights": array of key insights about user sentiment and feedback,
  "summary": brief summary of overall sentiment and main points
}

Comments to analyze:
${comments.map(c => `@${c.username}: ${c.text}`).join('\n')}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze Instagram comments and provide insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0,
        topics: result.topics || [],
        insights: result.insights || [],
        summary: result.summary || 'No analysis available'
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }
}

export const analyzer = new SentimentAnalyzer();

export async function analyzeSentiment(postId: string): Promise<SentimentAnalysis> {
  const store = useInstagramStore.getState();
  const post = store.posts.find(p => p.id === postId);
  
  if (!post) {
    throw new Error('Post not found');
  }

  const response = await store.api.getComments(postId);
  if (!response || !response.data || response.data.length === 0) {
    throw new Error('No comments found for analysis');
  }

  const commentData = response.data.map(comment => ({
    text: comment.text,
    username: comment.username
  }));

  return analyzer.analyzeComments(commentData);
}
