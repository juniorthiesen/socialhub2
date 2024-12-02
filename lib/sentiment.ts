import { Comment } from './instagram/types';
import { useInstagramStore } from './instagram/store';

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

interface CommentSentiment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  sentiment: SentimentAnalysis;
  replies?: CommentSentiment[];
}

interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  averageScore: number;
}

export async function analyzeSentiment(postId: string): Promise<{
  comments: CommentSentiment[];
  stats: SentimentStats;
}> {
  const { api } = useInstagramStore.getState();
  if (!api) {
    throw new Error('API not initialized');
  }

  try {
    // Busca os comentários do post
    const { data: comments } = await api.getComments(postId);

    // Analisa o sentimento de cada comentário
    const analyzedComments = await Promise.all(
      comments.map(async (comment: Comment) => {
        // Analisa o sentimento do comentário principal
        const mainSentiment = await analyzeText(comment.text);

        // Se houver respostas, analisa o sentimento delas também
        const replies = comment.replies?.data
          ? await Promise.all(
              comment.replies.data.map(async (reply) => ({
                ...reply,
                sentiment: await analyzeText(reply.text),
              }))
            )
          : undefined;

        return {
          ...comment,
          sentiment: mainSentiment,
          replies,
        };
      })
    );

    // Calcula as estatísticas gerais
    const stats = calculateStats(analyzedComments);

    return {
      comments: analyzedComments,
      stats,
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
}

async function analyzeText(text: string): Promise<SentimentAnalysis> {
  const { openAIKey } = useInstagramStore.getState();
  if (!openAIKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze the sentiment of the following text and respond with a JSON object containing: sentiment (positive, negative, or neutral), score (-1 to 1), and confidence (0 to 1).',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze sentiment with OpenAI');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      sentiment: result.sentiment,
      score: result.score,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0,
    };
  }
}

function calculateStats(comments: CommentSentiment[]): SentimentStats {
  const stats = {
    positive: 0,
    negative: 0,
    neutral: 0,
    total: comments.length,
    averageScore: 0,
  };

  let totalScore = 0;

  comments.forEach((comment) => {
    // Conta o sentimento do comentário principal
    switch (comment.sentiment.sentiment) {
      case 'positive':
        stats.positive++;
        break;
      case 'negative':
        stats.negative++;
        break;
      case 'neutral':
        stats.neutral++;
        break;
    }
    totalScore += comment.sentiment.score;

    // Conta o sentimento das respostas
    comment.replies?.forEach((reply) => {
      switch (reply.sentiment.sentiment) {
        case 'positive':
          stats.positive++;
          break;
        case 'negative':
          stats.negative++;
          break;
        case 'neutral':
          stats.neutral++;
          break;
      }
      totalScore += reply.sentiment.score;
      stats.total++;
    });
  });

  stats.averageScore = totalScore / stats.total;

  return stats;
}
