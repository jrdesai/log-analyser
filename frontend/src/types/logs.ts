export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'ERROR' | 'WARNING' | 'INFO';
  service: string;
  message: string;
  details: string;
}

export interface Results {
  summary: string;
  insights: string[];
  logs: LogEntry[];
}

export interface TimeSeriesData {
  time: string;
  errors: number;
  warnings: number;
  info: number;
}

export interface LevelDistribution {
  name: string;
  value: number;
  color: string;
}

export interface ServiceData {
  name: string;
  count: number;
}

