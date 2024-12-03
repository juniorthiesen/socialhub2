'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { useInstagramStore } from '@/lib/instagram/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SiteHeader() {
  const { account } = useInstagramStore();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('instagram_token');
    localStorage.removeItem('instagram_user_id');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-3">
          <Instagram className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Social Hub</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={account.profile_picture_url}
                      alt={account.username}
                    />
                    <AvatarFallback>
                      {account.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      @{account.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {account.followers_count.toLocaleString()} followers
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => router.push('/settings')}>
              <Instagram className="mr-2 h-4 w-4" />
              Connect Instagram
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
