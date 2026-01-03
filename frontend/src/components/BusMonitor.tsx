import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAppSelector } from '@/store/hooks';

const BusMonitor = () => {
  const buses = useAppSelector(state => state.bus.buses);
  const history = useAppSelector(state => state.bus.history);

  // Prepare voltage magnitude chart data
  const voltageChartData = Object.keys(history).length > 0
    ? history[Object.keys(history)[0]]?.slice(-30).map((_, idx) => {
        const dataPoint: any = {
          time: new Date(history[Object.keys(history)[0]][idx]?.timestamp || Date.now()).toLocaleTimeString(),
        };
        Object.keys(history).forEach(busId => {
          if (history[busId][idx]) {
            dataPoint[busId] = history[busId][idx].voltage_magnitude.toFixed(3);
          }
        });
        return dataPoint;
      }) || []
    : [];

  // Prepare frequency chart data
  const frequencyChartData = Object.keys(history).length > 0
    ? history[Object.keys(history)[0]]?.slice(-30).map((_, idx) => {
        const dataPoint: any = {
          time: new Date(history[Object.keys(history)[0]][idx]?.timestamp || Date.now()).toLocaleTimeString(),
        };
        Object.keys(history).forEach(busId => {
          if (history[busId][idx]) {
            dataPoint[busId] = history[busId][idx].frequency.toFixed(3);
          }
        });
        return dataPoint;
      }) || []
    : [];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Individual Bus Cards */}
        {Object.values(buses).map((bus) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={bus.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  {bus.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Voltage: <strong>{bus.voltage_magnitude.toFixed(3)} pu</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Angle: <strong>{bus.voltage_angle.toFixed(2)}°</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Freq: <strong>{bus.frequency.toFixed(3)} Hz</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  P: <strong>{bus.power_active.toFixed(2)} MW</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Q: <strong>{bus.power_reactive.toFixed(2)} MVAR</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Voltage Magnitude Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voltage Magnitude (pu)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={voltageChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0.95, 1.05]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {Object.keys(buses).map((busId, idx) => (
                      <Line
                        key={busId}
                        type="monotone"
                        dataKey={busId}
                        stroke={colors[idx % colors.length]}
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

        {/* Frequency Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Frequency (Hz)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={frequencyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis domain={[59.9, 60.1]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {Object.keys(buses).map((busId, idx) => (
                      <Area
                        key={busId}
                        type="monotone"
                        dataKey={busId}
                        stroke={colors[idx % colors.length]}
                        fill={colors[idx % colors.length]}
                        fillOpacity={0.3}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusMonitor;
