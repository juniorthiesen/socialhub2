import OpenAI from 'openai';
import { useInstagramStore } from './instagram/store';
import { CommentSentiment, SentimentAnalysis, SentimentStats } from './openai/types';
import { Comment } from './instagram/types';

export async function analyzeSentiment(postId: string): Promise<{
  comments: CommentSentiment[];
  stats: SentimentStats;
}> {
  const { api } = useInstagramStore.getState();
  if (!api) {
    throw new Error('API não inicializada');
  }

  try {
    console.log('Buscando comentários para o post:', postId);
    
    // Verifica se o post existe
    try {
      const post = await api.getPost(postId);
      if (!post) {
        throw new Error('Post não encontrado');
      }
    } catch (error) {
      console.error('Erro ao verificar post:', error);
      throw new Error('Post não encontrado');
    }

    // Busca os comentários do post
    const commentsResponse = await api.getComments(postId);
    console.log('Resposta da API de comentários:', commentsResponse);

    if (!commentsResponse || !commentsResponse.data) {
      console.error('Nenhum comentário encontrado');
      throw new Error('Nenhum comentário encontrado para este post');
    }

    const comments = commentsResponse.data;
    console.log(`Encontrados ${comments.length} comentários`);

    // Analisa o sentimento de cada comentário
    const analyzedComments: CommentSentiment[] = await Promise.all(
      comments.map(async (comment: Comment) => {
        console.log('Analisando comentário:', comment.id);
        
        // Analisa o sentimento do comentário principal
        const mainSentiment = await analyzeText(comment.text);

        // Se houver respostas, analisa o sentimento delas também
        const analyzedReplies = comment.replies?.data
          ? await Promise.all(
              comment.replies.data.map(async (reply): Promise<CommentSentiment> => {
                console.log('Analisando resposta:', reply.id);
                return {
                  id: reply.id,
                  text: reply.text,
                  username: reply.username,
                  timestamp: reply.timestamp,
                  sentiment: await analyzeText(reply.text),
                  like_count: reply.like_count,
                  hidden: reply.hidden
                };
              })
            )
          : undefined;

        return {
          id: comment.id,
          text: comment.text,
          username: comment.username,
          timestamp: comment.timestamp,
          sentiment: mainSentiment,
          replies: analyzedReplies,
          like_count: comment.like_count,
          hidden: comment.hidden
        };
      })
    );

    console.log('Análise de comentários concluída');

    // Calcula as estatísticas gerais
    const stats = calculateStats(analyzedComments);
    console.log('Estatísticas calculadas:', stats);

    return {
      comments: analyzedComments,
      stats,
    };
  } catch (error) {
    console.error('Erro ao analisar sentimentos:', error);
    throw error;
  }
}

async function analyzeText(text: string): Promise<SentimentAnalysis> {
  const { openAIKey } = useInstagramStore.getState();
  if (!openAIKey) {
    throw new Error('OpenAI API key não configurado. Configure a chave nas configurações.');
  }

  try {
    const openai = new OpenAI({
      apiKey: openAIKey,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Por favor, analise a seguinte lista de comentários e forneça uma análise detalhada que inclua:

1. Sentimento de cada comentário (positivo, negativo ou neutro).
2. Principais temas ou tópicos mencionados.
3. Padrões ou tendências recorrentes.
4. Identificação de perguntas frequentes.
5. Sugestões baseadas nos insights obtidos.

Responda em português do Brasil no seguinte formato JSON:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": número entre -1 e 1,
  "confidence": número entre 0 e 1,
  "temas": ["tema1", "tema2", ...],
  "padroes": ["padrao1", "padrao2", ...],
  "perguntas": ["pergunta1", "pergunta2", ...],
  "sugestoes": ["sugestao1", "sugestao2", ...]
}`
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      sentiment: result.sentiment,
      score: result.score,
      confidence: result.confidence,
      temas: result.temas || [],
      padroes: result.padroes || [],
      perguntas: result.perguntas || [],
      sugestoes: result.sugestoes || []
    };
  } catch (error) {
    console.error('Erro na análise de sentimento:', error);
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0,
      temas: [],
      padroes: [],
      perguntas: [],
      sugestoes: []
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
