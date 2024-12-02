"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInstagramStore } from "@/lib/instagram/store";
import { InstagramAPI } from "@/lib/instagram/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface InstagramAccount {
  id: string;
  username: string;
  profile_picture_url?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, setAccessToken, initializeAPI } = useInstagramStore();

  useEffect(() => {
    // Limpa o localStorage ao montar o componente
    localStorage.removeItem('instagram_token');
    localStorage.removeItem('instagram_user_id');
    setAccessToken(null);
  }, [setAccessToken]);

  // Carrega o token salvo e as contas conectadas ao montar o componente
  useEffect(() => {
    const loadSavedToken = async () => {
      if (accessToken) {
        setToken(accessToken);
        await loadConnectedAccounts(accessToken);
      }
    };

    loadSavedToken();
  }, [accessToken]);

  const loadConnectedAccounts = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await InstagramAPI.getConnectedAccounts(token);
      
      if (!response.data || response.data.length === 0) {
        setError('No Instagram business accounts found. Please make sure you have a Facebook page with a connected Instagram business account.');
        return;
      }

      const instagramAccounts = response.data
        .filter(page => page.instagram_business_account)
        .map(page => ({
          id: page.instagram_business_account.id,
          username: page.instagram_business_account.username,
          profile_picture_url: page.instagram_business_account.profile_picture_url
        }));

      setAccounts(instagramAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      // Salva o token
      setAccessToken(token);
      
      // Carrega as contas conectadas
      await loadConnectedAccounts(token);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize');
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = async (account: InstagramAccount) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Initializing API with:', {
        token,
        userId: account.id
      });

      const success = await initializeAPI(token, account.id);
      
      if (success) {
        // Verifica se o userId foi salvo corretamente
        const savedUserId = localStorage.getItem('instagram_user_id');
        console.log('Saved user ID:', savedUserId);

        // Aguarda um momento para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/');
      } else {
        setError('Failed to initialize the API. Please try again.');
      }
    } catch (error) {
      console.error('Error selecting account:', error);
      setError(error instanceof Error ? error.message : 'Failed to select account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Instagram Settings</h1>
            <p className="text-muted-foreground">
              Connect your Instagram business account to get started.
            </p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Access Token
              </label>
              <Input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your Facebook access token"
                className="w-full"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                You can get your access token from the{" "}
                <a
                  href="https://developers.facebook.com/tools/explorer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Graph API Explorer
                </a>
                .
              </p>
            </div>

            <Button type="submit" disabled={loading || !token.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Account"
              )}
            </Button>
          </form>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          {accounts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Connected Accounts</h2>
              <div className="grid gap-4">
                {accounts.map((account) => (
                  <Button
                    key={account.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAccountSelect(account)}
                    disabled={loading}
                  >
                    <img
                      src={account.profile_picture_url}
                      alt={account.username}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {account.username}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}