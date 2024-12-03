'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Webhook, Bell, Copy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/lib/instagram/config';

export function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [verifyToken, setVerifyToken] = useState(config.webhookToken || '');
  const { toast } = useToast();
  const webhookEndpoint = `${config.appUrl}/api/webhook`;

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/me/subscribed_apps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: localStorage.getItem('instagram_token'),
          callback_url: webhookEndpoint,
          fields: ['mentions', 'comments'],
          verify_token: verifyToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to webhooks');
      }

      toast({
        title: 'Success',
        description: 'Successfully subscribed to Instagram webhooks',
      });
    } catch (error) {
      console.error('Error subscribing to webhooks:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe to webhooks',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Configuration</CardTitle>
        <CardDescription>
          Set up webhooks to receive real-time updates from Instagram
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Configure these webhook settings in your Facebook App Dashboard and
            use the values below
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Callback URL</Label>
          <div className="flex gap-2">
            <Input value={webhookEndpoint} readOnly />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(webhookEndpoint);
                toast({
                  description: 'Callback URL copied to clipboard',
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Verify Token</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="Enter your verify token"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This token should match the INSTAGRAM_WEBHOOK_VERIFY_TOKEN in your
            environment variables
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={!verifyToken}
        >
          <Webhook className="h-4 w-4 mr-2" />
          Subscribe to Webhooks
        </Button>
      </CardContent>
    </Card>
  );
}
