#!/bin/bash

# Script to run the frontend development server

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "🚀 Starting Frontend Development Server..."
echo "📁 Frontend directory: $FRONTEND_DIR"

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: Frontend directory not found at $FRONTEND_DIR"
    exit 1
fi

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Start the development server
echo "🌐 Starting Vite dev server..."
npm run dev

