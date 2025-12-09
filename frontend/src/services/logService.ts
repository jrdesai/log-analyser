import { LogEntry, Results } from '@/types/logs';
import { LogSourceConfig } from '@/components/LogSourceConfig';

const STORAGE_KEY = 'log-source-config';

// Load configuration from localStorage
export const loadLogSourceConfig = (): LogSourceConfig | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

// Save configuration to localStorage
export const saveLogSourceConfig = (config: LogSourceConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};

// Test API connection
export const testApiConnection = async (apiUrl: string, apiKey?: string): Promise<boolean> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Test WebSocket connection
export const testWebSocketConnection = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(url);
      const timeout = setTimeout(() => {
        ws.close();
        resolve(false);
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
    } catch (error) {
      console.error('WebSocket connection test failed:', error);
      resolve(false);
    }
  });
};

// Test SSE connection
export const testSSEConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok && response.headers.get('content-type')?.includes('text/event-stream');
  } catch (error) {
    console.error('SSE connection test failed:', error);
    return false;
  }
};

// Fetch logs from API
export const fetchLogsFromAPI = async (
  apiUrl: string,
  apiKey: string | undefined,
  params: {
    query?: string;
    from?: Date;
    to?: Date;
    level?: string[];
    service?: string[];
    environment?: string[];
  }
): Promise<Results> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${apiUrl}/logs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: params.query,
      from: params.from?.toISOString(),
      to: params.to?.toISOString(),
      filters: {
        level: params.level,
        service: params.service,
        environment: params.environment,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Connect WebSocket stream
export const connectWebSocketStream = (
  url: string,
  onLog: (log: LogEntry) => void,
  onError: (error: Error) => void
): (() => void) => {
  try {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        onLog(log);
      } catch (error) {
        console.error('Failed to parse log:', error);
      }
    };

    ws.onerror = (error) => {
      onError(new Error('WebSocket connection error'));
    };

    ws.onclose = () => {
      // Connection closed
    };

    return () => ws.close();
  } catch (error) {
    onError(new Error('Failed to create WebSocket connection'));
    return () => {};
  }
};

// Connect SSE stream
export const connectSSEStream = (
  url: string,
  onLog: (log: LogEntry) => void,
  onError: (error: Error) => void
): (() => void) => {
  try {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        onLog(log);
      } catch (error) {
        console.error('Failed to parse log:', error);
      }
    };

    eventSource.onerror = () => {
      onError(new Error('SSE connection error'));
    };

    return () => eventSource.close();
  } catch (error) {
    onError(new Error('Failed to create SSE connection'));
    return () => {};
  }
};

// Parse log file
export const parseLogFile = async (file: File): Promise<LogEntry[]> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    // Try to parse common log formats
    // Format 1: [timestamp] [level] [service] message
    const format1 = line.match(/\[([^\]]+)\] \[([^\]]+)\] \[([^\]]+)\] (.+)/);
    if (format1) {
      return {
        id: index + 1,
        timestamp: format1[1],
        level: format1[2].toUpperCase() as 'ERROR' | 'WARNING' | 'INFO',
        service: format1[3],
        message: format1[4],
        details: line,
      };
    }

    // Format 2: JSON logs
    try {
      const jsonLog = JSON.parse(line);
      return {
        id: jsonLog.id || index + 1,
        timestamp: jsonLog.timestamp || new Date().toISOString(),
        level: (jsonLog.level || 'INFO').toUpperCase() as 'ERROR' | 'WARNING' | 'INFO',
        service: jsonLog.service || 'unknown',
        message: jsonLog.message || line,
        details: line,
      };
    } catch {
      // Fallback: create a basic log entry
      return {
        id: index + 1,
        timestamp: new Date().toISOString(),
        level: 'INFO' as const,
        service: 'unknown',
        message: line,
        details: line,
      };
    }
  });
};

