'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'most_likes' | 'most_replies';
export type StatusFilter = 'all' | 'hidden' | 'visible';

interface CommentFiltersProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;

  filterStatus: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CommentFilters({
  sortBy,
  onSortChange,
  filterStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: CommentFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="most_likes">Most Likes</SelectItem>
          <SelectItem value="most_replies">Most Replies</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Comments</SelectItem>
          <SelectItem value="hidden">Hidden Only</SelectItem>
          <SelectItem value="visible">Visible Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
