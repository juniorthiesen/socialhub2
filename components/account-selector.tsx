"use client";

import { useInstagramStore } from "@/lib/instagram/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InstagramAccount } from "@/lib/instagram/types";

export function AccountSelector() {
  const { account, api } = useInstagramStore();

  if (!api || !account) return null;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={account.profile_picture_url} alt={account.username} />
        <AvatarFallback>{account.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{account.username}</span>
        <span className="text-xs text-muted-foreground">
          {account.followers_count.toLocaleString()} followers
        </span>
      </div>
    </div>
  );
}
