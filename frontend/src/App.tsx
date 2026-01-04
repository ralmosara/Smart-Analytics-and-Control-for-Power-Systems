import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Dashboard as DashboardIcon, History as HistoryIcon } from '@mui/icons-material';
import Dashboard from '@/pages/Dashboard';
import HistoricalData from '@/pages/HistoricalData';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'historical'>('dashboard');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Power System Analytics
            </Typography>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => setCurrentView('dashboard')}
              sx={{
                bgcolor: currentView === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
              }}
            >
              Real-Time
            </Button>
            <Button
              color="inherit"
              startIcon={<HistoryIcon />}
              onClick={() => setCurrentView('historical')}
              sx={{
                ml: 1,
                bgcolor: currentView === 'historical' ? 'rgba(255,255,255,0.2)' : 'transparent',
              }}
            >
              Historical
            </Button>
          </Toolbar>
        </AppBar>

        {currentView === 'dashboard' ? (
          <Container maxWidth={false}>
            <Dashboard />
          </Container>
        ) : (
          <HistoricalData />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
