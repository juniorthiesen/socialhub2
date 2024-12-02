"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { testOpenAIKey } from "@/lib/openai/sentiment";
import { useInstagramStore } from "@/lib/instagram/store";

export function OpenAISettings() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { setOpenAIKey } = useInstagramStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Testa a chave da API
      const isValid = await testOpenAIKey(apiKey);
      
      if (isValid) {
        setOpenAIKey(apiKey);
        setSuccess(true);
      } else {
        setError("Invalid OpenAI API key");
      }
    } catch (error) {
      console.error("Error testing OpenAI key:", error);
      setError(error instanceof Error ? error.message : "Failed to validate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">OpenAI Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure your OpenAI API key for sentiment analysis features.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading || !apiKey.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Save API Key'
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm">
            OpenAI API key successfully validated and saved!
          </div>
        )}
      </form>
    </Card>
  );
}
