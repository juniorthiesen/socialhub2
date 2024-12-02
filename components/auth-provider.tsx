"use client";

import { useEffect, useState } from "react";
import { useInstagramStore } from "@/lib/instagram/store";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAPI, accessToken, account, disconnect } = useInstagramStore();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('instagram_token');
    const userId = localStorage.getItem('instagram_user_id');
    let isRedirecting = false;

    const initializeAuth = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Stored credentials:', { 
            hasToken: !!token, 
            hasUserId: !!userId,
            userId: userId?.substring(0, 10) + '...',
            pathname,
            hasAccount: !!account
          });
        }

        // Se já estiver conectado e estiver na página de configurações, redireciona para home
        if (token && userId && account && pathname === '/settings') {
          if (!isRedirecting) {
            isRedirecting = true;
            router.push('/');
          }
          setIsInitializing(false);
          return;
        }

        // Se não houver credenciais e não estiver na página de configurações, redireciona
        if ((!token || !userId) && pathname !== '/settings') {
          if (!isRedirecting) {
            isRedirecting = true;
            disconnect(); // Garante que o estado está limpo
            router.push('/settings');
            toast({
              title: "Authentication Required",
              description: "Please connect your Instagram business account to continue.",
              variant: "destructive",
            });
          }
          setIsInitializing(false);
          return;
        }

        // Se estiver na página de configurações, não tenta inicializar
        if (pathname === '/settings') {
          setIsInitializing(false);
          return;
        }

        // Tenta inicializar apenas se houver credenciais e não estiver já inicializado
        if (token && userId && !account) {
          const success = await initializeAPI(token, userId);
          
          if (success) {
            toast({
              title: "Connected",
              description: "Successfully connected to Instagram.",
            });
          } else if (!isRedirecting) {
            // Se falhou, redireciona para as configurações
            isRedirecting = true;
            disconnect(); // Garante que o estado está limpo
            router.push('/settings');
            toast({
              title: "Connection Failed",
              description: "Could not connect to Instagram. Please try connecting again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        
        // Redireciona para as configurações em caso de erro
        if (pathname !== '/settings' && !isRedirecting) {
          isRedirecting = true;
          disconnect(); // Garante que o estado está limpo
          router.push('/settings');
          toast({
            title: "Connection Error",
            description: error instanceof Error ? error.message : "Failed to connect to Instagram",
            variant: "destructive",
          });
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [pathname, account]); // Adicionado account como dependência para reagir a mudanças no estado da conta

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Connecting to Instagram...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
