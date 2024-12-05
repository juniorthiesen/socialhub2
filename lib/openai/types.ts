export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence?: number;
  topics?: string[];
  insights?: string[];
  summary?: string;
  temas?: string[];
  padroes?: string[];
  perguntas?: string[];
  sugestoes?: string[];
}

export interface CommentSentiment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  sentiment: SentimentAnalysis;
  like_count: number;
  hidden?: boolean;
  replies?: CommentSentiment[];
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  averageScore: number;
}
