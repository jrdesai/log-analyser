# Project Structure

This project is organized as a monorepo with separate frontend and backend applications.

## Directory Structure

```
ai-log-analyzer/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── LogAnalyzer.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── components.json
│
├── backend/                  # Backend API (to be added)
│   └── README.md
│
├── package.json             # Root workspace configuration
├── README.md                # Main project documentation
└── .gitignore
```

## Workspace Management

The root `package.json` uses npm workspaces to manage both frontend and backend as separate packages.

### Benefits:
- Shared dependencies at root level (optional)
- Unified scripts to run frontend/backend together
- Better organization for monorepo structure
- Easier dependency management

## Development Workflow

### Working on Frontend Only
```bash
cd frontend
npm install
npm run dev
```

### Working on Backend Only (when added)
```bash
cd backend
npm install
npm run dev
```

### Working on Both (from root)
```bash
npm install              # Install root and workspace dependencies
npm run dev:frontend     # Start frontend
npm run dev:backend      # Start backend (when ready)
```

## Adding Backend

When you're ready to add the backend:

1. Create `backend/package.json` with your backend dependencies
2. Add backend scripts to root `package.json`
3. The backend folder is already set up as a workspace

## Notes

- Each workspace (frontend/backend) has its own `package.json`
- Dependencies are managed per workspace
- Root `package.json` provides convenience scripts
- Each workspace can be developed independently

