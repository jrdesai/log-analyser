import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TimeSeriesData } from '@/types/logs';

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

export default function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Log Trends (Last Hour)
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0">
        <div className="w-full" style={{ height: '250px', minHeight: '250px', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(var(--card-foreground))'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="errors" 
              stroke="#ef4444" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
              name="Errors"
            />
            <Line 
              type="monotone" 
              dataKey="warnings" 
              stroke="#eab308" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
              name="Warnings"
            />
            <Line 
              type="monotone" 
              dataKey="info" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
              name="Info"
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

