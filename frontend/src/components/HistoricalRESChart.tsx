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
  Area,
  AreaChart,
} from 'recharts';
import { TimeRangeSelector } from './TimeRangeSelector';
import type { TimeRange } from './TimeRangeSelector';
import { historicalDataService } from '../services/historical-data.service';
import type {
  RESSnapshot,
  AggregatedData,
} from '../services/historical-data.service';

export const HistoricalRESChart: React.FC = () => {
  const [resIds, setResIds] = useState<string[]>([]);
  const [selectedRES, setSelectedRES] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange | null>(null);
  const [aggregation, setAggregation] = useState<string>('raw');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resType, setResType] = useState<'SOLAR' | 'WIND' | null>(null);

  // Load available RES IDs on mount
  useEffect(() => {
    const loadRESIds = async () => {
      try {
        const ids = await historicalDataService.getRESIds();
        setResIds(ids);
        if (ids.length > 0) {
          setSelectedRES(ids[0]);
        }
      } catch (err) {
        setError('Failed to load RES IDs');
        console.error(err);
      }
    };

    loadRESIds();
  }, []);

  // Load historical data when parameters change
  useEffect(() => {
    if (!selectedRES || !timeRange) return;

    const loadHistoricalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await historicalDataService.getRESHistory(
          selectedRES,
          {
            startTime: timeRange.startTime.toISOString(),
            endTime: timeRange.endTime.toISOString(),
            aggregation: aggregation as any,
            limit: 1000,
          },
        );

        // Transform data for charting
        const chartData = result.map((item: RESSnapshot | AggregatedData) => {
          if ('bucket' in item) {
            // Aggregated data
            return {
              timestamp: new Date(item.bucket).toLocaleString(),
              generation: parseFloat(item.avg_generation as string),
              capacity: parseFloat(item.avg_capacity as string),
              utilizationFactor: parseFloat(item.avg_utilization_factor as string) * 100,
              irradiance: item.avg_irradiance ? parseFloat(item.avg_irradiance as string) : null,
              windSpeed: item.avg_wind_speed ? parseFloat(item.avg_wind_speed as string) : null,
              temperature: parseFloat(item.avg_temperature as string),
            };
          } else {
            // Raw data
            const snapshot = item as RESSnapshot;

            // Determine RES type from first data point
            if (!resType && snapshot.type) {
              setResType(snapshot.type as 'SOLAR' | 'WIND');
            }

            return {
              timestamp: new Date(snapshot.timestamp).toLocaleString(),
              generation: parseFloat(snapshot.generation),
              capacity: parseFloat(snapshot.capacity),
              utilizationFactor: parseFloat(snapshot.utilizationFactor) * 100,
              irradiance: snapshot.irradiance ? parseFloat(snapshot.irradiance) : null,
              windSpeed: snapshot.windSpeed ? parseFloat(snapshot.windSpeed) : null,
              temperature: parseFloat(snapshot.temperature),
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
  }, [selectedRES, timeRange, aggregation]);

  const handleRESChange = (event: SelectChangeEvent) => {
    setSelectedRES(event.target.value);
    setResType(null); // Reset type when changing RES unit
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* RES Selection */}
        <Card>
          <CardContent>
            <FormControl fullWidth>
              <InputLabel>RES Unit</InputLabel>
              <Select
                value={selectedRES}
                label="RES Unit"
                onChange={handleRESChange}
              >
                {resIds.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Time Range Selector */}
        <Card>
          <CardContent>
            <TimeRangeSelector
              onRangeChange={handleTimeRangeChange}
              defaultRange="day"
            />
          </CardContent>
        </Card>

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
              {/* Generation and Capacity Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Power Generation
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis unit=" kW" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="generation"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Generation (kW)"
                    />
                    <Line
                      type="monotone"
                      dataKey="capacity"
                      stroke="#ff0000"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Capacity (kW)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>

              {/* Utilization Factor Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Utilization Factor
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
                    <YAxis unit=" %" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="utilizationFactor"
                      stroke="#8884d8"
                      name="Utilization Factor (%)"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Solar-specific: Irradiance Chart */}
              {resType === 'SOLAR' && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Solar Irradiance
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis unit=" W/m²" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="irradiance"
                        stroke="#ffc658"
                        fill="#ffc658"
                        name="Irradiance (W/m²)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* Wind-specific: Wind Speed Chart */}
              {resType === 'WIND' && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Wind Speed
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
                      <YAxis unit=" m/s" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="windSpeed"
                        stroke="#00bfff"
                        name="Wind Speed (m/s)"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* Temperature Chart */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Ambient Temperature
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
                    <YAxis unit=" °C" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff6b6b"
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
    </Box>
  );
};
