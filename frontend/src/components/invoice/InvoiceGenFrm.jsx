import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Autocomplete, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import InvoicePreviewTable from './InvoicePreviewTable'; // Correct import path
import axios from 'axios'; // Import axios
import PropTypes from 'prop-types';

const InvoiceGenFrm = ({
  initialData = {},
  onFormUpdate = () => {},
  onPreview = () => {}
}) => {
  const [displayFormData, setDisplayFormData] = useState({
    companyName: initialData.companyName || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    vatRate: initialData.vatRate || 23, // Default VAT rate
    jobID: initialData.jobID || '' // Add jobID to the state
  });
  const [purchase, setPurchase] = useState(false); // Set to false by default

  const [localCompanies, setLocalCompanies] = useState([]);
  const [localJobs, setLocalJobs] = useState([]);
  const navigate = useNavigate();

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
    setLocalJobs(loadLocalData('localJobs'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisplayFormData({ ...displayFormData, [name]: value });
  };

  const handleClear = () => {
    setDisplayFormData({
      companyName: '',
      startDate: '',
      endDate: '',
      vatRate: 23, // Reset VAT rate to default
      jobID: '' // Reset jobID
    });
    setPurchase(false); // Reset purchase to false
    onFormUpdate({
      companyID: '',
      companyName: '',
      startDate: '',
      endDate: '',
      vatRate: 23, // Reset VAT rate to default
      jobID: '', // Reset jobID
      previewData: [],
      purchase: false // Reset purchase to false
    });
  };

  const handlePreview = useCallback(async () => {
    try {
      const company =
        localCompanies.find(
          (c) => c.CompanyName === displayFormData.companyName
        ) || {};
      const dataToSend = {
        CompanyName: company.CompanyName,
        StartDate: displayFormData.startDate,
        EndDate: displayFormData.endDate,
        JobID: displayFormData.jobID, // Include jobID in the request
        Purchase: purchase // Include purchase in the request
      };

      // Fetch company info
      const companyInfoResponse = await axios.get(
        `${config.apiBaseUrl}/lookups/company-info/${company.CompanyName}`,
        config.getAuthHeaders()
      );
      const companyInfo = companyInfoResponse.data;

      // Fetch loads for preview
      const loadsResponse = await axios.post(
        `${config.apiBaseUrl}/invoices/previewInvoice`,
        dataToSend,
        config.getAuthHeaders()
      );
      const loads = loadsResponse.data;

      // Compute values
      const loadCount = loads.length;
      const totalAmount = loads.reduce(
        (acc, row) => acc + row.Rate * row.UnitQuantity,
        0
      );
      const vatRate = parseFloat(displayFormData.vatRate);
      const vatAmount = totalAmount * (vatRate / 100);
      const paymentAmount = totalAmount + vatAmount;

      // Update form data with company info, loads, and computed values
      const updatedFormData = {
        ...displayFormData,
        companyID: companyInfo.CompanyID,
        companyAddress: companyInfo.CompanyAddress,
        companyEmail: companyInfo.CompanyEmail,
        loads: loads,
        loadCount: loadCount,
        totalAmount: totalAmount.toFixed(2),
        vatRate: vatRate,
        vatAmount: vatAmount.toFixed(2),
        paymentAmount: paymentAmount.toFixed(2),
        purchase: purchase // Include purchase in the updated form data
      };

      onPreview(updatedFormData);
      navigate('/admin/invoicing/preview', {
        state: { formData: updatedFormData }
      });
    } catch (error) {
      console.error(error);
      alert('Error fetching company info or loads');
    }
  }, [displayFormData, localCompanies, navigate, onPreview, purchase]);

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePreview();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={localCompanies}
              getOptionLabel={(option) => option.CompanyName || ''}
              isOptionEqualToValue={(option, value) =>
                option.CompanyID === value.CompanyID
              } // Correct equality check
              value={
                localCompanies.find(
                  (c) => c.CompanyName === displayFormData.companyName
                ) || null
              }
              onChange={(event, newValue) => {
                setDisplayFormData((prev) => ({
                  ...prev,
                  companyName: newValue ? newValue.CompanyName : ''
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company Name"
                  name="companyName"
                />
              )}
            />
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              onChange={handleChange}
              value={displayFormData.startDate}
              fullWidth
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              onChange={handleChange}
              value={displayFormData.endDate}
              fullWidth
            />
            <TextField
              label="VAT Rate"
              name="vatRate"
              type="number"
              onChange={handleChange}
              value={displayFormData.vatRate}
              fullWidth
            />
            <Autocomplete
              freeSolo
              options={localJobs.map((j) => j.JobID)}
              getOptionLabel={(option) => option || ''}
              value={displayFormData.jobID || ''}
              onInputChange={(event, newInputValue) => {
                setDisplayFormData((prev) => ({
                  ...prev,
                  jobID: newInputValue
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Job ID" name="jobID" />
              )}
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
          <Grid
            item
            xs={12}
            sm={12}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Preview
            </Button>
            <Button type="button" variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </form>
      {displayFormData.loads && displayFormData.loads.length > 0 && (
        <InvoicePreviewTable data={displayFormData.loads} />
      )}
    </Box>
  );
};

InvoiceGenFrm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired
};

export default InvoiceGenFrm;
