import { useInstagramStore } from '../instagram/store';

export const getOpenAIConfig = () => {
  const openAIKey = useInstagramStore.getState().openAIKey;
  return {
    apiKey: openAIKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    model: 'gpt-4-1106-preview', // Modelo mais recente com melhor performance
    maxTokens: 500,
    temperature: 0.3, // Baixa temperatura para respostas mais consistentes
  };
};
