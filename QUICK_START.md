# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 20.x LTS installed
- ✅ Docker Desktop installed and running
- ✅ Git installed

## Step-by-Step Setup

### 1. Start Database Services

First, make sure Docker Desktop is running, then start the database containers:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL with TimescaleDB (port 5432)
- Redis (port 6379)
- InfluxDB (port 8086)

Verify containers are running:
```bash
docker ps
```

You should see 3 containers: `smart-power-postgres`, `smart-power-redis`, and `smart-power-influxdb`.

### 2. Setup Environment Files

**Backend:**
```bash
cd backend
cp .env.example .env
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

The default values in `.env.example` should work for local development.

### 3. Start the Backend

```bash
cd backend
npm run start:dev
```

The backend will start on **http://localhost:3000**

You should see output like:
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
```

### 4. Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:5173**

You should see:
```
VITE v7.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api (when Swagger is configured)

## Troubleshooting

### Docker Issues

**Problem:** `Error response from daemon: Docker Desktop is unable to start`
- **Solution:** Start Docker Desktop manually and wait for it to fully start

**Problem:** `unable to get image 'influxdb:2.7-alpine'`
- **Solution:** Already fixed! We're using `influxdb:2.7` instead

### Backend Issues

**Problem:** `Cannot find module`
- **Solution:** Run `npm install --legacy-peer-deps` in the backend directory

**Problem:** `ECONNREFUSED` database connection errors
- **Solution:** Ensure Docker containers are running (`docker ps`)

### Frontend Issues

**Problem:** React dependency conflicts
- **Solution:** Run `npm install --legacy-peer-deps` in the frontend directory

**Problem:** `Cannot GET /` on http://localhost:5173
- **Solution:** Wait a few seconds for Vite to compile, then refresh

## Stopping the Application

### Stop Backend
Press `Ctrl + C` in the terminal running the backend

### Stop Frontend
Press `Ctrl + C` in the terminal running the frontend

### Stop Docker Containers
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

## Next Steps

Once everything is running, you can:

1. **Explore the codebase**
   - Backend modules are in `backend/src/modules/`
   - Frontend components are in `frontend/src/components/`

2. **Read the plan**
   - Check `Plans/async-rolling-newell.md` for the full implementation plan

3. **Check the README**
   - See `README.md` for API endpoints and WebSocket events

4. **Start development**
   - Phase 1 (Foundation) is complete!
   - Next: Phase 2 (Real-Time Infrastructure)

## Important Notes

- **TensorFlow.js** was removed from dependencies due to Windows build requirements. For ML features, we'll use a Python microservice instead (optional, will be set up in Phase 6).

- **@visx** library was removed due to React 19 incompatibility. We'll use D3.js directly for advanced visualizations.

- **Default credentials:**
  - PostgreSQL: `postgres` / `postgres`
  - InfluxDB: `admin` / `adminpassword`
  - Change these in production!

## Development Commands

### Backend
```bash
npm run start:dev    # Start in development mode with hot reload
npm run start:debug  # Start in debug mode
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Health Checks

Verify each service is healthy:

```bash
# PostgreSQL
docker exec smart-power-postgres pg_isready -U postgres

# Redis
docker exec smart-power-redis redis-cli ping

# InfluxDB
curl http://localhost:8086/health
```

All should return positive responses.

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Review the implementation plan in `Plans/async-rolling-newell.md`
- Look at configuration files in `backend/src/config/` for settings

Happy coding! 🚀