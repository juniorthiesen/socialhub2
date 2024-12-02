"use client";

import { useEffect } from "react";
import { useInstagramStore } from "@/lib/instagram/store";
import { DateFilter, PostSortType } from "@/lib/instagram/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const dateFilters: { value: DateFilter; label: string }[] = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const sortTypes: { value: PostSortType; label: string }[] = [
  { value: "date", label: "Date Posted" },
  { value: "likes", label: "Most Likes" },
  { value: "comments", label: "Most Comments" },
  { value: "engagement", label: "Highest Engagement" },
];

export function PostFilters() {
  const { 
    dateFilter, 
    sortType, 
    searchQuery, 
    setDateFilter, 
    setSortType, 
    setSearchQuery, 
    fetchPosts 
  } = useInstagramStore();

  useEffect(() => {
    if (dateFilter) {
      fetchPosts(dateFilter);
    }
  }, [dateFilter, fetchPosts]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Posts</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Search posts..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-2">
            <Label>Time Period</Label>
            <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {dateFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={sortType || 'date'} onValueChange={(value: PostSortType) => setSortType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
