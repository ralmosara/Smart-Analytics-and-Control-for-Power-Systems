import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/store/hooks';

const ConverterMonitor = () => {
  const converters = useAppSelector(state => state.converter.converters);
  const history = useAppSelector(state => state.converter.history);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TWO_LEVEL': return 'primary';
      case 'NPC': return 'secondary';
      case 'BUCK': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (temperature: number) => {
    if (temperature > 80) return 'error';
    if (temperature > 70) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {Object.values(converters).map((converter) => {
          const converterHistory = history[converter.id] || [];
          const chartData = converterHistory.slice(-20).map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            i_d: item.i_d.toFixed(2),
            i_q: item.i_q.toFixed(2),
            v_dc: item.v_dc.toFixed(2),
            power: item.power_active.toFixed(2),
            thd: item.thd.toFixed(2),
          }));

          return (
            <Grid item xs={12} key={converter.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{converter.id}</Typography>
                    <Box>
                      <Chip
                        label={converter.type}
                        color={getTypeColor(converter.type)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${converter.temperature.toFixed(1)}°C`}
                        color={getStatusColor(converter.temperature)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        d-axis Current: <strong>{converter.i_d.toFixed(2)} A</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        q-axis Current: <strong>{converter.i_q.toFixed(2)} A</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        DC-Link Voltage: <strong>{converter.v_dc.toFixed(2)} V</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Active Power: <strong>{converter.power_active.toFixed(2)} kW</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reactive Power: <strong>{converter.power_reactive.toFixed(2)} kVAR</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        THD: <strong>{converter.thd.toFixed(2)}%</strong>
                      </Typography>
                    </Grid>
                  </Grid>

                  {chartData.length > 0 && (
                    <Box sx={{ mt: 2, height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" dataKey="i_d" stroke="#8884d8" name="i_d (A)" dot={false} />
                          <Line type="monotone" dataKey="i_q" stroke="#82ca9d" name="i_q (A)" dot={false} />
                          <Line type="monotone" dataKey="power" stroke="#ffc658" name="P (kW)" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ConverterMonitor;
