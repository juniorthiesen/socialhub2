"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { Clock, BarChart2, Image, Video, Images } from "lucide-react";

interface PerformanceMetricsProps {
  metrics: {
    best_posting_times: {
      day: string;
      hour: number;
      engagement: number;
    }[];
    content_performance: {
      type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
      count: number;
      avg_engagement: number;
      avg_reach: number;
      avg_saves: number;
    }[];
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatHour = (hour: number) => {
    return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
  };

  const contentTypeIcons = {
    'IMAGE': Image,
    'VIDEO': Video,
    'CAROUSEL_ALBUM': Images,
  };

  const bestTimes = metrics.best_posting_times.map(time => ({
    ...time,
    label: `${time.day} ${formatHour(time.hour)}`,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Best Posting Times
          </CardTitle>
          <CardDescription>
            Optimal times to post for maximum engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestTimes}>
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
                              <span className="font-bold text-sm">
                                {payload[0].payload.label}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Engagement
                              </span>
                              <span className="font-bold text-sm">
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
                <Bar
                  dataKey="engagement"
                  radius={[4, 4, 0, 0]}
                >
                  {bestTimes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Content Performance
          </CardTitle>
          <CardDescription>
            Performance metrics by content type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.content_performance.map((type) => {
              const Icon = contentTypeIcons[type.type];
              return (
                <div
                  key={type.type}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-md bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {type.type === 'CAROUSEL_ALBUM' ? 'Carousel' : type.type.charAt(0) + type.type.slice(1).toLowerCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {type.count} posts
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-right">
                    <div>
                      <p className="text-sm font-medium">
                        {type.avg_engagement.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Engagement
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {type.avg_reach.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reach
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {type.avg_saves.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Saves
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}