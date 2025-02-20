import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid, Autocomplete } from '@mui/material';
import config from '../../config';

const AddLinkLoadForm = ({ loadID, handleCloseModal }) => {
  const [companyName, setCompanyName] = useState('');
  const [linkNo, setLinkNo] = useState('');
  const [rate, setRate] = useState('');
  const [localCompanies, setLocalCompanies] = useState([]);

  useEffect(() => {
    const loadLocalData = (key) => {
      const data = localStorage.getItem(key);
      if (!data) return [];
      try {
        return JSON.parse(data); // Directly parse JSON without decryption
      } catch (error) {
        console.error(`Error parsing data for ${key}:`, error);
        return [];
      }
    };

    setLocalCompanies(loadLocalData('localCompanies'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.apiBaseUrl}/loads/add-link-load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify({
          loadID,
          companyName,
          linkNo: linkNo || null,
          rate
        })
      });

      if (response.ok) {
        alert('Link load added successfully');
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(`Failed to add link load: ${errorData.message}`);
      }
    } catch (error) {
      alert('Error adding link load');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Load ID"
            value={loadID}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            options={localCompanies}
            getOptionLabel={(option) => option?.CompanyName || ''}
            value={localCompanies.find((c) => c.CompanyName === companyName) || null}
            onChange={(event, newValue) => {
              setCompanyName(newValue ? newValue.CompanyName : '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company Name"
                fullWidth
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Link No"
            value={linkNo}
            onChange={(e) => setLinkNo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Submit
          </Button>
          <Button type="button" variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

AddLinkLoadForm.propTypes = {
  loadID: PropTypes.number.isRequired,
  handleCloseModal: PropTypes.func.isRequired
};

export default AddLinkLoadForm;