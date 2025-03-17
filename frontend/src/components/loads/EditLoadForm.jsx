import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid, FormControlLabel, Checkbox } from '@mui/material';
import config from '../../config';

const EditLoadForm = ({ editingLoad, setEditingLoad, handleRefreshTable }) => {
  const [originalLoad, setOriginalLoad] = useState({});
  const [purchase, setPurchase] = useState(editingLoad.Purchase || false); // Set to false by default

  useEffect(() => {
    if (editingLoad && !originalLoad.ID) {
      setOriginalLoad(editingLoad);
    }
  }, [editingLoad, originalLoad]);

  const handleSaveClick = async (e) => {
    e.preventDefault();

    // Filter out null values and exclude userID and dateAdded
    const filteredData = Object.fromEntries(
      Object.entries(editingLoad).filter(([key, value]) => value !== null && key !== 'UserID' && key !== 'DateAdded')
    );

    // Include only changed fields
    const changedData = Object.fromEntries(
      Object.entries(filteredData).filter(([key, value]) => originalLoad[key] !== value)
    );

    // Include the purchase field if it has changed
    if (originalLoad.Purchase !== purchase) {
      changedData.Purchase = purchase;
    }

    if (Object.keys(changedData).length === 0) {
      alert('No changes to save.');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/loads/${editingLoad.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(changedData)
      });

      if (response.ok) {
        setEditingLoad(null);
        handleRefreshTable(); // Refresh the table after a successful update
      } else {
        const errorData = await response.json();
        alert(`Failed to update load: ${errorData.message}`);
      }
    } catch (error) {
      alert('Error updating load');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingLoad({ ...editingLoad, [name]: type === 'checkbox' ? checked : value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Box component="form" onSubmit={handleSaveClick}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Employee Name"
            name="EmployeeName"
            value={editingLoad.EmployeeName || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Vehicle Reg"
            name="VehicleReg"
            value={editingLoad.VehicleReg || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Company Name"
            name="CompanyName"
            value={editingLoad.CompanyName || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Job ID"
            name="JobID"
            value={editingLoad.JobID || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Permit No"
            name="PermitNo"
            value={editingLoad.PermitNo || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Weight Doc No"
            name="WeightDocNo"
            value={editingLoad.WeightDocNo || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Delivery Date"
            name="DeliveryDate"
            type="date"
            value={formatDate(editingLoad.DeliveryDate)}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Rate"
            name="Rate"
            value={editingLoad.Rate || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Gross"
            name="Gross"
            value={editingLoad.Gross || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Tare"
            name="Tare"
            value={editingLoad.Tare || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Origin"
            name="Origin"
            value={editingLoad.Origin || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Destination"
            name="Destination"
            value={editingLoad.Destination || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={editingLoad.Archived || false}
                onChange={handleChange}
                name="Archived"
              />
            }
            label="Archived"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editingLoad.Paid || false}
                onChange={handleChange}
                name="Paid"
              />
            }
            label="Paid"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editingLoad.Checked || false}
                onChange={handleChange}
                name="Checked"
              />
            }
            label="Checked"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editingLoad.PaperDocFiled || false}
                onChange={handleChange}
                name="PaperDocFiled"
              />
            }
            label="Paper Doc Filed"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Invoice No"
            name="InvoiceNo"
            value={editingLoad.InvoiceNo || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Unit Type"
            name="UnitType"
            value={editingLoad.UnitType || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Unit Quantity"
            name="UnitQuantity"
            value={editingLoad.UnitQuantity || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Permit URL"
            name="PermitURL"
            value={editingLoad.PermitURL || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Weight Doc URL"
            name="WeightDocURL"
            value={editingLoad.WeightDocURL || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mobile UL"
            name="MobileUL"
            value={editingLoad.MobileUL || ''}
            onChange={handleChange}
            fullWidth
          />
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
        <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Save
          </Button>
          <Button type="button" variant="outlined" onClick={() => setEditingLoad(null)}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

EditLoadForm.propTypes = {
  editingLoad: PropTypes.shape({
    ID: PropTypes.number,
    EmployeeName: PropTypes.string,
    VehicleReg: PropTypes.string,
    CompanyName: PropTypes.string,
    JobID: PropTypes.string,
    PermitNo: PropTypes.string,
    WeightDocNo: PropTypes.string,
    DeliveryDate: PropTypes.string,
    Rate: PropTypes.string,
    Gross: PropTypes.string,
    Tare: PropTypes.string,
    Origin: PropTypes.string,
    Destination: PropTypes.string,
    Archived: PropTypes.bool,
    InvoiceNo: PropTypes.string,
    UnitType: PropTypes.string,
    UnitQuantity: PropTypes.string,
    Paid: PropTypes.bool,
    Checked: PropTypes.bool,
    PermitURL: PropTypes.string,
    WeightDocURL: PropTypes.string,
    PaperDocFiled: PropTypes.bool,
    MobileUL: PropTypes.string,
    Purchase: PropTypes.bool
  }),
  setEditingLoad: PropTypes.func.isRequired,
  handleRefreshTable: PropTypes.func.isRequired
};

export default EditLoadForm;
