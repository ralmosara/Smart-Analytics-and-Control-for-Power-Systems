import { useEffect } from 'react';
import { Box, Grid, Paper, Typography, Alert as MuiAlert } from '@mui/material';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useAppSelector } from '@/store/hooks';
import ConverterMonitor from '@/components/ConverterMonitor';
import BusMonitor from '@/components/BusMonitor';
import RESMonitor from '@/components/RESMonitor';
import NetworkTopology from '@/components/NetworkTopology';
import AlertPanel from '@/components/AlertPanel';

const Dashboard = () => {
  useRealTimeData();

  const converters = useAppSelector(state => state.converter.converters);
  const buses = useAppSelector(state => state.bus.buses);
  const resUnits = useAppSelector(state => state.res.units);
  const alerts = useAppSelector(state => state.alert.alerts);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Power System Real-Time Monitoring Dashboard
      </Typography>

      {unacknowledgedAlerts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <AlertPanel />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Network Topology */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: '500px' }}>
            <Typography variant="h6" gutterBottom>
              Network Topology
            </Typography>
            <NetworkTopology buses={buses} />
          </Paper>
        </Grid>

        {/* Converter Status */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: '500px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Power Converters ({Object.keys(converters).length}/3)
            </Typography>
            <ConverterMonitor />
          </Paper>
        </Grid>

        {/* Bus Monitoring */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bus Voltages and Power Flow ({Object.keys(buses).length}/5 buses)
            </Typography>
            <BusMonitor />
          </Paper>
        </Grid>

        {/* RES Monitoring */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Renewable Energy Sources ({Object.keys(resUnits).length}/4 units)
            </Typography>
            <RESMonitor />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
