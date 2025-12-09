import { 
  XCircle, 
  AlertCircle, 
  CheckCircle, 
  Activity 
} from 'lucide-react';

export const getLevelIcon = (level: string) => {
  switch(level) {
    case 'ERROR': return <XCircle className="w-4 h-4 text-destructive" />;
    case 'WARNING': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'INFO': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

export const getLevelVariant = (level: string): "default" | "destructive" | "secondary" | "outline" => {
  switch(level) {
    case 'ERROR': return 'destructive';
    case 'WARNING': return 'secondary';
    case 'INFO': return 'default';
    default: return 'outline';
  }
};

export const getLevelBadgeClassName = (level: string): string => {
  switch(level) {
    case 'ERROR': 
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 dark:bg-red-500/20';
    case 'WARNING': 
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 dark:bg-yellow-500/20';
    case 'INFO': 
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:bg-blue-500/20';
    default: 
      return '';
  }
};

export const getLevelColor = (level: string) => {
  switch(level) {
    case 'ERROR': return 'text-red-600 dark:text-red-400';
    case 'WARNING': return 'text-yellow-600 dark:text-yellow-400';
    case 'INFO': return 'text-blue-600 dark:text-blue-400';
    default: return '';
  }
};

