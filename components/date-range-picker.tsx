"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let newRange: DateRange = { from: today, to: today };

    switch (preset) {
      case "7days":
        newRange = {
          from: addDays(today, -7),
          to: today,
        };
        break;
      case "30days":
        newRange = {
          from: addDays(today, -30),
          to: today,
        };
        break;
      case "90days":
        newRange = {
          from: addDays(today, -90),
          to: today,
        };
        break;
      case "month":
        newRange = {
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: today,
        };
        break;
      case "year":
        newRange = {
          from: new Date(today.getFullYear(), 0, 1),
          to: today,
        };
        break;
    }

    onDateChange(newRange);
    setIsPopoverOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Select
            onValueChange={handlePresetChange}
          >
            <SelectTrigger className="m-2">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
                setIsPopoverOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}