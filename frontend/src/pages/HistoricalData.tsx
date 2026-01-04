import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { HistoricalConverterChart } from '@/components/HistoricalConverterChart';
import { HistoricalRESChart } from '@/components/HistoricalRESChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`historical-tabpanel-${index}`}
      aria-labelledby={`historical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HistoricalData = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Power Converters" />
          <Tab label="Renewable Energy Sources" />
          <Tab label="Bus Network" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={currentTab} index={0}>
          <HistoricalConverterChart />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <HistoricalRESChart />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Bus Historical Data
            </Typography>
            <Typography color="text.secondary">
              Bus historical charts coming soon...
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default HistoricalData;
