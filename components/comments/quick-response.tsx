"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuickResponseProps {
  onSelect: (template: string) => void;
}

const templates = [
  "Thank you for your comment! 🙏",
  "We appreciate your feedback! 💫",
  "Thanks for sharing your thoughts! 🌟",
  "Great point! Thanks for engaging with us! 🎉",
  "We're glad you enjoyed it! ❤️",
];

export function QuickResponse({ onSelect }: QuickResponseProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          Quick Response
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          {templates.map((template, index) => (
            <Button
              key={index}
              variant="ghost"
              className="justify-start"
              onClick={() => {
                onSelect(template);
                setOpen(false);
              }}
            >
              {template}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}