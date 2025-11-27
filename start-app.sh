#!/bin/bash

echo "Starting the NexusAI Studio application..."

# Check if backend dependencies are installed
if [ ! -d "/workspace/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd /workspace/backend && npm install --no-audit --no-fund --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "Failed to install backend dependencies"
        exit 1
    fi
fi

# Start the backend server in the background
echo "Starting backend server..."
cd /workspace/backend && npm run dev &
BACKEND_PID=$!

echo "Backend server started with PID: $BACKEND_PID"

# Check if frontend dependencies are installed
if [ -d "/workspace/node_modules" ]; then
    # If frontend dependencies exist, try to start the frontend
    echo "Starting frontend server..."
    cd /workspace && npm run dev &
    FRONTEND_PID=$!
    
    echo "Frontend server started with PID: $FRONTEND_PID"
    echo "Application is running!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5000"
else
    echo "Frontend dependencies not found. Backend is running on port 5000."
    echo "To run the full application, install frontend dependencies first:"
    echo "cd /workspace && npm install"
fi

# Keep the script running
wait $BACKEND_PID