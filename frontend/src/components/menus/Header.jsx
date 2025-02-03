import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  syncCompanies,
  syncEmployees,
  syncVehicles,
  syncLocations,
  syncJobs
} from '../../services/lookupSync';
import config from '../../config';
import LMHLogo from '../../assets/img/LMH.jpg'; // Import the image

const Header = () => {
  const username = localStorage.getItem('username');
  const userID = localStorage.getItem('userID');

  const handleRefresh = async () => {
    await Promise.all([
      syncCompanies(),
      syncEmployees(),
      syncVehicles(),
      syncLocations(),
      syncJobs()
    ]);
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc'
      }}
    >
      <Box>
        <img src={LMHLogo} alt="LMH Logo" style={{ height: '40px' }} />{' '}
        {/* Replace text with image */}
        <Typography variant="caption">Version {config.Version}</Typography>
      </Box>
      <Box>
        <Button variant="contained" onClick={handleRefresh}>
          Refresh
        </Button>
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'right' }}
        >
          {username}:{userID}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
