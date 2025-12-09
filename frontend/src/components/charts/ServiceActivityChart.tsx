import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ServiceData } from '@/types/logs';

interface ServiceActivityChartProps {
  data: ServiceData[];
}

export default function ServiceActivityChart({ data }: ServiceActivityChartProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Logs by Service
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0">
        <div className="w-full" style={{ height: '250px', minHeight: '250px', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
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
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

