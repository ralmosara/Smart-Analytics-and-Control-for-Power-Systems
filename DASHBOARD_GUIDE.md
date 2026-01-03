# Dashboard User Guide

## Accessing the Dashboard

1. **Start the Backend** (if not already running):
   ```bash
   cd backend
   npm run start:dev
   ```
   Backend will be available at: http://localhost:3000

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at: http://localhost:5174

3. **Start the Simulation**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/data/simulation/start
   ```
   Or use Swagger at http://localhost:3000/api

## Dashboard Layout

### Main Sections

#### 1. Network Topology (Top Left)
- Interactive D3.js force-directed graph
- **Features**:
  - 5 buses represented as colored circles
  - 6 transmission lines connecting buses
  - Color coding:
    - 🟢 Green: Normal voltage (0.95-1.05 pu)
    - 🟠 Orange: Overvoltage (>1.05 pu)
    - 🔴 Red: Undervoltage (<0.95 pu)
  - Live voltage labels below each bus
- **Interactions**:
  - Drag nodes to rearrange layout
  - Scroll to zoom in/out
  - Click and drag background to pan

#### 2. Power Converters (Top Right)
- Three converter monitoring cards
- **CONV-001 (TWO_LEVEL)** - Blue chip
- **CONV-002 (NPC)** - Purple chip
- **CONV-003 (BUCK)** - Green chip
- **Metrics Displayed**:
  - d-axis Current (A) - Controls active power
  - q-axis Current (A) - Controls reactive power
  - DC-Link Voltage (V)
  - Active Power (kW)
  - Reactive Power (kVAR)
  - THD (Total Harmonic Distortion %)
  - Temperature (°C) with color-coded status:
    - 🟢 Green: <70°C (Normal)
    - 🟡 Yellow: 70-80°C (Warning)
    - 🔴 Red: >80°C (Critical)
- **Live Chart**: Shows last 20 seconds of i_d, i_q, and power

#### 3. Bus Voltages and Power Flow (Middle)
- Five bus status cards (BUS-001 to BUS-005)
- **Individual Bus Metrics**:
  - Voltage Magnitude (per unit)
  - Voltage Angle (degrees)
  - Frequency (Hz)
  - Active Power (MW)
  - Reactive Power (MVAR)
- **Voltage Magnitude Chart**:
  - Line chart showing all 5 buses
  - Y-axis range: 0.95-1.05 pu (acceptable limits)
  - Updates every second
- **System Frequency Chart**:
  - Area chart with all buses overlaid
  - Y-axis range: 59.9-60.1 Hz (tight zoom on nominal)
  - Color-filled for easy visualization

#### 4. Renewable Energy Sources (Bottom)
- **Solar Power Units** (Left):
  - SOLAR-001 and SOLAR-002
  - Shows: Irradiance (W/m²), Efficiency (%), Temperature (°C), Power (kW)
  - Orange color theme
- **Wind Power Units** (Right):
  - WIND-001 and WIND-002
  - Shows: Wind Speed (m/s), Temperature (°C), Power (kW)
  - Blue color theme
- **Combined Power Generation Chart**:
  - Stacked bar chart showing total RES output
  - Different colors for each unit
- **Power Output Trends**:
  - Line chart tracking individual unit performance over time
  - Last 30 data points visible

#### 5. Alert Panel (Top, appears when alerts exist)
- Real-time fault and anomaly notifications
- **Color Coding**:
  - 🔴 Red: Critical/High severity
  - 🟡 Yellow: Medium severity
  - 🔵 Blue: Low severity/Info
- **Features**:
  - Shows last 5 unacknowledged alerts
  - Click X to acknowledge and dismiss
  - Timestamp for each alert

## Real-Time Data Flow

### Update Frequencies
- **Converters**: Every 500ms (2 updates/second per converter)
- **Buses**: Every 1 second (1 update/second per bus)
- **RES Units**: Every 2 seconds (0.5 updates/second per unit)

### Data Points
The dashboard automatically maintains a rolling history:
- Last 100 data points per converter
- Last 100 data points per bus
- Last 100 data points per RES unit

This allows smooth chart animations and trend analysis.

## Understanding the Metrics

### Converter Metrics

**d-axis Current (i_d)**:
- Controls active power output
- Directly proportional to real power
- Typical range: 45-55 A

**q-axis Current (i_q)**:
- Controls reactive power output
- Manages voltage support
- Typical range: 8-12 A

**DC-Link Voltage (v_dc)**:
- Intermediate DC voltage in converter
- Should remain stable
- Typical range: 395-405 V

**THD (Total Harmonic Distortion)**:
- Measure of power quality
- Lower is better
- Typical range: 2-5%
- Target: <5% per IEEE standards

### Bus Metrics

**Voltage Magnitude (pu)**:
- Per-unit voltage relative to nominal
- Acceptable range: 0.95-1.05 pu
- 1.0 pu = nominal voltage (e.g., 230V, 400V)

**Voltage Angle**:
- Phase angle difference from reference bus
- Indicates power flow direction
- Larger angles = more power transfer

**Frequency**:
- System frequency (nominal: 60 Hz)
- Very tight control required
- Acceptable range: 59.9-60.1 Hz

### RES Metrics

**Solar Irradiance**:
- Solar radiation intensity (W/m²)
- Range: 0-1000 W/m² (clear day)
- Peak: ~1000 W/m² at solar noon

**Wind Speed**:
- Speed of wind hitting turbine (m/s)
- Cut-in: ~3 m/s (starts generating)
- Rated: ~12 m/s (maximum power)
- Cut-out: ~25 m/s (safety shutdown)

**Power Output**:
- Actual generated power (kW)
- Solar: Proportional to irradiance × efficiency
- Wind: Proportional to wind speed³

## Tips for Using the Dashboard

### Performance
- The dashboard updates in real-time with minimal lag (<50ms)
- Charts use efficient rendering (Canvas/SVG)
- History limited to prevent memory issues

### Customization
- Drag network topology nodes to organize layout
- Force simulation will naturally space nodes
- Zoom in on specific chart regions

### Monitoring
- Watch for color changes in network topology (voltage issues)
- Monitor converter temperature chips
- Check alert panel for system warnings

### Testing
1. Start simulation: `POST /api/v1/data/simulation/start`
2. Watch data stream into charts
3. Observe natural variations in all metrics
4. Network topology should show all green nodes (normal voltage)
5. Converter charts should show smooth sinusoidal patterns

### Stopping
- Stop simulation: `POST /api/v1/data/simulation/stop`
- Check status: `GET /api/v1/data/simulation/status`
- Data will stop updating but last values remain visible

## Troubleshooting

### No Data Appearing
1. Check backend is running: http://localhost:3000/api
2. Verify simulation is started
3. Check browser console for WebSocket errors
4. Ensure no firewall blocking ports 3000 or 5174

### WebSocket Not Connecting
- Check backend logs for WebSocket gateway initialization
- Verify CORS settings allow localhost:5174
- Try refreshing the page

### Slow Performance
- Reduce number of chart data points (edit maxHistorySize in Redux slices)
- Close other browser tabs
- Check CPU usage (D3.js force simulation is CPU-intensive)

### Charts Not Updating
- Check Redux DevTools to verify state updates
- Ensure WebSocket connection status shows "connected"
- Verify simulation is running

## Next Features (Coming Soon)

- User authentication and personalized dashboards
- Configurable alert thresholds
- Historical data playback
- Export charts as PNG/PDF
- CSV data upload
- Dark mode theme
- Custom chart time ranges
- Zoom and brush selection on charts
- Comparison mode (compare different time periods)
- Custom dashboard layouts (drag-and-drop widgets)

## API Testing with Swagger

Visit http://localhost:3000/api to access interactive API documentation:
- Test all REST endpoints
- View request/response schemas
- Start/stop simulation
- Check system status

## WebSocket Testing

Use browser console to test WebSocket:
```javascript
const socket = io('http://localhost:3000/realtime');
socket.on('connect', () => console.log('Connected!'));
socket.emit('subscribe:converters', ['CONV-001']);
socket.on('converter:update', (data) => console.log('Converter data:', data));
```

## Support

For issues or questions:
1. Check [README.md](README.md) for general information
2. Review [PHASE_3_COMPLETE.md](PHASE_3_COMPLETE.md) for technical details
3. Examine browser console for error messages
4. Check backend logs for server-side issues
