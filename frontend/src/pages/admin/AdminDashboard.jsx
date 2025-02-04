import React from 'react';
import { Box, Toolbar, Typography } from '@mui/material';

function AdminDashboard() {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }} // Added margin-left
    >
      <Toolbar />
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Select an option from the menu to manage Loads, Jobs, Invoices,
        Vehicles, Employees, and more.
      </Typography>
    </Box>
  );
}

export default AdminDashboard;
