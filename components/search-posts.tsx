"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useInstagramStore } from "@/lib/instagram/store";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchPosts() {
  const [localSearch, setLocalSearch] = useState("");
  const { setSearchQuery, setSortType, sortType } = useInstagramStore();
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          className="pl-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
      <Select value={sortType} onValueChange={setSortType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Latest</SelectItem>
          <SelectItem value="likes">Most Liked</SelectItem>
          <SelectItem value="comments">Most Comments</SelectItem>
          <SelectItem value="engagement">Highest Engagement</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}