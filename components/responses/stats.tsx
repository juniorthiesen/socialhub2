"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Zap, Clock, ThumbsUp } from "lucide-react";

export function ResponseStats() {
  const stats = [
    {
      title: "Total Templates",
      value: "12",
      icon: MessageSquare,
      description: "Active templates",
    },
    {
      title: "Auto-Responses",
      value: "2.4k",
      icon: Zap,
      description: "This month",
    },
    {
      title: "Response Rate",
      value: "98%",
      icon: ThumbsUp,
      description: "Engagement rate",
    },
    {
      title: "Avg. Response Time",
      value: "30s",
      icon: Clock,
      description: "Response speed",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}