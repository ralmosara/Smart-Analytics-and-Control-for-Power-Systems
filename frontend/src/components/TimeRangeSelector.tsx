import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

export type TimeRange = {
  startTime: Date;
  endTime: Date;
};

export type TimeRangeSelectorProps = {
  onRangeChange: (range: TimeRange) => void;
  defaultRange?: 'hour' | '6hours' | 'day' | 'week';
};

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  onRangeChange,
  defaultRange = 'day',
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(defaultRange);
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [aggregation, setAggregation] = useState<string>('raw');

  // Calculate time range based on preset
  const getTimeRange = (preset: string): TimeRange => {
    const now = new Date();
    const endTime = new Date(now);
    let startTime = new Date(now);

    switch (preset) {
      case 'hour':
        startTime.setHours(now.getHours() - 1);
        break;
      case '6hours':
        startTime.setHours(now.getHours() - 6);
        break;
      case 'day':
        startTime.setDate(now.getDate() - 1);
        break;
      case 'week':
        startTime.setDate(now.getDate() - 7);
        break;
      default:
        startTime = new Date(now);
    }

    return { startTime, endTime };
  };

  // Handle preset button click
  const handlePresetClick = (preset: string) => {
    setSelectedPreset(preset);
    const range = getTimeRange(preset);
    onRangeChange(range);
  };

  // Handle custom range submission
  const handleCustomRange = () => {
    if (customStart && customEnd) {
      const startTime = new Date(customStart);
      const endTime = new Date(customEnd);

      if (startTime < endTime) {
        setSelectedPreset('custom');
        onRangeChange({ startTime, endTime });
      } else {
        alert('Start time must be before end time');
      }
    }
  };

  // Handle aggregation change
  const handleAggregationChange = (event: SelectChangeEvent) => {
    setAggregation(event.target.value);
  };

  // Initialize with default range on mount
  React.useEffect(() => {
    const range = getTimeRange(defaultRange);
    onRangeChange(range);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <Stack spacing={2}>
        {/* Preset Buttons */}
        <ButtonGroup variant="outlined" fullWidth>
          <Button
            variant={selectedPreset === 'hour' ? 'contained' : 'outlined'}
            onClick={() => handlePresetClick('hour')}
          >
            Last Hour
          </Button>
          <Button
            variant={selectedPreset === '6hours' ? 'contained' : 'outlined'}
            onClick={() => handlePresetClick('6hours')}
          >
            Last 6 Hours
          </Button>
          <Button
            variant={selectedPreset === 'day' ? 'contained' : 'outlined'}
            onClick={() => handlePresetClick('day')}
          >
            Last 24 Hours
          </Button>
          <Button
            variant={selectedPreset === 'week' ? 'contained' : 'outlined'}
            onClick={() => handlePresetClick('week')}
          >
            Last 7 Days
          </Button>
        </ButtonGroup>

        {/* Custom Range */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Custom Range
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Start Time"
              type="datetime-local"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleCustomRange}
              disabled={!customStart || !customEnd}
            >
              Apply
            </Button>
          </Stack>
        </Box>

        {/* Aggregation Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel>Aggregation</InputLabel>
          <Select
            value={aggregation}
            label="Aggregation"
            onChange={handleAggregationChange}
          >
            <MenuItem value="raw">Raw Data (No Aggregation)</MenuItem>
            <MenuItem value="1min">1 Minute Average</MenuItem>
            <MenuItem value="5min">5 Minute Average</MenuItem>
            <MenuItem value="1hour">1 Hour Average</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
};
