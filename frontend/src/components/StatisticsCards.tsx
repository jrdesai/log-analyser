import { TrendingUp, TrendingDown, AlertTriangle, Clock, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'critical';
  icon?: React.ReactNode;
}

function MetricCard({ title, value, change, trend, status = 'good', icon }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return '';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return status === 'good' ? (
        <TrendingUp className="w-4 h-4 mr-1" />
      ) : (
        <TrendingUp className="w-4 h-4 mr-1" />
      );
    }
    if (trend === 'down') {
      return status === 'good' ? (
        <TrendingDown className="w-4 h-4 mr-1 rotate-180" />
      ) : (
        <TrendingDown className="w-4 h-4 mr-1" />
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription className="flex items-center gap-2">
          {icon}
          {title}
        </CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      {change && (
        <CardContent>
          <div className={cn("flex items-center text-sm", getStatusColor())}>
            {getTrendIcon()}
            {change}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Total Logs"
        value="411"
        change="+12% from last hour"
        trend="up"
        status="good"
        icon={<Activity className="w-4 h-4" />}
      />
      
      <MetricCard
        title="Error Rate"
        value="8.5%"
        change="+2.3% from last hour"
        trend="up"
        status="warning"
        icon={<AlertTriangle className="w-4 h-4" />}
      />
      
      <MetricCard
        title="Avg Response Time"
        value="142ms"
        change="-8ms from last hour"
        trend="down"
        status="good"
        icon={<Clock className="w-4 h-4" />}
      />

      <MetricCard
        title="Active Alerts"
        value="3"
        change="+1 from last hour"
        trend="up"
        status="warning"
        icon={<AlertTriangle className="w-4 h-4" />}
      />

      <MetricCard
        title="MTTD"
        value="2.3m"
        change="-0.5m from last hour"
        trend="down"
        status="good"
        icon={<Clock className="w-4 h-4" />}
      />

      <MetricCard
        title="MTTR"
        value="8.5m"
        change="-1.2m from last hour"
        trend="down"
        status="good"
        icon={<Clock className="w-4 h-4" />}
      />

      <MetricCard
        title="Uptime"
        value="99.97%"
        change="+0.02% from last hour"
        trend="up"
        status="good"
        icon={<CheckCircle className="w-4 h-4" />}
      />

      <MetricCard
        title="Success Rate"
        value="98.5%"
        change="+0.3% from last hour"
        trend="up"
        status="good"
        icon={<CheckCircle className="w-4 h-4" />}
      />

      <MetricCard
        title="P95 Time"
        value="245ms"
        change="-12ms from last hour"
        trend="down"
        status="good"
        icon={<Clock className="w-4 h-4" />}
      />

      <MetricCard
        title="Cache Ratio"
        value="94.5%"
        change="+1.2% from last hour"
        trend="up"
        status="good"
        icon={<Activity className="w-4 h-4" />}
      />

      <MetricCard
        title="Failed Requests"
        value="23"
        change="+5 from last hour"
        trend="up"
        status="warning"
        icon={<AlertTriangle className="w-4 h-4" />}
      />
    </div>
  );
}
