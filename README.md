# Smart Analytics and Control Platform for Power Systems

A scalable hybrid monitoring and analysis platform built with NestJS (backend) and React (frontend) featuring advanced interactive graph visualizations for power systems control and analytics.

## 🚀 Current Status

**Phase 3 Complete** - Real-time monitoring dashboard is now operational!

- ✅ Backend API running with WebSocket support
- ✅ Three simulators generating realistic power system data
- ✅ React dashboard with live D3.js network topology
- ✅ Real-time charts for converters, buses, and RES units
- ✅ Redux state management with data history
- ✅ Material-UI responsive interface

**Quick Access**:
- 🚀 [Quick Start Guide](QUICK_START.md)
- 📊 [Dashboard User Guide](DASHBOARD_GUIDE.md)
- 📝 [Phase 3 Technical Details](PHASE_3_COMPLETE.md)
- 📄 [Session Summary](SESSION_SUMMARY.md)

## Overview

This platform implements advanced control methodologies, intelligent data analytics, and optimization techniques for modern power systems based on cutting-edge research in:
- Power converter control (PI, SMC, MPC)
- Network reliability analysis (SAIFI, SAIDI, EENS)
- Renewable energy forecasting (LSTM, ANN)
- ML-based fault detection and anomaly detection

## Core Features

### 1. Converter Control Visualization
- Real-time monitoring of power converter control loops
- Implementation of PI, Sliding Mode Control (SMC), and Model Predictive Control (MPC)
- d-q axis current tracking visualization
- THD (Total Harmonic Distortion) analysis

### 2. Network Reliability Metrics
- Calculate and track reliability indices: SAIFI, SAIDI, CAIDI, EENS, ASIFI
- Outage event tracking and analysis
- Zone-wise reliability breakdown
- Historical trend analysis

### 3. RES Forecasting & Optimization
- ML-based 24-hour ahead forecasting for solar and wind energy
- LSTM and ANN models with confidence intervals
- PSO and GA optimization algorithms for dispatch
- Model performance metrics (MAE, RMSE)

### 4. Fault/Anomaly Detection
- ML-based SCADA data analysis
- Fault classification (fault vs attack vs maintenance)
- Sequence component analysis (I0, I1, I2)
- Real-time anomaly detection

## Technology Stack

### Backend
- **Framework**: NestJS 11.x with TypeScript 5.x
- **Databases**:
  - PostgreSQL 16 with TimescaleDB (time-series data)
  - Redis 7 (caching, pub/sub, job queues)
  - InfluxDB 2.7 (high-frequency IoT data)
- **Key Libraries**:
  - TypeORM (ORM)
  - Bull (job queue)
  - Socket.io (WebSocket)
  - Passport.js + JWT (authentication)
  - TensorFlow.js (ML models)

### Frontend
- **Framework**: React 19.x with TypeScript, Vite 7.x
- **State Management**: Redux Toolkit + RTK Query
- **Visualizations**:
  - D3.js v7 (network topology, complex charts)
  - Recharts (time-series charts)
  - Three.js (3D network visualization)
  - @visx/visx (advanced D3 React components)
- **UI Framework**: Material-UI (MUI) v6

## Project Structure

```
Smart-Analytics-and-Control-for-Power-Systems/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/
│   │   │   ├── converters/
│   │   │   ├── network-analysis/
│   │   │   ├── res-forecasting/
│   │   │   ├── reliability/
│   │   │   ├── ml-analytics/
│   │   │   ├── data-ingestion/
│   │   │   ├── optimization/
│   │   │   └── notifications/
│   │   ├── config/         # Configuration files
│   │   ├── common/         # Shared utilities
│   │   └── database/       # Migrations and seeds
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── visualizations/ # D3/Three.js visualizations
│   └── package.json
├── docker-compose.yml      # Docker services
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-Analytics-and-Control-for-Power-Systems
   ```

2. **Start database services**
   ```bash
   docker-compose up -d
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run start:dev
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

### Docker Services

The `docker-compose.yml` provides the following services:

- **PostgreSQL with TimescaleDB** (port 5432)
  - Main database with time-series extension
  - Database: `smart_power_db`
  - User: `postgres` / Password: `postgres`

- **Redis** (port 6379)
  - Caching and pub/sub for WebSocket scaling
  - Job queue backend (Bull)

- **InfluxDB** (port 8086)
  - High-frequency sensor data storage
  - Organization: `smart-power`
  - Token: `my-super-secret-auth-token`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get user profile

### Converters
- `GET /api/v1/converters` - List all converters
- `GET /api/v1/converters/:id` - Get converter details
- `POST /api/v1/converters/:id/control` - Update control parameters
- `GET /api/v1/converters/:id/states` - Get historical states

### Network Analysis
- `GET /api/v1/network/buses` - List all buses
- `GET /api/v1/network/topology` - Get network topology
- `POST /api/v1/network/power-flow` - Run power flow calculation
- `POST /api/v1/network/stability` - Stability analysis

### RES Forecasting
- `GET /api/v1/res/units` - List RES units
- `POST /api/v1/res/forecast` - Trigger 24-hour forecast
- `GET /api/v1/res/forecasts` - Get forecast results

### Reliability
- `GET /api/v1/reliability/metrics` - Get reliability metrics
- `GET /api/v1/reliability/outages` - List outage events

### ML Analytics
- `POST /api/v1/analytics/fault-detection` - Classify fault events
- `GET /api/v1/analytics/anomalies` - Recent anomalies

### Optimization
- `POST /api/v1/optimization/res-dispatch` - Optimize RES dispatch
- `GET /api/v1/optimization/jobs/:id` - Get optimization results

## WebSocket Events

### Client → Server
- `subscribe:converters` - Subscribe to converter updates
- `subscribe:buses` - Subscribe to bus measurements
- `subscribe:res-units` - Subscribe to RES generation

### Server → Client
- `converter:state` - Real-time converter state updates
- `bus:measurement` - Bus voltage/frequency updates
- `res:generation` - RES generation updates
- `fault:detected` - Fault event notifications
- `anomaly:detected` - Anomaly detection alerts

## Development Phases

- [x] **Phase 1**: Foundation Setup (Project initialization, Docker, Dependencies) - [COMPLETE](QUICK_START.md)
- [x] **Phase 2**: Real-Time Infrastructure (WebSocket, Data Ingestion, Simulators) - [COMPLETE](PHASE_2_COMPLETE.md)
- [x] **Phase 3**: Frontend Dashboard (React, Redux, D3.js, Real-time Charts) - [COMPLETE](PHASE_3_COMPLETE.md)
- [ ] **Phase 4**: Database Integration & Persistence
- [ ] **Phase 5**: Converter Control Algorithms (PI, SMC, MPC)
- [ ] **Phase 6**: Network Analysis & Reliability Metrics
- [ ] **Phase 7**: RES Forecasting Module (LSTM, ANN)
- [ ] **Phase 8**: ML Analytics & Fault Detection
- [ ] **Phase 9**: Optimization Module (PSO, GA)
- [ ] **Phase 10**: Authentication & Authorization
- [ ] **Phase 11**: Testing & Documentation
- [ ] **Phase 12**: Deployment & Production Setup

## Key Design Decisions

### Data Flow Architecture
- **Real-time**: IoT/SCADA → Data Ingestion → TimescaleDB → WebSocket → Redis Pub/Sub → React clients
- **Analytics**: Historical data → Feature extraction → ML models → Results storage → WebSocket notification → UI update
- **Forecasting**: Job trigger → Bull queue → Fetch data → ML model → Store forecast → Calculate metrics → Notify frontend

### Scalability Strategy
- Redis adapter for WebSocket scaling across multiple backend instances
- TimescaleDB continuous aggregates for query performance
- Bull job queues for heavy computations
- Nginx load balancing for horizontal scaling
- Caching frequently accessed data (topology, metrics)

## Research References

This platform implements concepts from three power systems research papers:
1. **Advanced Control Methodologies For Power Converter** - PI, SMC, MPC implementations
2. **Power Systems Research and Operation** - Reliability metrics, stability analysis
3. **Intelligent Data Analytics for Power and Energy** - ML-based forecasting and fault detection

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

This project is licensed under the UNLICENSED license.

## Support

For issues and questions, please create an issue in the GitHub repository.
