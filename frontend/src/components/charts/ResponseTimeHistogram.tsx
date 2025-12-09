import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateHistogramData = () => {
  const ranges = [
    '0-50ms', '50-100ms', '100-200ms', '200-500ms', 
    '500ms-1s', '1-2s', '2-5s', '5s+'
  ];
  
  return ranges.map((range) => ({
    range,
    count: Math.floor(Math.random() * 500) + 50,
  }));
};

export default function ResponseTimeHistogram() {
  const data = generateHistogramData();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Response Time Distribution</CardTitle>
        <CardDescription>Histogram of response times across all services</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0">
        <div className="w-full" style={{ height: '300px', minHeight: '300px', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="range" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
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
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))"
              name="Request Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

