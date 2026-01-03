import { Box, Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAppSelector } from '@/store/hooks';
import SolarPowerIcon from '@mui/icons-material/WbSunny';
import WindPowerIcon from '@mui/icons-material/Air';

const RESMonitor = () => {
  const resUnits = useAppSelector(state => state.res.units);
  const history = useAppSelector(state => state.res.history);

  const solarUnits = Object.values(resUnits).filter(unit => unit.type === 'SOLAR');
  const windUnits = Object.values(resUnits).filter(unit => unit.type === 'WIND');

  // Prepare combined power output chart
  const powerChartData = Object.keys(history).length > 0
    ? history[Object.keys(history)[0]]?.slice(-30).map((_, idx) => {
        const dataPoint: any = {
          time: new Date(history[Object.keys(history)[0]][idx]?.timestamp || Date.now()).toLocaleTimeString(),
        };
        Object.keys(history).forEach(unitId => {
          if (history[unitId][idx]) {
            dataPoint[unitId] = history[unitId][idx].power_output.toFixed(2);
          }
        });
        return dataPoint;
      }) || []
    : [];

  const colors = {
    'SOLAR-001': '#FFA500',
    'SOLAR-002': '#FFD700',
    'WIND-001': '#4682B4',
    'WIND-002': '#87CEEB',
  };

  const getIcon = (type: string) => {
    return type === 'SOLAR' ? <SolarPowerIcon /> : <WindPowerIcon />;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Solar Units */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <SolarPowerIcon sx={{ mr: 1 }} /> Solar Power Units
              </Typography>
              <Grid container spacing={2}>
                {solarUnits.map(unit => (
                  <Grid item xs={12} key={unit.id}>
                    <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">{unit.id}</Typography>
                          <Chip
                            label={`${unit.power_output.toFixed(2)} kW`}
                            color="warning"
                            size="small"
                          />
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Irradiance: <strong>{unit.irradiance?.toFixed(0)} W/m²</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Efficiency: <strong>{unit.efficiency?.toFixed(1)}%</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Temperature: <strong>{unit.temperature?.toFixed(1)}°C</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Wind Units */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <WindPowerIcon sx={{ mr: 1 }} /> Wind Power Units
              </Typography>
              <Grid container spacing={2}>
                {windUnits.map(unit => (
                  <Grid item xs={12} key={unit.id}>
                    <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">{unit.id}</Typography>
                          <Chip
                            label={`${unit.power_output.toFixed(2)} kW`}
                            color="info"
                            size="small"
                          />
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Wind Speed: <strong>{unit.wind_speed?.toFixed(1)} m/s</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Temperature: <strong>{unit.temperature?.toFixed(1)}°C</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Combined Power Output Chart */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-Time Power Generation
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={powerChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {Object.keys(resUnits).map((unitId) => (
                      <Bar
                        key={unitId}
                        dataKey={unitId}
                        fill={colors[unitId as keyof typeof colors] || '#8884d8'}
                        stackId="stack"
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Individual Unit Trends */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Power Output Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={powerChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {Object.keys(resUnits).map((unitId) => (
                      <Line
                        key={unitId}
                        type="monotone"
                        dataKey={unitId}
                        stroke={colors[unitId as keyof typeof colors] || '#8884d8'}
                        dot={false}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RESMonitor;
