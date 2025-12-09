#!/usr/bin/env node

/**
 * Script to run the frontend development server
 * Usage: node scripts/dev-frontend.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');

console.log('🚀 Starting Frontend Development Server...');
console.log(`📁 Frontend directory: ${frontendDir}`);

// Check if frontend directory exists
if (!fs.existsSync(frontendDir)) {
  console.error('❌ Error: Frontend directory not found');
  process.exit(1);
}

process.chdir(frontendDir);

// Check if node_modules exists
const nodeModulesPath = path.join(frontendDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error installing dependencies');
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Start the development server
console.log('🌐 Starting Vite dev server...');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  // This is expected when the server is stopped with Ctrl+C
  process.exit(0);
}

