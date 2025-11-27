# Quick Start Guide for Running Your Website

## Current Status
- Backend dependencies: ✅ Already installed
- Frontend dependencies: ❌ Cannot install due to memory constraints (534MB RAM is insufficient)
- API Key: Need to set up GEMINI_API_KEY

## Memory Issue
Your VPS has 534MB of RAM, which is insufficient to install the frontend dependencies. You have two options:

### Option 1: Upgrade Your VPS (Recommended)
- Upgrade to at least 1GB RAM to run both frontend and backend
- This will allow you to install and run all components normally

### Option 2: Use a Build Process on Another Machine
1. Get access to a machine with more RAM (laptop/desktop)
2. Install Node.js and npm
3. Clone your project
4. Install dependencies and build the frontend:
   ```bash
   cd /workspace
   npm install
   npm run build
   ```
5. Upload the built files to your VPS
6. Serve the built frontend with a static server

### Option 3: Run Backend Only (Current Possibility)
You can run just the backend API server since dependencies are already installed:

```bash
cd /workspace/backend
npm run dev
```

## How to Run What's Available Now

1. Make sure you have your GEMINI_API_KEY from Google AI Studio
2. To start the backend server only:
   ```bash
   cd /workspace/backend
   npm run dev
   ```
   The backend will run on port 5000

## Environment Configuration
1. For backend, edit the .env file:
   ```bash
   nano /workspace/backend/.env
   ```
   
2. For frontend, you would need to set:
   ```bash
   # Replace with your actual Gemini API key
   echo "GEMINI_API_KEY=your-actual-api-key" > /workspace/.env.local
   ```

## Ports
- Frontend: 3000 (requires frontend dependencies to be installed)
- Backend: 5000 (can run now)

## Running the Application
To run the backend server:
```bash
/workspace/start-app.sh
```

## Important Notes
- Your limited RAM (534MB) is the main constraint
- The application needs PostgreSQL database running
- You need a GEMINI_API_KEY from Google AI Studio
- PostgreSQL setup commands:
  ```bash
  # Install PostgreSQL
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  
  # Start and enable PostgreSQL service
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  
  # Set up the database
  sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
  sudo -u postgres psql -c "CREATE DATABASE nexusai_studio OWNER postgres;"
  ```