'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function TestOpenAIPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      if (!openAIKey) {
        throw new Error('OpenAI API key não configurada');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente amigável.',
            },
            {
              role: 'user',
              content: 'Diga "Olá! A conexão com a OpenAI está funcionando!" em português do Brasil.',
            },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API da OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (err) {
      console.error('Erro ao testar conexão:', err);
      setError(err instanceof Error ? err.message : 'Erro ao conectar com a OpenAI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Teste de Conexão OpenAI</h1>
            <p className="text-muted-foreground">
              Clique no botão abaixo para testar a conexão com a API da OpenAI.
            </p>
          </div>

          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Testar Conexão
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              <p className="font-semibold">Erro:</p>
              <p>{error}</p>
            </div>
          )}

          {response && (
            <div className="p-4 bg-green-50 text-green-600 rounded-md">
              <p className="font-semibold">Resposta da OpenAI:</p>
              <p>{response}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
