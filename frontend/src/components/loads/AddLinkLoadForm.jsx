import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid, Autocomplete, FormControlLabel, Checkbox, Typography, List, ListItem, ListItemText } from '@mui/material';
import config from '../../config';

const AddLinkLoadForm = ({ loadID, handleCloseModal }) => {
  const [companyName, setCompanyName] = useState('');
  const [linkNo, setLinkNo] = useState('');
  const [rate, setRate] = useState('');
  const [purchase, setPurchase] = useState(true); // Set to purchase by default
  const [localCompanies, setLocalCompanies] = useState([]);
  const [linkedLoads, setLinkedLoads] = useState([]); // State to store linked loads
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

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

    // Fetch linked loads for the given LoadID
    const fetchLinkedLoads = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/link-loads/linked-loads/${loadID}`, config.getAuthHeaders());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinkedLoads(data);
      } catch (error) {
        console.error('Error fetching linked loads:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedLoads();
  }, [loadID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.apiBaseUrl}/link-loads/add-link-load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify({
          loadID,
          companyName,
          linkNo: linkNo || null,
          rate,
          purchase
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
          <Button type="button" variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Linked Loads</Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : linkedLoads.length === 0 ? (
            <Typography>No Links</Typography>
          ) : (
            <List>
              {linkedLoads.map((linkedLoad) => (
                <ListItem key={linkedLoad.ID}>
                  <ListItemText
                    primary={`Company: ${linkedLoad.CompanyName}, Link No: ${linkedLoad.LinkNo}, Rate: ${linkedLoad.Rate}, Purchase: ${linkedLoad.Purchase ? 'Yes' : 'No'}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
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