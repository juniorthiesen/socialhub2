"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { InstagramAPI } from "@/lib/instagram/api";
import { useInstagramStore } from "@/lib/instagram/store";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FacebookPage = {
  id: string;
  name: string;
  instagram_business_account?: {
    id: string;
    username: string;
    profile_picture_url: string;
    followers_count: number;
    media_count: number;
  };
};

export function AuthSettings() {
  const { initializeAPI, fetchAccount } = useInstagramStore();
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<FacebookPage[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!accessToken) {
        throw new Error("Please enter your access token");
      }

      // Busca as contas conectadas primeiro
      const response = await InstagramAPI.getConnectedAccounts(accessToken);
      console.log('Connected accounts:', response);

      if (!response.data || response.data.length === 0) {
        throw new Error("No Facebook pages found. Please make sure you have at least one Facebook page.");
      }

      // Filtra apenas as contas que têm Instagram Business conectado
      const businessAccounts = response.data.filter(page => page.instagram_business_account);
      if (businessAccounts.length === 0) {
        throw new Error("No Instagram Business accounts found. Please make sure you have connected your Instagram account to your Facebook page.");
      }

      setConnectedAccounts(businessAccounts);
      setSelectedAccountId(businessAccounts[0].instagram_business_account!.id);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      console.error('Connection error:', errorMessage);
      
      // Limpa as credenciais em caso de erro
      localStorage.removeItem('instagram_token');
      localStorage.removeItem('instagram_user_id');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = async (accountId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const selectedAccount = connectedAccounts.find(
        page => page.instagram_business_account?.id === accountId
      );

      if (!selectedAccount || !selectedAccount.instagram_business_account) {
        throw new Error("Selected account not found");
      }

      // Salva no localStorage
      localStorage.setItem('instagram_token', accessToken);
      localStorage.setItem('instagram_user_id', selectedAccount.instagram_business_account.id);

      // Inicializa a API
      const success = await initializeAPI(accessToken, selectedAccount.instagram_business_account.id);
      
      if (!success) {
        throw new Error("Failed to initialize the API. Please check your token and try again.");
      }

      await fetchAccount();
      setAccessToken("");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      console.error('Account selection error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('instagram_token');
    localStorage.removeItem('instagram_user_id');
    setConnectedAccounts([]);
    setSelectedAccountId("");
    setAccessToken("");
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram Connection</CardTitle>
        <CardDescription>
          Connect your Instagram Business account to manage your posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter your access token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        {connectedAccounts.length > 0 ? (
          <div className="space-y-4">
            <Select
              value={selectedAccountId}
              onValueChange={handleAccountSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {connectedAccounts.map((page) => (
                  <SelectItem
                    key={page.instagram_business_account?.id}
                    value={page.instagram_business_account?.id || ""}
                  >
                    {page.name} ({page.instagram_business_account?.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isLoading || !accessToken}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Account"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}