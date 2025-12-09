import { Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Results } from '@/types/logs';

interface AIInsightsProps {
  results: Results;
}

export default function AIInsights({ results }: AIInsightsProps) {
  return (
    <Alert className="mb-6 bg-card border-border">
      <Activity className="w-5 h-5 text-primary" />
      <AlertDescription>
        <p className="font-semibold mb-2 text-foreground">{results.summary}</p>
        <div className="space-y-1">
          {results.insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}

