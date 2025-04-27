import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@mui/material';
import config from '../../config';

const AdjustRatesForm = ({ onRatesAdjusted }) => {
  const [percentageIncrease, setPercentageIncrease] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/rates/adjust`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify({ PercentageIncrease: percentageIncrease })
      });

      if (response.ok) {
        setPercentageIncrease('');
        onRatesAdjusted();
      } else {
        alert('Failed to adjust rates');
      }
    } catch (error) {
      console.error(error);
      alert('Error adjusting rates');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Percentage Increase"
            type="number"
            value={percentageIncrease}
            onChange={(e) => setPercentageIncrease(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button type="submit" variant="contained">
            Adjust Rates
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

AdjustRatesForm.propTypes = {
  onRatesAdjusted: PropTypes.func.isRequired
};

export default AdjustRatesForm;