import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Dashboard from '@/pages/Dashboard';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Dashboard />
      </Box>
    </ThemeProvider>
  );
}

export default App;
