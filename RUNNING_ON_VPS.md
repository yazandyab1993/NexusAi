# Running Your Website on Ubuntu VPS - Step by Step Guide

## Prerequisites
- Ubuntu VPS with Node.js and npm installed
- At least 1GB of RAM recommended (your current VPS has 534MB which is quite limited)

## Understanding Your Application
This is a full-stack application with:
- Frontend: React/Vite application (runs on port 3000)
- Backend: Express.js server (runs on port 5000)
- Requires GEMINI_API_KEY for the frontend
- Requires database configuration for the backend

## Step-by-Step Instructions

### Step 1: Check Available Memory
```bash
free -h
```

### Step 2: Install Backend Dependencies First (Completed)
The backend dependencies have already been installed in the /workspace/backend directory.

### Step 3: Backend Configuration
1. Navigate to the backend directory:
```bash
cd /workspace/backend
```

2. Update the .env file with your database credentials if needed:
```bash
nano /workspace/backend/.env
```

3. Make sure PostgreSQL is installed and running on your system:
```bash
# Install PostgreSQL (if not already installed)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set up the database
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE nexusai_studio OWNER postgres;"
```

### Step 4: Run the Backend Server
```bash
cd /workspace/backend && npm run dev
```

### Step 5: Frontend Setup (Alternative Approach Due to Memory Constraints)
Since your VPS has limited memory (534MB), installing frontend dependencies might fail. Here are two approaches:

#### Approach A: If you have more than 1GB RAM available
1. Go to the frontend directory:
```bash
cd /workspace
```

2. Create the required environment file:
```bash
echo "GEMINI_API_KEY=your-actual-gemini-api-key-here" > /workspace/.env.local
```

3. Install frontend dependencies:
```bash
npm install
```

4. Run the frontend:
```bash
npm run dev
```

#### Approach B: Build Frontend on Another Machine (Recommended for Low Memory VPS)
1. Build the frontend on a machine with more RAM
2. Upload the built files to your VPS
3. Serve the built frontend with a static server

### Step 6: Alternative - Run Backend Only
If you can't run the frontend due to memory constraints, you can run just the backend API:
```bash
cd /workspace/backend && npm run dev
```

### Step 7: Configure Reverse Proxy (Optional)
To serve both on the same domain, you can use nginx as a reverse proxy:

1. Install nginx:
```bash
sudo apt update && sudo apt install nginx
```

2. Configure nginx to proxy requests to your backend and frontend servers.

### Step 8: Running in Production
For production deployment, consider:

1. Using a process manager like PM2:
```bash
npm install -g pm2
```

2. Start your applications with PM2:
```bash
cd /workspace/backend && pm2 start server.js --name backend
```

### Important Notes:
- Your current VPS has limited RAM (534MB), which makes running a full React development server challenging
- Consider upgrading your VPS or using a build process on a more powerful machine
- You'll need to get a GEMINI_API_KEY from Google AI Studio to run the frontend
- The backend uses PostgreSQL, ensure your database is running and configured

### Ports Used:
- Frontend: 3000
- Backend: 5000

### Firewall Configuration:
If you have UFW enabled, allow the necessary ports:
```bash
sudo ufw allow 3000
sudo ufw allow 5000
```