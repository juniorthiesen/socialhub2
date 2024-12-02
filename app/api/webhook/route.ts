import { NextRequest, NextResponse } from 'next/server';
import { WebhookHandler, WebhookPayload } from '@/lib/instagram/webhook';
import { useInstagramStore } from '@/lib/instagram/store';

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Handle webhook verification
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new NextResponse(challenge);
  }

  return new NextResponse('Invalid verification token', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    
    // Get the Instagram API instance and automation rules from the store
    const store = useInstagramStore.getState();
    if (!store.api) {
      throw new Error('Instagram API not initialized');
    }

    const webhookHandler = new WebhookHandler(store.api, store.automationRules);
    await webhookHandler.handleWebhook(payload);

    return new NextResponse('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}