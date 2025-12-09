import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SystemHealthBannerProps {
  issues: string[];
  onDismiss: () => void;
}

export default function SystemHealthBanner({ issues, onDismiss }: SystemHealthBannerProps) {
  if (issues.length === 0) return null;

  const getSeverity = () => {
    // Determine severity based on issues
    if (issues.some(issue => issue.toLowerCase().includes('down') || issue.toLowerCase().includes('critical'))) {
      return 'critical';
    }
    if (issues.some(issue => issue.toLowerCase().includes('degraded') || issue.toLowerCase().includes('warning'))) {
      return 'warning';
    }
    return 'info';
  };

  const severity = getSeverity();

  return (
    <Alert
      className={`
        mb-6 border-l-4
        ${severity === 'critical' ? 'bg-red-50 dark:bg-red-950/80 border-red-500' : ''}
        ${severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/80 border-yellow-500' : ''}
        ${severity === 'info' ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle
            className={`
              w-5 h-5 mt-0.5 flex-shrink-0
              ${severity === 'critical' ? 'text-red-600 dark:text-red-400' : ''}
              ${severity === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : ''}
              ${severity === 'info' ? 'text-blue-600 dark:text-blue-400' : ''}
            `}
          />
          <AlertDescription className="flex-1">
            <p className={`
              font-semibold mb-2
              ${severity === 'critical' ? 'text-red-900 dark:text-red-100' : ''}
              ${severity === 'warning' ? 'text-yellow-900 dark:text-yellow-100' : ''}
              ${severity === 'info' ? 'text-blue-900 dark:text-blue-100' : ''}
            `}>
              System Health Alert
            </p>
            <ul className="space-y-1">
              {issues.map((issue, idx) => (
                <li key={idx} className={`
                  flex items-start gap-2 text-sm
                  ${severity === 'critical' ? 'text-red-800 dark:text-red-200' : ''}
                  ${severity === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : ''}
                  ${severity === 'info' ? 'text-blue-800 dark:text-blue-200' : ''}
                `}>
                  <div
                    className={`
                      w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0
                      ${severity === 'critical' ? 'bg-red-500' : ''}
                      ${severity === 'warning' ? 'bg-yellow-500' : ''}
                      ${severity === 'info' ? 'bg-blue-500' : ''}
                    `}
                  />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}

