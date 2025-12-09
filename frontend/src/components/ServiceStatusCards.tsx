import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  sparklineData: { time: string; value: number }[];
}

const services: ServiceStatus[] = [
  {
    name: 'Auth Service',
    status: 'healthy',
    uptime: 99.98,
    responseTime: 45,
    sparklineData: [
      { time: '0', value: 42 },
      { time: '1', value: 45 },
      { time: '2', value: 43 },
      { time: '3', value: 47 },
      { time: '4', value: 45 },
      { time: '5', value: 44 },
    ],
  },
  {
    name: 'API Gateway',
    status: 'healthy',
    uptime: 99.95,
    responseTime: 38,
    sparklineData: [
      { time: '0', value: 35 },
      { time: '1', value: 38 },
      { time: '2', value: 40 },
      { time: '3', value: 37 },
      { time: '4', value: 39 },
      { time: '5', value: 38 },
    ],
  },
  {
    name: 'Payment Service',
    status: 'degraded',
    uptime: 98.5,
    responseTime: 125,
    sparklineData: [
      { time: '0', value: 110 },
      { time: '1', value: 125 },
      { time: '2', value: 130 },
      { time: '3', value: 120 },
      { time: '4', value: 128 },
      { time: '5', value: 125 },
    ],
  },
  {
    name: 'Database',
    status: 'healthy',
    uptime: 99.99,
    responseTime: 12,
    sparklineData: [
      { time: '0', value: 10 },
      { time: '1', value: 12 },
      { time: '2', value: 11 },
      { time: '3', value: 13 },
      { time: '4', value: 12 },
      { time: '5', value: 12 },
    ],
  },
  {
    name: 'Cache Service',
    status: 'healthy',
    uptime: 99.97,
    responseTime: 5,
    sparklineData: [
      { time: '0', value: 4 },
      { time: '1', value: 5 },
      { time: '2', value: 6 },
      { time: '3', value: 5 },
      { time: '4', value: 4 },
      { time: '5', value: 5 },
    ],
  },
  {
    name: 'Notification Service',
    status: 'down',
    uptime: 95.2,
    responseTime: 0,
    sparklineData: [
      { time: '0', value: 0 },
      { time: '1', value: 0 },
      { time: '2', value: 0 },
      { time: '3', value: 0 },
      { time: '4', value: 0 },
      { time: '5', value: 0 },
    ],
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'healthy': return 'default';
    case 'degraded': return 'secondary';
    case 'down': return 'destructive';
    default: return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-600 dark:text-green-400';
    case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
    case 'down': return 'text-red-600 dark:text-red-400';
    default: return '';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'degraded': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    case 'down': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    default: return '';
  }
};

export default function ServiceStatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {services.map((service) => (
        <Card key={service.name}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{service.name}</CardTitle>
              <Badge
                variant={getStatusVariant(service.status)}
                className={cn("text-xs", getStatusBadgeColor(service.status))}
              >
                {service.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uptime</span>
              <span className={cn("font-semibold", getStatusColor(service.status))}>
                {service.uptime}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Response Time</span>
              <span className={cn("font-semibold", getStatusColor(service.status))}>
                {service.responseTime}ms
              </span>
            </div>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={service.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={service.status === 'healthy' ? '#22c55e' : service.status === 'degraded' ? '#eab308' : '#ef4444'}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

