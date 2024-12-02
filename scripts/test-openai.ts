import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente do .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testOpenAIKey() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ Chave da OpenAI não encontrada no arquivo .env.local');
    return;
  }

  console.log('🔑 Testando chave da OpenAI...');

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Tenta fazer uma chamada simples para a API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Olá! Este é um teste de conexão.'
        }
      ],
      max_tokens: 50
    });

    if (response.choices && response.choices.length > 0) {
      console.log('✅ Chave da OpenAI válida!');
      console.log('📝 Resposta de teste:', response.choices[0].message.content);
    }
  } catch (error) {
    console.error('❌ Erro ao testar a chave da OpenAI:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}

testOpenAIKey();
