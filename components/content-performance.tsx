"use client";

import { useInstagramStore } from "@/lib/instagram/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Image, PlayCircle, Images, BarChart2 } from "lucide-react";
import { InstagramPost } from "@/lib/instagram/types";

interface ContentTypeMetrics {
  count: number;
  likes: number;
  comments: number;
  engagement: number;
}

interface ContentPerformance {
  IMAGE: ContentTypeMetrics;
  VIDEO: ContentTypeMetrics;
  CAROUSEL_ALBUM: ContentTypeMetrics;
}

const DEFAULT_METRICS: ContentTypeMetrics = {
  count: 0,
  likes: 0,
  comments: 0,
  engagement: 0
};

const DEFAULT_PERFORMANCE: ContentPerformance = {
  IMAGE: { ...DEFAULT_METRICS },
  VIDEO: { ...DEFAULT_METRICS },
  CAROUSEL_ALBUM: { ...DEFAULT_METRICS }
};

export function ContentPerformance() {
  const { posts } = useInstagramStore();

  // Garante que posts é um array
  const postsArray = Array.isArray(posts) ? posts : [];

  const metrics = postsArray.reduce((acc: ContentPerformance, post: InstagramPost) => {
    // Inicializa o acumulador se for o primeiro item
    if (!acc) {
      acc = JSON.parse(JSON.stringify(DEFAULT_PERFORMANCE));
    }

    // Garante que o tipo de mídia existe no acumulador
    const mediaType = post.media_type as keyof ContentPerformance;
    if (!acc[mediaType]) {
      acc[mediaType] = { ...DEFAULT_METRICS };
    }

    // Atualiza as métricas para este tipo de conteúdo com verificação de null/undefined
    acc[mediaType].count++;
    acc[mediaType].likes += Number(post.like_count) || 0;
    acc[mediaType].comments += Number(post.comments_count) || 0;
    
    // Calcula a taxa de engajamento para o post
    const postEngagement = post.like_count + post.comments_count;
    acc[mediaType].engagement += Number(postEngagement) || 0;

    return acc;
  }, JSON.parse(JSON.stringify(DEFAULT_PERFORMANCE)));

  // Calcula médias para cada tipo de conteúdo
  Object.keys(metrics).forEach((type) => {
    const mediaType = type as keyof ContentPerformance;
    if (metrics[mediaType].count > 0) {
      metrics[mediaType].likes = Math.round(metrics[mediaType].likes / metrics[mediaType].count);
      metrics[mediaType].comments = Math.round(metrics[mediaType].comments / metrics[mediaType].count);
      metrics[mediaType].engagement = Number((metrics[mediaType].engagement / metrics[mediaType].count).toFixed(2));
    }
  });

  const contentTypes = [
    {
      type: "IMAGE" as keyof ContentPerformance,
      label: "Images",
      icon: Image,
    },
    {
      type: "VIDEO" as keyof ContentPerformance,
      label: "Videos",
      icon: PlayCircle,
    },
    {
      type: "CAROUSEL_ALBUM" as keyof ContentPerformance,
      label: "Carousels",
      icon: Images,
    },
  ];

  return (
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
          {contentTypes.map(({ type, label, icon: Icon }) => {
            const typeMetrics = metrics[type] || { ...DEFAULT_METRICS };
            
            return (
              <div
                key={type}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-md bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      {typeMetrics.count} posts
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{typeMetrics.likes}</p>
                    <p className="text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{typeMetrics.comments}</p>
                    <p className="text-muted-foreground">Comments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{typeMetrics.engagement}%</p>
                    <p className="text-muted-foreground">Engagement</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
