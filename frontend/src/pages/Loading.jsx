import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  syncCompanies,
  syncEmployees,
  syncVehicles,
  syncLocations,
  syncJobs,
  syncOrigins, // Import syncOrigins
  syncDestinations, // Import syncDestinations
  clearTable,
  encryptTables
} from '../services/lookupSync';

function Loading() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('Starting synchronization...');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncDataAndNavigate = async () => {
      if (isSyncing) return; // Prevent multiple executions
      setIsSyncing(true);
      try {
        // Clear tables before synchronization
        console.log('Clearing local storage tables...');
        clearTable('localCompanies');
        clearTable('localEmployees');
        clearTable('localVehicles');
        clearTable('localLocations');
        clearTable('localJobs');
        clearTable('localOrigins'); // Clear localOrigins
        clearTable('localDestinations'); // Clear localDestinations

        setProgress('Syncing companies...');
        console.log('Syncing companies...');
        await syncCompanies();

        setProgress('Syncing employees...');
        console.log('Syncing employees...');
        await syncEmployees();

        setProgress('Syncing vehicles...');
        console.log('Syncing vehicles...');
        await syncVehicles();

        setProgress('Syncing locations...');
        console.log('Syncing locations...');
        await syncLocations();

        setProgress('Syncing jobs...');
        console.log('Syncing jobs...');
        await syncJobs();

        setProgress('Syncing origins...');
        console.log('Syncing origins...');
        await syncOrigins(); // Sync origins

        setProgress('Syncing destinations...');
        console.log('Syncing destinations...');
        await syncDestinations(); // Sync destinations

        setProgress('All data synchronized. Encrypting tables...');
        await encryptTables();

        setProgress('All data synchronized and encrypted. Redirecting...');
        const role = localStorage.getItem('role');
        console.log(`Retrieved role from localStorage: ${role}`);
        if (role === 'driver') {
          navigate('/driver/dashboard');
        } else if (role === 'manager') {
          navigate('/manager/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          console.error('Role not found or invalid.');
          setError('Role not found or invalid. Please log in again.');
        }
      } catch (err) {
        console.error('Error during synchronization:', err);
        setError('Synchronization failed. Please try again.');
      }
    };

    syncDataAndNavigate();
  }, [navigate, isSyncing]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress />
      <Typography>{progress}</Typography>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default Loading;
