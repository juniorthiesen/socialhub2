export const OPENAI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  model: 'gpt-4-1106-preview', // Modelo mais recente com melhor performance
  maxTokens: 500,
  temperature: 0.3, // Baixa temperatura para respostas mais consistentes
};
