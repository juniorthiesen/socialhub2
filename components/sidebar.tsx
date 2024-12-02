"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Zap,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Comments",
    icon: MessagesSquare,
    href: "/comments",
    color: "text-green-500",
  },
  {
    label: "Automation",
    icon: Zap,
    href: "/automation",
    color: "text-violet-500",
  },
  {
    label: "Responses",
    icon: MessageSquare,
    href: "/responses",
    color: "text-pink-700",
  },
  {
    label: "Team",
    icon: Users,
    href: "/team",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
              pathname === route.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}