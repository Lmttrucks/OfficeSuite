import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid } from '@mui/material';
import config from '../../config';

const EditLoadForm = ({ editingLoad, setEditingLoad }) => {
  const handleSaveClick = async (e) => {
    e.preventDefault();
    console.log('Submitting data:', editingLoad); // Log the data being submitted

    // Filter out null values and exclude userID and dateAdded
    const filteredData = Object.fromEntries(
      Object.entries(editingLoad).filter(([key, value]) => value !== null && key !== 'UserID' && key !== 'DateAdded')
    );

    console.log('Filtered data:', filteredData); // Log the filtered data

    try {
      const response = await fetch(`${config.apiBaseUrl}/loads/${editingLoad.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(filteredData)
      });

      if (response.ok) {
        setEditingLoad(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to update load:', errorData);
        alert(`Failed to update load: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating load:', error);
      alert('Error updating load');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingLoad({ ...editingLoad, [name]: value });
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
          <TextField
            label="Archived"
            name="Archived"
            value={editingLoad.Archived || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Outgoing Invoice No"
            name="OutgoingInvoiceNo"
            value={editingLoad.OutgoingInvoiceNo || ''}
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
            label="Paid"
            name="Paid"
            value={editingLoad.Paid || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Checked"
            name="Checked"
            value={editingLoad.Checked || ''}
            onChange={handleChange}
            fullWidth
          />
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
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Paper Doc Filed"
            name="PaperDocFiled"
            value={editingLoad.PaperDocFiled || ''}
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
    OutgoingInvoiceNo: PropTypes.string,
    UnitType: PropTypes.string,
    UnitQuantity: PropTypes.string,
    Paid: PropTypes.bool,
    Checked: PropTypes.bool,
    PermitURL: PropTypes.string,
    WeightDocURL: PropTypes.string,
    PaperDocFiled: PropTypes.bool,
    MobileUL: PropTypes.string
  }),
  setEditingLoad: PropTypes.func.isRequired
};

export default EditLoadForm;
