"use client";

import { useState, useEffect } from "react";
import { PostsList } from "@/components/comments/posts-list";
import { PostComments } from "@/components/posts/post-comments";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useInstagramStore } from "@/lib/instagram/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateFilter } from "@/lib/instagram/types";

type DateFilterValue = Exclude<DateFilter, { start: string; end: string }>;

export default function CommentsPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { fetchPosts, setDateFilter, dateFilter } = useInstagramStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, dateFilter]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
          <p className="text-muted-foreground mt-2">
            Manage and respond to comments across your posts
          </p>
        </div>
        <Select 
          value={typeof dateFilter === 'string' ? dateFilter : '30days'} 
          onValueChange={(value: DateFilterValue) => setDateFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <PostsList 
            selectedPostId={selectedPostId} 
            onPostSelect={setSelectedPostId} 
          />
        </div>

        <div className="space-y-6">
          {selectedPostId ? (
            <PostComments postId={selectedPostId} />
          ) : (
            <Card className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Post Selected</h3>
              <p className="text-muted-foreground">
                Select a post from the left to view and manage its comments
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}