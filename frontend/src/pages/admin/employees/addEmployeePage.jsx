import React, { useState } from 'react';
import { Box, Button, TextField, Grid } from '@mui/material';
import config from '../../../config';

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({
    AppUserID: '',
    ContactID: '',
    DOB: '',
    EmPPS: '',
    StartD: '',
    EndDD: '',
    Duties: '',
    DLNo: '',
    DLExpiry: '',
    WorkStatus: '',
    FAExpiry: '',
    MHExpiry: '',
    CCExpiry: '',
    Comments: '',
    UserID: '',
    DateAdded: '',
    EmployeeName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/employees/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Employee added successfully');
        setFormData({
          AppUserID: '',
          ContactID: '',
          DOB: '',
          EmPPS: '',
          StartD: '',
          EndDD: '',
          Duties: '',
          DLNo: '',
          DLExpiry: '',
          WorkStatus: '',
          FAExpiry: '',
          MHExpiry: '',
          CCExpiry: '',
          Comments: '',
          UserID: '',
          DateAdded: '',
          EmployeeName: ''
        });
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="App User ID"
            name="AppUserID"
            value={formData.AppUserID}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact ID"
            name="ContactID"
            value={formData.ContactID}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date of Birth"
            name="DOB"
            type="date"
            value={formData.DOB}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee PPS"
            name="EmPPS"
            value={formData.EmPPS}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            name="StartD"
            type="date"
            value={formData.StartD}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            name="EndDD"
            type="date"
            value={formData.EndDD}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Duties"
            name="Duties"
            value={formData.Duties}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Driver's License No"
            name="DLNo"
            value={formData.DLNo}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Driver's License Expiry"
            name="DLExpiry"
            type="date"
            value={formData.DLExpiry}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Work Status"
            name="WorkStatus"
            value={formData.WorkStatus}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Aid Expiry"
            name="FAExpiry"
            type="date"
            value={formData.FAExpiry}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Manual Handling Expiry"
            name="MHExpiry"
            type="date"
            value={formData.MHExpiry}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="CPC Expiry"
            name="CCExpiry"
            type="date"
            value={formData.CCExpiry}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Comments"
            name="Comments"
            value={formData.Comments}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="User ID"
            name="UserID"
            value={formData.UserID}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date Added"
            name="DateAdded"
            type="date"
            value={formData.DateAdded}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee Name"
            name="EmployeeName"
            value={formData.EmployeeName}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Submit
          </Button>
          <Button type="button" variant="outlined" onClick={() => setFormData({
            AppUserID: '',
            ContactID: '',
            DOB: '',
            EmPPS: '',
            StartD: '',
            EndDD: '',
            Duties: '',
            DLNo: '',
            DLExpiry: '',
            WorkStatus: '',
            FAExpiry: '',
            MHExpiry: '',
            CCExpiry: '',
            Comments: '',
            UserID: '',
            DateAdded: '',
            EmployeeName: ''
          })}>
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddEmployeePage;