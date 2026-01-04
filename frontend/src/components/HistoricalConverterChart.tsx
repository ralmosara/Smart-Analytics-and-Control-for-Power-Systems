import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TimeRangeSelector } from './TimeRangeSelector';
import type { TimeRange } from './TimeRangeSelector';
import { historicalDataService } from '../services/historical-data.service';
import type {
  ConverterSnapshot,
  AggregatedData,
} from '../services/historical-data.service';

export const HistoricalConverterChart: React.FC = () => {
  const [converterIds, setConverterIds] = useState<string[]>([]);
  const [selectedConverter, setSelectedConverter] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange | null>(null);
  const [aggregation, setAggregation] = useState<string>('raw');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load available converter IDs on mount
  useEffect(() => {
    const loadConverterIds = async () => {
      try {
        const ids = await historicalDataService.getConverterIds();
        setConverterIds(ids);
        if (ids.length > 0) {
          setSelectedConverter(ids[0]);
        }
      } catch (err) {
        setError('Failed to load converter IDs');
        console.error(err);
      }
    };

    loadConverterIds();
  }, []);

  // Load historical data when parameters change
  useEffect(() => {
    if (!selectedConverter || !timeRange) return;

    const loadHistoricalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await historicalDataService.getConverterHistory(
          selectedConverter,
          {
            startTime: timeRange.startTime.toISOString(),
            endTime: timeRange.endTime.toISOString(),
            aggregation: aggregation as any,
            limit: 1000,
          },
        );

        // Transform data for charting
        const chartData = result.map((item: ConverterSnapshot | AggregatedData) => {
          if ('bucket' in item) {
            // Aggregated data
            return {
              timestamp: new Date(item.bucket).toLocaleString(),
              voltage: parseFloat(item.avg_voltage as string),
              activePower: parseFloat(item.avg_active_power as string),
              reactivePower: parseFloat(item.avg_reactive_power as string),
              frequency: parseFloat(item.avg_frequency as string),
              temperature: parseFloat(item.avg_temperature as string),
              thd: parseFloat(item.avg_thd as string) * 100, // Convert to percentage
            };
          } else {
            // Raw data
            const snapshot = item as ConverterSnapshot;
            return {
              timestamp: new Date(snapshot.timestamp).toLocaleString(),
              voltage: parseFloat(snapshot.voltage),
              activePower: parseFloat(snapshot.activePower),
              reactivePower: parseFloat(snapshot.reactivePower),
              frequency: parseFloat(snapshot.frequency),
              temperature: parseFloat(snapshot.temperature),
              thd: parseFloat(snapshot.thd) * 100, // Convert to percentage
            };
          }
        }).reverse(); // Reverse to show oldest to newest

        setData(chartData);
      } catch (err) {
        setError('Failed to load historical data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistoricalData();
  }, [selectedConverter, timeRange, aggregation]);

  const handleConverterChange = (event: SelectChangeEvent) => {
    setSelectedConverter(event.target.value);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Left sidebar - Controls */}
        <Grid item xs={12} md={3}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel>Converter</InputLabel>
                  <Select
                    value={selectedConverter}
                    label="Converter"
                    onChange={handleConverterChange}
                  >
                    {converterIds.map((id) => (
                      <MenuItem key={id} value={id}>
                        {id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <TimeRangeSelector
                  onRangeChange={handleTimeRangeChange}
                  defaultRange="day"
                />
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right side - Charts */}
        <Grid item xs={12} md={9}>
          <Stack spacing={2}>
            {/* Error Display */}
            {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          )}

          {/* Charts */}
          {!loading && data.length > 0 && (
            <>
              {/* Voltage Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  DC Voltage
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis unit=" V" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="voltage"
                      stroke="#8884d8"
                      name="Voltage (V)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Power Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Power
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis unit=" W" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="activePower"
                      stroke="#82ca9d"
                      name="Active Power (W)"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="reactivePower"
                      stroke="#ffc658"
                      name="Reactive Power (VAR)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Frequency Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Grid Frequency
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis unit=" Hz" domain={[59.9, 60.1]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="frequency"
                      stroke="#ff7300"
                      name="Frequency (Hz)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* THD and Temperature Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  THD & Temperature
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis yAxisId="left" unit=" %" />
                    <YAxis yAxisId="right" orientation="right" unit=" °C" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="thd"
                      stroke="#8884d8"
                      name="THD (%)"
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff0000"
                      name="Temperature (°C)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </>
          )}

            {!loading && data.length === 0 && !error && (
              <Alert severity="info">
                No data available for the selected time range. Try selecting a different range.
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
