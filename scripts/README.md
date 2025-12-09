# Scripts

This directory contains utility scripts for the project.

## Available Scripts

### `dev-frontend.sh`
Bash script to run the frontend development server.

**Usage:**
```bash
bash scripts/dev-frontend.sh
# or
./scripts/dev-frontend.sh
```

**What it does:**
1. Checks if frontend directory exists
2. Installs dependencies if `node_modules` doesn't exist
3. Starts the Vite development server

### `dev-frontend.js`
Node.js script alternative to run the frontend.

**Usage:**
```bash
node scripts/dev-frontend.js
```

## Using npm scripts (Recommended)

You can also use the npm scripts defined in the root `package.json`:

```bash
# From root directory
npm run dev:frontend        # Run frontend using workspace
npm run dev:frontend:script # Run frontend using shell script
```

## Quick Start

The easiest way to run the frontend:

```bash
# Option 1: Using npm script (recommended)
npm run dev:frontend

# Option 2: Using shell script
bash scripts/dev-frontend.sh

# Option 3: Direct command
cd frontend && npm install && npm run dev
```

