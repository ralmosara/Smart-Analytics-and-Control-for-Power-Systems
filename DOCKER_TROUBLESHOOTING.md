# Docker Troubleshooting Guide

## Issue: "unexpected end of JSON input" when pulling images

This error typically indicates Docker Desktop is having issues communicating with Docker Hub.

### Quick Fixes (try in order):

1. **Restart Docker Desktop**
   - Completely quit Docker Desktop
   - Wait 10 seconds
   - Start Docker Desktop again
   - Wait for it to fully start (whale icon should be steady)
   - Try `docker-compose up -d` again

2. **Clear Docker Cache**
   ```bash
   docker system prune -a
   ```
   Warning: This removes all unused containers, networks, images

3. **Check Docker Desktop Settings**
   - Open Docker Desktop
   - Go to Settings → Docker Engine
   - Ensure it's running properly
   - Try toggling "Use WSL 2 based engine" if on Windows

4. **Manual Image Pull**
   Try pulling images one by one:
   ```bash
   docker pull timescale/timescaledb:2.14.2-pg16
   docker pull redis:7
   docker pull influxdb:2.7
   ```

5. **Check Network/Firewall**
   - Disable VPN temporarily
   - Check if firewall is blocking Docker
   - Try from a different network

## Alternative: Develop Without Docker (Recommended for now)

Since Docker is having issues, you can develop without it initially:

### Option 1: Use PostgreSQL Locally (Windows)

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/windows/
   - Install PostgreSQL 16
   - Set password as `postgres`

2. **Update backend/.env**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=smart_power_db
   ```

3. **Create database**
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE smart_power_db;
   \q
   ```

### Option 2: Skip Databases for Initial Development

You can start developing the backend/frontend structure without databases:

1. **Comment out database imports** in backend for now
2. **Focus on API structure** and frontend
3. **Add databases later** when Docker is working

### Option 3: Use SQLite for Development

Modify TypeORM config to use SQLite temporarily:

```typescript
// backend/src/config/database.config.ts
{
  type: 'better-sqlite3',
  database: 'dev.db',
  synchronize: true,
  // ... rest of config
}
```

Install SQLite driver:
```bash
cd backend
npm install better-sqlite3 --save
```

## Current Recommendation

**Proceed without Docker for now:**

1. ✅ Backend and Frontend are already set up
2. ✅ All dependencies installed
3. ⏭️ Skip Docker temporarily
4. 🚀 Start development with in-memory or SQLite database
5. 🔄 Add Docker/PostgreSQL later when issue is resolved

You can still build all the features - just swap the database connection later!

## Next Steps

Would you like me to:
1. Configure the backend to work without Docker (using SQLite)?
2. Continue with Phase 2 implementation (WebSocket, modules)?
3. Help resolve the Docker issue further?

The project is ready to develop - Docker is just for the databases, which can be added later!