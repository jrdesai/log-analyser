import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

// Generate sample data
const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  days.forEach((day, dayIdx) => {
    hours.forEach((hour) => {
      // Simulate higher error rates during business hours (9-17) and weekdays
      const isBusinessHour = hour >= 9 && hour <= 17;
      const isWeekday = dayIdx < 5;
      const baseValue = isBusinessHour && isWeekday ? 15 : 5;
      const randomVariation = Math.floor(Math.random() * 10);
      data.push({
        hour,
        day,
        value: baseValue + randomVariation,
      });
    });
  });
  return data;
};

const getColorIntensity = (value: number, max: number) => {
  const ratio = value / max;
  if (ratio < 0.2) return 'bg-green-100 dark:bg-green-900/30';
  if (ratio < 0.4) return 'bg-green-300 dark:bg-green-800/50';
  if (ratio < 0.6) return 'bg-yellow-300 dark:bg-yellow-800/50';
  if (ratio < 0.8) return 'bg-orange-300 dark:bg-orange-800/50';
  return 'bg-red-400 dark:bg-red-800/70';
};

export default function ErrorHeatmap() {
  const data = generateHeatmapData();
  const maxValue = Math.max(...data.map(d => d.value));

  const getCellValue = (day: string, hour: number) => {
    return data.find(d => d.day === day && d.hour === hour)?.value || 0;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Error Heatmap (24h × 7 days)</CardTitle>
        <CardDescription>Error frequency by hour and day of week</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-auto">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header row with hours */}
            <div className="flex mb-2">
              <div className="w-12 flex-shrink-0"></div>
              <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gap: '2px' }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="text-xs text-center text-muted-foreground text-[10px]"
                    title={`${hour}:00`}
                  >
                    {hour % 6 === 0 ? hour : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap grid */}
            <div className="space-y-0.5">
              {days.map((day) => (
                <div key={day} className="flex items-center">
                  <div className="w-12 flex-shrink-0 text-xs text-muted-foreground text-right pr-2">
                    {day}
                  </div>
                  <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gap: '2px' }}>
                    {hours.map((hour) => {
                      const value = getCellValue(day, hour);
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={cn(
                            'aspect-square rounded-sm border border-border/50',
                            getColorIntensity(value, maxValue)
                          )}
                          title={`${day} ${hour}:00 - ${value} errors`}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[8px] text-foreground/70">
                              {value > 0 ? value : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs">
              <span className="text-muted-foreground">Less</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <div className="w-3 h-3 bg-green-300 dark:bg-green-800/50 rounded"></div>
                <div className="w-3 h-3 bg-yellow-300 dark:bg-yellow-800/50 rounded"></div>
                <div className="w-3 h-3 bg-orange-300 dark:bg-orange-800/50 rounded"></div>
                <div className="w-3 h-3 bg-red-400 dark:bg-red-800/70 rounded"></div>
              </div>
              <span className="text-muted-foreground">More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

