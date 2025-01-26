import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Autocomplete, Grid } from '@mui/material';
import config from '../config';

const AddLoadForm = ({ onLoadAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    vehicleReg: '',
    companyName: '',
    jobID: '',
    permitNo: '',
    weightDocNo: '',
    deliveryDate: '',
    rate: '',
    gross: '',
    tare: '0',
    origin: '',
    destination: ''
  });

  const [localCompanies, setLocalCompanies] = useState([]);
  const [localEmployees, setLocalEmployees] = useState([]);
  const [localVehicles, setLocalVehicles] = useState([]);
  const [localJobs, setLocalJobs] = useState([]);
  const [localLocations, setLocalLocations] = useState([]);

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

  useEffect(() => {
    setLocalCompanies(loadLocalData('localCompanies'));
    setLocalEmployees(loadLocalData('localEmployees'));
    setLocalVehicles(loadLocalData('localVehicles'));
    setLocalJobs(loadLocalData('localJobs'));
    setLocalLocations(loadLocalData('localLocations'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userID = localStorage.getItem('userID');
      const dataToSend = {
        ...formData,
        userID: userID // Include userID in the form data
      };
      const url = `${config.apiBaseUrl}/loads`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          permitNo: '',
          weightDocNo: '',
          deliveryDate: '',
          gross: '',
          tare: '0'
        }));
        if (onLoadAdded) {
          onLoadAdded();
        }
      } else {
        alert('Failed to submit load');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting load');
    }
  };

  const handleClear = () => {
    setFormData({
      employeeName: '',
      vehicleReg: '',
      companyName: '',
      jobID: '',
      permitNo: '',
      weightDocNo: '',
      deliveryDate: '',
      rate: '',
      gross: '',
      tare: '0',
      origin: '',
      destination: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={localEmployees}
            getOptionLabel={(option) => option.EmployeeName || ''}
            value={
              localEmployees.find(
                (e) => e.EmployeeName === formData.employeeName
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                employeeName: newValue ? newValue.EmployeeName : ''
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee Name"
                name="employeeName"
              />
            )}
          />
          <Autocomplete
            options={localVehicles}
            getOptionLabel={(option) => option.VehicleReg || ''}
            value={
              localVehicles.find((v) => v.VehicleReg === formData.vehicleReg) ||
              null
            }
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                vehicleReg: newValue ? newValue.VehicleReg : ''
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Vehicle Reg" name="vehicleReg" />
            )}
          />
          <Autocomplete
            options={localCompanies}
            getOptionLabel={(option) => option.CompanyName || ''}
            value={
              localCompanies.find(
                (c) => c.CompanyName === formData.companyName
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                companyName: newValue ? newValue.CompanyName : ''
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Company Name" name="companyName" />
            )}
          />
          <Autocomplete
            freeSolo
            options={localJobs.map((j) => j.JobID)}
            value={formData.jobID || ''}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                jobID: newInputValue
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Job ID" name="jobID" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Delivery Date"
            name="deliveryDate"
            type="date"
            onChange={handleChange}
            value={formData.deliveryDate}
            fullWidth
          />
          <TextField
            label="Rate"
            name="rate"
            onChange={handleChange}
            value={formData.rate}
            fullWidth
            autoComplete="off"
          />
          <Autocomplete
            freeSolo
            options={localLocations}
            getOptionLabel={(option) => option.Location || ''}
            isOptionEqualToValue={(option, value) => option.Location === value}
            value={
              localLocations.find((loc) => loc.Location === formData.origin) ||
              null
            }
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                origin: newValue ? newValue.Location : ''
              }));
            }}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                originName: newInputValue
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Origin" name="origin" />
            )}
          />
          <Autocomplete
            freeSolo
            options={localLocations}
            getOptionLabel={(option) => option.Location || ''}
            isOptionEqualToValue={(option, value) => option.Location === value}
            value={
              localLocations.find(
                (loc) => loc.Location === formData.destination
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                destination: newValue ? newValue.Location : ''
              }));
            }}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                destinationName: newInputValue
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Destination" name="destination" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Permit No"
            name="permitNo"
            onChange={handleChange}
            value={formData.permitNo}
            fullWidth
            autoComplete="off"
          />
          <TextField
            label="Weight Doc No"
            name="weightDocNo"
            onChange={handleChange}
            value={formData.weightDocNo}
            fullWidth
            autoComplete="off"
          />
          <TextField
            label="Gross"
            name="gross"
            onChange={handleChange}
            value={formData.gross}
            fullWidth
            autoComplete="off"
          />
          <TextField
            label="Tare"
            name="tare"
            onChange={handleChange}
            value={formData.tare}
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Submit
          </Button>
          <Button type="button" variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

AddLoadForm.propTypes = {
  onLoadAdded: PropTypes.func.isRequired
};

export default AddLoadForm;
