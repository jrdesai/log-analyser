import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateComparisonData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map((hour) => ({
    hour: `${hour}:00`,
    today: Math.floor(Math.random() * 100) + 50,
    yesterday: Math.floor(Math.random() * 100) + 50,
  }));
};

export default function ComparisonChart() {
  const data = generateComparisonData();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Today vs Yesterday</CardTitle>
        <CardDescription>Error count comparison by hour</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0">
        <div className="w-full" style={{ height: '300px', minHeight: '300px', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              interval={2}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="today" 
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Today"
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="yesterday" 
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              name="Yesterday"
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

