"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInstagramStore } from "@/lib/instagram/store";
import { Comment, CommentSortType, InstagramPost } from "@/lib/instagram/types";
import { MessageSquare, Heart, Send, Reply, Loader2, Search, EyeOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { QuickResponse } from "./quick-response";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COMMENTS_PER_PAGE = 10;

interface CommentWithPost extends Comment {
  post?: InstagramPost;
}

export function CommentsList() {
  const { posts, api } = useInstagramStore();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CommentSortType>("date");
  const { toast } = useToast();
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const observer = useRef<IntersectionObserver>();
  const lastCommentRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchComments();
  }, [posts, page]);

  const fetchComments = async () => {
    if (page === 1) setLoading(true);
    try {
      const newComments: CommentWithPost[] = [];
      for (const post of posts) {
        const response = await api?.getComments(post.id);
        if (response?.data) {
          const commentsWithPost = response.data.map(comment => ({
            ...comment,
            post
          }));
          newComments.push(...commentsWithPost);
        }
      }
      
      const sortedComments = sortComments(newComments, sortBy);
      const paginatedComments = sortedComments.slice(0, page * COMMENTS_PER_PAGE);
      
      setComments(paginatedComments);
      setHasMore(paginatedComments.length < sortedComments.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sortComments = (commentsToSort: CommentWithPost[], sortType: CommentSortType) => {
    return [...commentsToSort].sort((a, b) => {
      switch (sortType) {
        case "likes":
          return b.like_count - a.like_count;
        case "replies":
          return (b.replies?.data.length || 0) - (a.replies?.data.length || 0);
        case "date":
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
  };

  const handleReply = async (commentId: string) => {
    if (!replyText[commentId]?.trim()) return;

    try {
      await api?.replyToComment(commentId, replyText[commentId]);
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (error) {
      console.error("Error replying to comment:", error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  const handleHideComment = async (commentId: string) => {
    try {
      await api?.hideComment(commentId);
      toast({
        title: "Success",
        description: "Comment hidden successfully",
      });
      fetchComments();
    } catch (error) {
      console.error("Error hiding comment:", error);
      toast({
        title: "Error",
        description: "Failed to hide comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api?.deleteComment(commentId);
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const filteredComments = comments.filter((comment) =>
    comment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: CommentSortType) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Latest</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="replies">Most Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredComments.map((comment, index) => {
          const isLastComment = index === filteredComments.length - 1;
          return (
            <Card
              key={comment.id}
              className="p-4"
              ref={isLastComment ? lastCommentRef : null}
            >
              <div className="space-y-4">
                {comment.post && (
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-16 h-16 relative rounded-md overflow-hidden">
                      <AspectRatio ratio={1}>
                        <Image
                          src={comment.post.displayUrl || ''}
                          alt="Post thumbnail"
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[300px]">
                        {comment.post.caption || 'No caption'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Posted {format(new Date(comment.post.timestamp), "PPp")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">@{comment.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(comment.timestamp), "PPp")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {comment.like_count}
                    </Badge>
                    {comment.replies && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {comment.replies.data.length}
                      </Badge>
                    )}
                    {comment.hidden && (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </div>
                </div>

                <p>{comment.text}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Write a reply..."
                      value={replyText[comment.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      size="icon"
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyText[comment.id]?.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <QuickResponse
                    onSelect={(template) => {
                      setReplyText((prev) => ({
                        ...prev,
                        [comment.id]: template,
                      }));
                    }}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHideComment(comment.id)}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      {comment.hidden ? "Unhide" : "Hide"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {comment.replies && comment.replies.data.length > 0 && (
                  <div className="ml-8 space-y-4 border-l-2 pl-4">
                    {comment.replies.data.map((reply) => (
                      <div key={reply.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">@{reply.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(reply.timestamp), "PPp")}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Heart className="h-3 w-3" />
                            {reply.like_count}
                          </Badge>
                        </div>
                        <p>{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {loading && page > 1 && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}