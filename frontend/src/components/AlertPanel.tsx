import { Alert, Box, IconButton, Collapse, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { acknowledgeAlert, clearAlert } from '@/store/slices/alertSlice';

const AlertPanel = () => {
  const alerts = useAppSelector(state => state.alert.alerts);
  const dispatch = useAppDispatch();

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5);

  const getSeverityLevel = (severity: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleClose = (alertId: string) => {
    dispatch(acknowledgeAlert(alertId));
    setTimeout(() => {
      dispatch(clearAlert(alertId));
    }, 300);
  };

  return (
    <Box>
      {unacknowledgedAlerts.map((alert) => (
        <Collapse key={alert.id} in={!alert.acknowledged}>
          <Alert
            severity={getSeverityLevel(alert.severity)}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => handleClose(alert.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 1 }}
          >
            <Typography variant="body2" fontWeight="bold">
              {alert.type.toUpperCase()}: {alert.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(alert.timestamp).toLocaleString()}
            </Typography>
          </Alert>
        </Collapse>
      ))}
    </Box>
  );
};

export default AlertPanel;
