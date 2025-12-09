import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const presets = [
  { label: 'Last hour', hours: 1 },
  { label: 'Last 24 hours', hours: 24 },
  { label: 'Last 7 days', hours: 24 * 7 },
  { label: 'Last 30 days', hours: 24 * 30 },
];

export default function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const applyPreset = (hours: number) => {
    const to = new Date();
    const from = new Date(to.getTime() - hours * 60 * 60 * 1000);
    onDateRangeChange({ from, to });
    setIsOpen(false);
  };

  const handleCustomRange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      onDateRangeChange({
        from: range.from,
        to: range.to,
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto min-w-[350px] p-0 !bg-card border-border backdrop-blur-none" 
        align="center"
        style={{ backgroundColor: 'hsl(var(--card))' }}
      >
        <div className="p-3 border-b">
          <p className="text-sm font-medium mb-2">Quick Presets</p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.hours)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-full p-3">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={handleCustomRange}
            numberOfMonths={1}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

