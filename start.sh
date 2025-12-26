#!/bin/bash

# Personal Website Starter Script
# ================================

echo "🚀 Starting Personal Website..."
echo ""

# Navigate to project directory (in case script is run from elsewhere)
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the dev server
echo "🌐 Starting dev server..."
echo "   Open http://localhost:5173 in your browser"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
