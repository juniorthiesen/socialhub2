"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MessageSquare, CheckCircle, Clock } from "lucide-react";

export function TeamStats() {
  const stats = [
    {
      title: "Total Members",
      value: "8",
      icon: Users,
      description: "Active team members",
    },
    {
      title: "Responses Today",
      value: "124",
      icon: MessageSquare,
      description: "Messages handled",
    },
    {
      title: "Tasks Completed",
      value: "45",
      icon: CheckCircle,
      description: "This week",
    },
    {
      title: "Avg. Response Time",
      value: "15m",
      icon: Clock,
      description: "Per team member",
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