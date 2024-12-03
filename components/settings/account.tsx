'use client';

import { AuthSettings } from '@/components/settings/auth-settings';
import { WebhookSettings } from '@/components/settings/webhook-settings';

export function AccountSettings() {
  return (
    <div className="space-y-6">
      <AuthSettings />
      <WebhookSettings />
    </div>
  );
}
