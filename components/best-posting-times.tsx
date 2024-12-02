"use client";

import { useInstagramStore } from "@/lib/instagram/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface PostingTime {
  day: string;
  hour: number;
  engagement: number;
}

export function BestPostingTimes() {
  const { posts } = useInstagramStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Garante que posts é um array
  const postsArray = Array.isArray(posts) ? posts : [];

  // Agrupa posts por dia e hora e calcula engajamento médio
  const timeEngagement = postsArray.reduce((acc: Record<string, Record<number, number[]>>, post) => {
    if (!post?.timestamp || !post?.engagement_rate) return acc;

    const date = new Date(post.timestamp);
    const day = date.toLocaleString('en-US', { weekday: 'short' });
    const hour = date.getHours();
    
    if (!acc[day]) {
      acc[day] = {};
    }
    if (!acc[day][hour]) {
      acc[day][hour] = [];
    }
    
    acc[day][hour].push(post.engagement_rate);
    return acc;
  }, {});

  // Calcula as médias e encontra os melhores horários
  const bestTimes: PostingTime[] = [];
  Object.entries(timeEngagement).forEach(([day, hours]) => {
    Object.entries(hours).forEach(([hour, rates]) => {
      const avgEngagement = rates.reduce((sum, rate) => sum + (rate || 0), 0) / rates.length;
      bestTimes.push({
        day,
        hour: parseInt(hour),
        engagement: Number(avgEngagement.toFixed(2))
      });
    });
  });

  // Ordena por engajamento e pega os 5 melhores horários
  const topTimes = bestTimes
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  // Se não houver dados suficientes, mostra horários padrão
  const defaultTimes = [
    { day: 'Mon', hour: 12, engagement: 0 },
    { day: 'Wed', hour: 15, engagement: 0 },
    { day: 'Fri', hour: 18, engagement: 0 },
    { day: 'Sat', hour: 10, engagement: 0 },
    { day: 'Sun', hour: 14, engagement: 0 },
  ];

  const timesToShow = topTimes.length > 0 ? topTimes : defaultTimes;

  const formatHour = (hour: number) => {
    return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
  };

  const formattedTimes = timesToShow.map(time => ({
    ...time,
    label: `${time.day} ${formatHour(time.hour)}`,
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Best Posting Times
        </CardTitle>
        <CardDescription>
          {topTimes.length > 0 
            ? "Optimal times to post for maximum engagement"
            : "Add more posts to see optimal posting times"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedTimes}>
              <XAxis
                dataKey="label"
                stroke={isDark ? "#888888" : "#666666"}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={isDark ? "#888888" : "#666666"}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Time
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.label}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Engagement
                            </span>
                            <span className="font-bold">
                              {payload[0].value}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="engagement">
                {formattedTimes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={isDark ? "#2563eb" : "#3b82f6"}
                    fillOpacity={entry.engagement === 0 ? 0.3 : 0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
