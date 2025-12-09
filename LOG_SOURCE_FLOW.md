# Log Source and Data Flow Documentation

## Current Implementation

### 1. **Log Source Definition**

Currently, logs are sourced from **hardcoded sample data**:

**Location:** `frontend/src/data/sampleData.ts`

```typescript
export const sampleLogs: LogEntry[] = [
  { 
    id: 1, 
    timestamp: '2025-12-08 14:32:15', 
    level: 'ERROR', 
    service: 'auth-service', 
    message: 'Failed authentication attempt...',
    details: '...'
  },
  // ... more sample logs
];
```

### 2. **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    LOG SOURCE LAYERS                         │
└─────────────────────────────────────────────────────────────┘

1. DATA SOURCE
   ├── Sample Data (Current)
   │   └── frontend/src/data/sampleData.ts
   │
   ├── Real Backend API (To be implemented)
   │   └── backend/ (currently empty)
   │
   └── File Upload (Future)
       └── Could add file parsing

2. DATA FETCHING
   └── LogAnalyzer.tsx
       ├── handleQuery() - Search/query logs
       ├── useEffect() - Initial load on login
       └── useEffect() - Real-time streaming simulation

3. STATE MANAGEMENT
   └── LogAnalyzer.tsx
       └── const [results, setResults] = useState<Results | null>(null)
           └── Contains: { summary, insights, logs: LogEntry[] }

4. DATA DISPLAY
   ├── Dashboard Tab
   │   └── DashboardTab.tsx → shows recent critical logs
   │
   ├── Live Logs Tab
   │   └── LiveLogsTab.tsx → LogsDataTable.tsx
   │
   └── Analytics Tab
       └── StatisticsCards, ServiceStatusCards, DraggableDashboard
```

## Current Flow (Step-by-Step)

### **Step 1: Initial Load**
**File:** `frontend/src/components/LogAnalyzer.tsx` (lines 84-100)

```typescript
useEffect(() => {
  if (isLoggedIn) {
    setResults({
      summary: `Monitoring ${sampleLogs.length} log entries in real-time`,
      insights: [...],
      logs: sampleLogs  // ← Loads from sampleData.ts
    });
  }
}, [isLoggedIn]);
```

**Flow:**
1. User logs in → `isLoggedIn` becomes `true`
2. `useEffect` triggers
3. Loads `sampleLogs` from `sampleData.ts`
4. Sets `results` state with logs

### **Step 2: Search/Query**
**File:** `frontend/src/components/LogAnalyzer.tsx` (lines 166-188)

```typescript
const handleQuery = async () => {
  setLoading(true);
  // Currently simulates API call
  setTimeout(() => {
    setResults({
      summary: `Found ${sampleLogs.length} log entries...`,
      logs: sampleLogs  // ← Still using sample data
    });
    setLoading(false);
  }, 1200);
};
```

**Flow:**
1. User enters query in SearchBar
2. `handleQuery()` called
3. Currently returns sample data (simulated delay)
4. Updates `results` state

### **Step 3: Real-time Streaming**
**File:** `frontend/src/components/LogAnalyzer.tsx` (lines 103-134)

```typescript
useEffect(() => {
  if (!isLive || isPaused) return;
  
  const interval = setInterval(() => {
    // Simulates new logs
    const newLog = {
      ...sampleLogs[Math.floor(Math.random() * sampleLogs.length)],
      id: Date.now(),
      timestamp: new Date().toISOString()...
    };
    setResults(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 50)
    }));
  }, 1000);
}, [isLive, isPaused, results]);
```

**Flow:**
1. User clicks "Start Live"
2. `isLive` becomes `true`
3. `setInterval` generates new logs every second
4. New logs prepended to existing logs
5. Keeps last 50 logs

### **Step 4: Data Display**
**Files:**
- `LiveLogsTab.tsx` → receives `logs` prop
- `LogsDataTable.tsx` → displays logs in table
- `DashboardTab.tsx` → shows filtered critical logs

## How to Connect Real Log Source

### **Option 1: Backend API Integration**

#### **Step 1: Create API Service**
Create: `frontend/src/services/logService.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LogQueryParams {
  query?: string;
  level?: string[];
  service?: string[];
  environment?: string[];
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

export const logService = {
  // Fetch logs with filters
  async fetchLogs(params: LogQueryParams): Promise<Results> {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },

  // Stream logs (WebSocket or SSE)
  connectLogStream(
    onLog: (log: LogEntry) => void,
    onError: (error: Error) => void
  ): () => void {
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/logs/stream`);
    
    ws.onmessage = (event) => {
      const log = JSON.parse(event.data);
      onLog(log);
    };
    
    ws.onerror = (error) => {
      onError(new Error('WebSocket connection failed'));
    };
    
    return () => ws.close();
  },

  // Get log statistics
  async getStatistics(): Promise<Statistics> {
    const response = await fetch(`${API_BASE_URL}/logs/statistics`);
    return response.json();
  },
};
```

#### **Step 2: Update LogAnalyzer.tsx**

Replace sample data loading:

```typescript
// Replace this:
import { sampleLogs } from '@/data/sampleData';

// With:
import { logService } from '@/services/logService';

// Update initial load:
useEffect(() => {
  if (isLoggedIn) {
    logService.fetchLogs({
      from: dateRange.from,
      to: dateRange.to,
      limit: 100,
    }).then(setResults);
  }
}, [isLoggedIn, dateRange]);

// Update handleQuery:
const handleQuery = async () => {
  if (!query.trim()) return;
  
  setLoading(true);
  try {
    const results = await logService.fetchLogs({
      query,
      from: dateRange.from,
      to: dateRange.to,
      level: filters.filter(f => f.type === 'level').map(f => f.value),
      service: filters.filter(f => f.type === 'service').map(f => f.value),
      environment: filters.filter(f => f.type === 'environment').map(f => f.value),
    });
    setResults(results);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
  } finally {
    setLoading(false);
  }
};

// Update real-time streaming:
useEffect(() => {
  if (!isLive || isPaused) {
    setLogsPerSecond(0);
    return;
  }

  const disconnect = logService.connectLogStream(
    (newLog) => {
      setResults(prev => prev ? {
        ...prev,
        logs: [newLog, ...prev.logs].slice(0, 500)
      } : null);
      setLogsPerSecond(prev => prev + 1);
    },
    (error) => {
      setConnectionStatus('disconnected');
      console.error('Stream error:', error);
    }
  );

  return disconnect;
}, [isLive, isPaused]);
```

### **Option 2: File Upload**

Add file parsing service:

```typescript
// frontend/src/services/fileParser.ts
export const fileParser = {
  async parseLogFile(file: File): Promise<LogEntry[]> {
    const text = await file.text();
    const lines = text.split('\n');
    
    return lines
      .filter(line => line.trim())
      .map((line, index) => {
        // Parse log format (adjust based on your log format)
        const match = line.match(/\[(.*?)\] \[(.*?)\] \[(.*?)\] (.*)/);
        if (match) {
          return {
            id: index + 1,
            timestamp: match[1],
            level: match[2] as LogLevel,
            service: match[3],
            message: match[4],
            details: line,
          };
        }
        return null;
      })
      .filter(Boolean) as LogEntry[];
  },
};
```

### **Option 3: Multiple Sources**

Create a log source manager:

```typescript
// frontend/src/services/logSourceManager.ts
interface LogSource {
  name: string;
  type: 'api' | 'file' | 'websocket' | 'sse';
  config: any;
}

export class LogSourceManager {
  private sources: LogSource[] = [];

  addSource(source: LogSource) {
    this.sources.push(source);
  }

  async fetchLogs(params: LogQueryParams): Promise<Results> {
    // Aggregate from all sources
    const promises = this.sources.map(source => 
      this.fetchFromSource(source, params)
    );
    const results = await Promise.all(promises);
    return this.mergeResults(results);
  }
}
```

## Backend API Structure (Recommended)

```
backend/
├── src/
│   ├── routes/
│   │   └── logs.ts          # Log endpoints
│   ├── services/
│   │   ├── logService.ts    # Log processing
│   │   └── streamService.ts # WebSocket/SSE
│   ├── models/
│   │   └── Log.ts          # Log data model
│   └── config/
│       └── database.ts      # DB connection
└── package.json
```

**API Endpoints:**
- `POST /api/logs` - Query logs with filters
- `GET /api/logs/stream` - WebSocket for live logs
- `GET /api/logs/statistics` - Get statistics
- `GET /api/logs/services` - List available services

## Environment Configuration

Create: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_LOG_SOURCE=api  # or 'file', 'sample'
```

## Summary

**Current State:**
- ✅ Logs from `sampleData.ts`
- ✅ Simulated API calls
- ✅ Simulated real-time streaming

**To Connect Real Source:**
1. Create `logService.ts` with API calls
2. Replace `sampleLogs` imports with service calls
3. Update `handleQuery()` to use real API
4. Replace simulation with WebSocket/SSE for streaming
5. Add error handling and loading states

**Key Files to Modify:**
- `frontend/src/components/LogAnalyzer.tsx` - Main data fetching
- `frontend/src/data/sampleData.ts` - Replace with API service
- `frontend/src/services/logService.ts` - Create new service (NEW)

