# AI Log Analyzer

A modern, AI-powered log analysis web application built with React, TypeScript, and shadcn/ui. Features real-time log streaming, advanced analytics, customizable dashboards, and support for multiple log sources.

## 🚀 Features

### Core Features
- 🔍 **Natural Language Querying** - Search logs using natural language queries
- 📊 **Interactive Analytics Dashboard** - Comprehensive charts and visualizations
- 🔴 **Real-Time Log Streaming** - Live log monitoring with WebSocket/SSE support
- 📈 **Advanced Metrics** - Track error rates, response times, uptime, and more
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- **Tabbed Navigation** - Organized into Dashboard, Live Logs, and Analytics tabs
- **Draggable Dashboard** - Customize and rearrange analytics widgets
- **Log Source Configuration** - Connect to REST API, WebSocket, SSE, or use sample data
- **Multi-Filter System** - Filter by log level, service, environment with active filter chips
- **Date Range Picker** - Select custom date ranges with presets
- **Command Palette** - Quick navigation and actions with Cmd/Ctrl+K
- **Log Comparison** - Side-by-side diff view for comparing log entries
- **Service Status Monitoring** - Real-time health status of all services
- **System Health Alerts** - Dismissible alerts for system issues
- **Enhanced Data Table** - Sorting, column visibility, row selection, virtual scrolling
- **Live Streaming Controls** - Pause/resume, auto-scroll, connection status

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS v4** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Icon library
- **react-grid-layout** - Draggable and resizable grid layout
- **date-fns** - Date utility library
- **cmdk** - Command palette component
- **react-day-picker** - Calendar component

### UI Components (shadcn/ui)
- Card, Button, Input, Badge, Alert
- Dialog, Dropdown Menu, Popover
- Table, Tabs, Checkbox, Switch
- Calendar, Command, Radio Group
- Avatar, Separator, Label

## 📁 Project Structure

```
Log Analyzer UI/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── charts/          # Chart components
│   │   │   │   ├── TimeSeriesChart.tsx
│   │   │   │   ├── LevelDistributionChart.tsx
│   │   │   │   ├── ServiceActivityChart.tsx
│   │   │   │   ├── ErrorHeatmap.tsx
│   │   │   │   ├── ResponseTimeHistogram.tsx
│   │   │   │   ├── ComparisonChart.tsx
│   │   │   │   ├── TopErrorsChart.tsx
│   │   │   │   └── ServiceDependencyNetwork.tsx
│   │   │   ├── LogAnalyzer.tsx  # Main app component
│   │   │   ├── DashboardTab.tsx
│   │   │   ├── LiveLogsTab.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MiniSidebar.tsx
│   │   │   ├── LogSourceConfig.tsx
│   │   │   ├── SettingsDialog.tsx
│   │   │   ├── LogsDataTable.tsx
│   │   │   ├── LiveStreamingControls.tsx
│   │   │   ├── DraggableDashboard.tsx
│   │   │   └── ... (other components)
│   │   ├── services/
│   │   │   └── logService.ts    # Log fetching and streaming logic
│   │   ├── data/
│   │   │   └── sampleData.ts    # Sample log data
│   │   ├── types/
│   │   │   ├── logs.ts
│   │   │   └── user.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   └── logUtils.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── components.json          # shadcn/ui config
├── backend/                      # Backend API (to be implemented)
├── LOG_SOURCE_FLOW.md           # Log source documentation
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository** (if applicable)

2. **Install dependencies from root:**
   ```bash
   npm install
   ```

   Or install frontend dependencies only:
   ```bash
   cd frontend && npm install
   ```

### Development

**Start the frontend development server:**

```bash
# Option 1: Using npm script (Recommended)
npm run dev:frontend

# Option 2: Direct command
cd frontend && npm run dev

# Option 3: Using shell script
bash scripts/dev-frontend.sh
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# From root
npm run build:frontend

# Or from frontend directory
cd frontend && npm run build
```

## 📖 Usage Guide

### Getting Started

1. **Login** - Use any credentials (demo mode)
2. **Default View** - You'll see the "Live Logs" tab with sample data
3. **Navigate** - Use the sidebar or tabs to switch between:
   - **Dashboard** - Overview with key metrics and recent critical logs
   - **Live Logs** - Full log table with search and filters
   - **Analytics** - Comprehensive charts and visualizations

### Configuring Log Sources

1. Click the **Settings** icon in the header
2. Navigate to the **"Log Source"** tab
3. Select a source type:
   - **Sample Data** - Built-in sample logs (default)
   - **REST API** - Connect to a REST API endpoint
   - **WebSocket** - Real-time streaming via WebSocket
   - **Server-Sent Events** - Real-time streaming via SSE
   - **File Upload** - Upload and parse log files
4. Fill in the configuration fields
5. Click **"Test Connection"** (for API/WebSocket/SSE)
6. Enable/disable the source as needed
7. Configuration is automatically saved to localStorage

### Using Filters

1. Click the **"Filters"** button in the header
2. Select log levels, services, and environments
3. Active filters appear as removable chips
4. Click **"Clear all"** to remove all filters

### Date Range Selection

1. Click the **date range picker** in the header
2. Choose a preset (Last 24 hours, Last 7 days, etc.) or select a custom range
3. The selected range applies to all log queries

### Command Palette

- Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux)
- Quick access to:
  - Navigation (Dashboard, Live Logs, Analytics)
  - Recent searches
  - Log entries

### Live Streaming

1. Go to **Live Logs** tab
2. Click **"Start Live"** button
3. Monitor logs in real-time
4. Use **Pause/Resume** to control streaming
5. Toggle **Auto-scroll** to automatically scroll to new logs
6. View connection status and logs/second counter

### Analytics Dashboard

1. Go to **Analytics** tab
2. View all metric cards and charts
3. Click **"Customize"** to:
   - Show/hide widgets
   - Drag and drop to rearrange
   - Resize widgets
   - Reset layout
4. Layout is automatically saved

### Comparing Logs

1. In **Live Logs** tab, select logs using checkboxes
2. Click **"Compare Logs"** button
3. View side-by-side diff highlighting differences

## 🔧 Configuration

### Log Source Configuration

The application supports multiple log sources configured through the Settings dialog:

#### REST API
```typescript
{
  type: 'api',
  apiUrl: 'https://api.example.com',
  apiKey: 'your-api-key', // Optional
  enabled: true
}
```

#### WebSocket
```typescript
{
  type: 'websocket',
  streamUrl: 'ws://localhost:3000/logs/stream',
  enabled: true
}
```

#### Server-Sent Events
```typescript
{
  type: 'sse',
  streamUrl: 'http://localhost:3000/logs/stream',
  enabled: true
}
```

#### Sample Data (Default)
```typescript
{
  type: 'sample',
  enabled: true
}
```

Configuration is persisted in `localStorage` under the key `log-source-config`.

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

## 📊 Features Breakdown

### Dashboard Tab
- Welcome message
- Live streaming controls
- 3 key metric cards (Total Logs, Error Rate, Avg Response Time)
- Recent Critical Logs section (last 10 ERROR/WARNING logs)
- Link to "View All Logs"

### Live Logs Tab
- Search bar with natural language queries
- Active filter chips
- Full log data table with:
  - Column sorting
  - Column visibility toggle
  - Row selection
  - Expandable log details
  - Row actions menu
  - Zebra striping
  - Sticky headers
- Live streaming controls
- Comparison mode

### Analytics Tab
- 11 metric cards with color coding:
  - Total Logs, Error Rate, Avg Response Time
  - Active Alerts, MTTD, MTTR
  - Uptime, Success Rate, P95 Time
  - Cache Ratio, Failed Requests
- Service Status Cards (6 services with sparklines)
- Draggable Dashboard with 8 chart widgets:
  - Time Series Chart
  - Level Distribution (Pie)
  - Service Activity (Bar)
  - Error Heatmap (24h × 7 days)
  - Response Time Histogram
  - Today vs Yesterday Comparison
  - Top 5 Errors
  - Service Dependency Network

## 🏗️ Architecture

### Data Flow

```
┌─────────────────────────────────────────────────┐
│           LOG SOURCE LAYERS                     │
└─────────────────────────────────────────────────┘

1. DATA SOURCE
   ├── Sample Data (frontend/src/data/sampleData.ts)
   ├── REST API (via logService.ts)
   ├── WebSocket (via logService.ts)
   ├── SSE (via logService.ts)
   └── File Upload (via logService.ts)

2. SERVICE LAYER
   └── frontend/src/services/logService.ts
       ├── fetchLogsFromAPI()
       ├── connectWebSocketStream()
       ├── connectSSEStream()
       └── parseLogFile()

3. STATE MANAGEMENT
   └── LogAnalyzer.tsx
       ├── logSource state
       ├── logSourceConfig state
       ├── results state
       └── filters/dateRange state

4. UI COMPONENTS
   ├── DashboardTab
   ├── LiveLogsTab
   ├── AnalyticsTab (via DraggableDashboard)
   └── LogSourceConfig (Settings)
```

### Component Hierarchy

```
LogAnalyzer (Root)
├── Sidebar
├── Header
│   ├── DateRangePicker
│   ├── Filter Popover
│   └── User Menu
├── SystemHealthBanner
├── Tabs
│   ├── DashboardTab
│   │   ├── WelcomeMessage
│   │   ├── LiveStreamingControls
│   │   ├── StatisticsCards (3 cards)
│   │   └── Recent Critical Logs
│   ├── LiveLogsTab
│   │   ├── LiveStreamingControls
│   │   ├── SearchBar
│   │   ├── FilterChips
│   │   └── LogsDataTable
│   └── AnalyticsTab
│       ├── StatisticsCards (11 cards)
│       ├── ServiceStatusCards
│       └── DraggableDashboard
│           └── Chart Components (8 widgets)
├── MiniSidebar (Floating Button)
├── SettingsDialog
│   └── LogSourceConfig
└── CommandPalette
```

## 🧪 Development

### Available Scripts

**Root Level:**
- `npm run dev:frontend` - Start frontend dev server
- `npm run build:frontend` - Build frontend for production
- `npm run install:all` - Install all dependencies

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

1. **shadcn/ui components:**
   ```bash
   cd frontend
   npx shadcn@latest add [component-name]
   ```

2. **Custom components:**
   - Create in `frontend/src/components/`
   - Follow existing component patterns
   - Use TypeScript interfaces for props

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow shadcn/ui design patterns
- Support both light and dark modes
- Use CSS variables for theming:
  - `hsl(var(--background))`
  - `hsl(var(--foreground))`
  - `hsl(var(--card))`
  - etc.

## 📝 Documentation

- **LOG_SOURCE_FLOW.md** - Detailed documentation on log sources and data flow
- **COMPONENT_STRUCTURE.md** - Component structure and organization
- **SETUP.md** - Setup instructions

## 🔌 Backend Integration

To connect to a real backend:

1. **Configure Log Source:**
   - Open Settings → Log Source tab
   - Select "REST API" or "WebSocket" or "SSE"
   - Enter your backend URL
   - Test connection

2. **Backend Requirements:**
   - **REST API:** `POST /api/logs` endpoint
   - **WebSocket:** `ws://your-backend/logs/stream`
   - **SSE:** `http://your-backend/logs/stream` with `text/event-stream`

3. **Expected API Response Format:**
   ```typescript
   {
     summary: string;
     insights: string[];
     logs: LogEntry[];
   }
   ```

4. **LogEntry Format:**
   ```typescript
   {
     id: number;
     timestamp: string;
     level: 'ERROR' | 'WARNING' | 'INFO';
     service: string;
     message: string;
     details: string;
   }
   ```

See `LOG_SOURCE_FLOW.md` for detailed integration guide.

## 🎨 UI/UX Features

- **Dark Mode** - Toggle in Settings
- **Responsive Design** - Mobile, tablet, desktop support
- **Accessibility** - ARIA labels, keyboard navigation
- **Smooth Animations** - Transitions and hover effects
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Empty States** - Helpful messages when no data

## 🐛 Troubleshooting

### Common Issues

1. **Logs not loading:**
   - Check log source configuration in Settings
   - Verify backend connection (if using API/WebSocket/SSE)
   - Check browser console for errors

2. **Charts not displaying:**
   - Ensure data is loaded
   - Check browser console for errors
   - Verify Recharts is installed

3. **Styling issues:**
   - Clear browser cache
   - Restart dev server
   - Check Tailwind CSS configuration

4. **Connection test fails:**
   - Verify backend URL is correct
   - Check CORS settings on backend
   - Ensure backend is running

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**
