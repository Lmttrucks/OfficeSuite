import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid, Autocomplete, FormControlLabel, Checkbox } from '@mui/material';
import config from '../../config';

const EditLinkLoadForm = ({ editingLoad, setEditingLoad, handleRefreshTable }) => {
  const [companyName, setCompanyName] = useState(editingLoad.CompanyName);
  const [rate, setRate] = useState(editingLoad.Rate);
  const [purchase, setPurchase] = useState(editingLoad.Purchase); // Add state for Purchase
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
      const response = await fetch(`${config.apiBaseUrl}/link-loads/update-link-load/${editingLoad.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify({
          companyName,
          rate,
          purchase // Include Purchase in the request
        })
      });

      if (response.ok) {
        alert('Link load updated successfully');
        handleRefreshTable();
        setEditingLoad(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to update link load: ${errorData.message}`);
      }
    } catch (error) {
      alert('Error updating link load');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
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
            label="Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={purchase}
                onChange={(e) => setPurchase(e.target.checked)}
              />
            }
            label="Purchase"
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Submit
          </Button>
          <Button type="button" variant="outlined" onClick={() => setEditingLoad(null)}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

EditLinkLoadForm.propTypes = {
  editingLoad: PropTypes.object.isRequired,
  setEditingLoad: PropTypes.func.isRequired,
  handleRefreshTable: PropTypes.func.isRequired
};

export default EditLinkLoadForm;