import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const topErrors = [
  { error: 'Database timeout', count: 234 },
  { error: 'Authentication failed', count: 189 },
  { error: 'Rate limit exceeded', count: 156 },
  { error: 'Invalid request', count: 142 },
  { error: 'Service unavailable', count: 98 },
];

const COLORS = [
  'hsl(var(--destructive))',
  'hsl(var(--destructive))',
  'hsl(var(--destructive))',
  'hsl(var(--destructive))',
  'hsl(var(--destructive))',
];

export default function TopErrorsChart() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Top 5 Errors</CardTitle>
        <CardDescription>Most frequent error messages in the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0">
        <div className="w-full" style={{ height: '300px', minHeight: '300px', minWidth: '200px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={200}>
          <BarChart data={topErrors} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="error" 
              type="category" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11 }}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar dataKey="count" name="Error Count" radius={[0, 4, 4, 0]}>
              {topErrors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

