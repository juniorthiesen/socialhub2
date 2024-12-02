"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useInstagramStore } from "@/lib/instagram/store";
import { Settings2, Instagram } from "lucide-react";
import { useEffect } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const { account, initializeAPI, fetchAccount } = useInstagramStore();

  useEffect(() => {
    const token = localStorage.getItem('instagram_token');
    const userId = localStorage.getItem('instagram_user_id');
    
    if (token && userId) {
      initializeAPI(token, userId).catch(error => {
        console.error('Failed to initialize API:', error);
        // Se houver erro de autenticação, redireciona para login
        if (error.message.includes('authentication') || error.message.includes('token')) {
          localStorage.removeItem('instagram_token');
          localStorage.removeItem('instagram_user_id');
          router.push('/login');
        }
      });
    }
  }, [initializeAPI, router]);

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Instagram className="h-8 w-8 text-pink-500" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {account?.username ? `@${account.username}` : 'Instagram Dashboard'}
          </h2>
          {account && (
            <p className="text-sm text-muted-foreground">
              {account.followers_count.toLocaleString()} followers • {account.media_count.toLocaleString()} posts
            </p>
          )}
        </div>
      </div>
      <Button variant="outline" size="icon" onClick={() => router.push('/settings')}>
        <Settings2 className="h-4 w-4" />
      </Button>
    </div>
  );
}