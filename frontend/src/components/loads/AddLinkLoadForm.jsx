import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid } from '@mui/material';
import config from '../../config';

const AddLinkLoadForm = ({ loadID, jobID, permitNo, weightDocNo, deliveryDate, unitQuantity, origin, destination, handleCloseModal }) => {
  const [companyName, setCompanyName] = useState('');
  const [rate, setRate] = useState('');
  const [editablePermitNo, setEditablePermitNo] = useState(permitNo || '');
  const [editableWeightDocNo, setEditableWeightDocNo] = useState(weightDocNo || '');

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
          rate,
          jobID,
          permitNo: editablePermitNo,
          weightDocNo: editableWeightDocNo,
          deliveryDate,
          unitQuantity,
          origin,
          destination
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
          <TextField
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            fullWidth
            required
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
          <TextField
            label="Job ID"
            value={jobID}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Permit No"
            value={editablePermitNo}
            onChange={(e) => setEditablePermitNo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Weight Doc No"
            value={editableWeightDocNo}
            onChange={(e) => setEditableWeightDocNo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Delivery Date"
            value={deliveryDate}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Unit Quantity"
            value={unitQuantity}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Origin"
            value={origin}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Destination"
            value={destination}
            fullWidth
            disabled
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
  jobID: PropTypes.string.isRequired,
  permitNo: PropTypes.string,
  weightDocNo: PropTypes.string,
  deliveryDate: PropTypes.string.isRequired,
  unitQuantity: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired
};

export default AddLinkLoadForm;