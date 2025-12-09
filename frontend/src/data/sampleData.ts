import { LogEntry, TimeSeriesData, LevelDistribution, ServiceData } from '@/types/logs';

export const sampleLogs: LogEntry[] = [
  { 
    id: 1, 
    timestamp: '2025-12-08 14:32:15', 
    level: 'ERROR', 
    service: 'auth-service', 
    message: 'Failed authentication attempt from IP 192.168.1.105', 
    details: 'User: admin@example.com, Reason: Invalid credentials, IP: 192.168.1.105, Timestamp: 2025-12-08T14:32:15Z' 
  },
  { 
    id: 2, 
    timestamp: '2025-12-08 14:31:42', 
    level: 'WARNING', 
    service: 'payment-service', 
    message: 'Payment processing delayed', 
    details: 'Transaction ID: TXN-98765, Delay: 2.3s, Amount: $129.99, Status: Pending' 
  },
  { 
    id: 3, 
    timestamp: '2025-12-08 14:30:18', 
    level: 'INFO', 
    service: 'api-gateway', 
    message: 'Request completed successfully', 
    details: 'Endpoint: /api/v1/users, Method: GET, Duration: 45ms, Status: 200' 
  },
  { 
    id: 4, 
    timestamp: '2025-12-08 14:29:55', 
    level: 'ERROR', 
    service: 'database', 
    message: 'Connection pool exhausted', 
    details: 'Active connections: 100/100, Waiting queries: 15, Pool size: 100' 
  },
  { 
    id: 5, 
    timestamp: '2025-12-08 14:28:33', 
    level: 'INFO', 
    service: 'cache-service', 
    message: 'Cache hit ratio: 94.5%', 
    details: 'Hits: 18,900, Misses: 1,100, Total requests: 20,000' 
  },
];

export const timeSeriesData: TimeSeriesData[] = [
  { time: '14:25', errors: 3, warnings: 5, info: 42 },
  { time: '14:26', errors: 5, warnings: 8, info: 38 },
  { time: '14:27', errors: 2, warnings: 6, info: 45 },
  { time: '14:28', errors: 4, warnings: 7, info: 40 },
  { time: '14:29', errors: 6, warnings: 9, info: 35 },
  { time: '14:30', errors: 3, warnings: 5, info: 48 },
  { time: '14:31', errors: 7, warnings: 11, info: 32 },
  { time: '14:32', errors: 5, warnings: 8, info: 37 },
];

export const levelDistribution: LevelDistribution[] = [
  { name: 'INFO', value: 317, color: '#3b82f6' },
  { name: 'WARNING', value: 59, color: '#eab308' },
  { name: 'ERROR', value: 35, color: '#ef4444' },
];

export const serviceData: ServiceData[] = [
  { name: 'auth-service', count: 45 },
  { name: 'api-gateway', count: 123 },
  { name: 'payment-service', count: 67 },
  { name: 'database', count: 89 },
  { name: 'cache-service', count: 87 },
];

export const suggestedQueries = [
  'Show me all errors from the last hour',
  'What caused the authentication failures?',
  'Find slow API responses',
  'Show database connection issues'
];

