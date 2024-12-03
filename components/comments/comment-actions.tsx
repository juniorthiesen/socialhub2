'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, EyeOff, Eye, Trash2 } from 'lucide-react';
import { useInstagramStore } from '@/lib/instagram/store';
import { Comment } from '@/lib/instagram/types';
import { useToast } from '@/hooks/use-toast';

interface CommentActionsProps {
  comment: Comment;
  postId: string;
}

export function CommentActions({ comment }: CommentActionsProps) {
  const { api } = useInstagramStore();
  const { toast } = useToast();

  const handleHideComment = async () => {
    if (!api) return;

    try {
      await api.hideComment(comment.id);
      toast({
        title: 'Success',
        description: 'Comment visibility updated',
      });
    } catch (error) {
      console.error('Error updating comment visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment visibility',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async () => {
    if (!api) return;

    try {
      await api.deleteComment(comment.id);
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleHideComment}>
          {comment.hidden ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Comment
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Comment
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDeleteComment}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Comment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
