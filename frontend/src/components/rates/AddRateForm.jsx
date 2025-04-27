import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@mui/material';
import config from '../../config';

const AddRateForm = ({ onRateAdded }) => {
  const [formData, setFormData] = useState({
    KMRangeFrom: '',
    KMRangeTo: '',
    RateEuro: '',
    IsActive: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ KMRangeFrom: '', KMRangeTo: '', RateEuro: '', IsActive: true });
        onRateAdded();
      } else {
        alert('Failed to add rate');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding rate');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="KM Range From"
            name="KMRangeFrom"
            type="number"
            value={formData.KMRangeFrom}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="KM Range To"
            name="KMRangeTo"
            type="number"
            value={formData.KMRangeTo}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Rate (€)"
            name="RateEuro"
            type="number"
            value={formData.RateEuro}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Add Rate
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

AddRateForm.propTypes = {
  onRateAdded: PropTypes.func.isRequired
};

export default AddRateForm;