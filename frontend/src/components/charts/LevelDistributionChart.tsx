import { PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { LevelDistribution } from '@/types/logs';

interface LevelDistributionChartProps {
  data: LevelDistribution[];
}

export default function LevelDistributionChart({ data }: LevelDistributionChartProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Log Level Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0">
        <div className="w-full" style={{ height: '250px', minHeight: '250px', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={200}>
          <RePieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(var(--card-foreground))'
              }} 
            />
          </RePieChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

