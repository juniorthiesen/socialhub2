"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstagramStore } from "@/lib/instagram/store";
import { ArrowUp, Users, Heart, MessageCircle, BarChart } from "lucide-react";
import { useEffect } from "react";

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: string;
  icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <ArrowUp className="h-4 w-4 text-green-500 inline mr-1" />
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function EngagementStats() {
  const { stats, account, fetchStats } = useInstagramStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Formata os números para exibição
  const formatNumber = (num: number | undefined | null) => {
    if (!num) return "0";
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const formatEngagement = (num: number | undefined | null) => {
    if (!num) return "0%";
    return num.toFixed(2) + "%";
  };

  const calculateDailyAverage = (total: number | undefined | null) => {
    if (!total) return 0;
    return total / 30;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Engagement Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Followers"
          value={formatNumber(account?.followers_count)}
          change={account?.followers_gained ? `+${formatNumber(account.followers_gained)} new` : undefined}
          icon={Users}
        />
        <StatCard
          title="Total Likes"
          value={formatNumber(stats?.totalLikes)}
          change={stats?.totalLikes ? `${formatNumber(calculateDailyAverage(stats.totalLikes))} per day` : undefined}
          icon={Heart}
        />
        <StatCard
          title="Total Comments"
          value={formatNumber(stats?.totalComments)}
          change={stats?.totalComments ? `${formatNumber(calculateDailyAverage(stats.totalComments))} per day` : undefined}
          icon={MessageCircle}
        />
        <StatCard
          title="Avg. Engagement"
          value={formatEngagement(stats?.avgEngagement)}
          change={stats?.engagement_change ? `${stats.engagement_change > 0 ? '+' : ''}${stats.engagement_change.toFixed(1)}% from last month` : undefined}
          icon={BarChart}
        />
      </div>
    </div>
  );
}