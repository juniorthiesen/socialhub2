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
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao analisar sentimento');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={handleAnalyze} className="mt-2">
          Tentar Novamente
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {!stats ? (
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analisar Sentimentos
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Análise de Sentimentos</h3>
            <div className="grid gap-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Positivo</span>
                  <span>{((stats.stats.positive / stats.stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.stats.positive / stats.stats.total) * 100} className="bg-green-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Neutro</span>
                  <span>{((stats.stats.neutral / stats.stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.stats.neutral / stats.stats.total) * 100} className="bg-gray-100" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Negativo</span>
                  <span>{((stats.stats.negative / stats.stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(stats.stats.negative / stats.stats.total) * 100} className="bg-red-100" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            {stats.comments[0]?.sentiment.temas?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Principais Temas</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {stats.comments[0].sentiment.temas.map((tema: string, index: number) => (
                    <li key={index}>{tema}</li>
                  ))}
                </ul>
              </div>
            )}

            {stats.comments[0]?.sentiment.padroes?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Padrões Identificados</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {stats.comments[0].sentiment.padroes.map((padrao: string, index: number) => (
                    <li key={index}>{padrao}</li>
                  ))}
                </ul>
              </div>
            )}

            {stats.comments[0]?.sentiment.perguntas?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Perguntas Frequentes</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {stats.comments[0].sentiment.perguntas.map((pergunta: string, index: number) => (
                    <li key={index}>{pergunta}</li>
                  ))}
                </ul>
              </div>
            )}

            {stats.comments[0]?.sentiment.sugestoes?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Sugestões</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {stats.comments[0].sentiment.sugestoes.map((sugestao: string, index: number) => (
                    <li key={index}>{sugestao}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total de Comentários:</span>
              <span>{stats.stats.total}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Sentimento Médio:</span>
              <span>{stats.stats.averageScore.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={handleAnalyze} className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Atualizar Análise
          </Button>
        </div>
      )}
    </Card>
  );
}
