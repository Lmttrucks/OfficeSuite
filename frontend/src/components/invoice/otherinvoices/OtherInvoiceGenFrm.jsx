import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Autocomplete, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import OtherInvoicePreviewTable from './OtherInvoicePreviewTable';
import axios from 'axios';
import PropTypes from 'prop-types';

const OtherInvoiceGenFrm = ({
  initialData = {},
  onFormUpdate = () => {},
  onPreview = () => {}
}) => {
  const [displayFormData, setDisplayFormData] = useState({
    companyName: initialData.companyName || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    vatRate: initialData.vatRate || 23 // Default VAT rate
  });

  const [localCompanies, setLocalCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLocalData = (key) => {
      const data = localStorage.getItem(key);
      if (!data) return [];
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(`Error parsing data for ${key}:`, error);
        return [];
      }
    };
    setLocalCompanies(loadLocalData('localCompanies'));
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
      vatRate: 23 // Reset VAT rate to default
    });
    onFormUpdate({
      companyID: '',
      companyName: '',
      startDate: '',
      endDate: '',
      vatRate: 23,
      loads: [] // Ensure loads is not undefined
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
        EndDate: displayFormData.endDate
      };

      // Fetch company info
      const companyInfoResponse = await axios.get(
        `${config.apiBaseUrl}/lookups/company-info/${company.CompanyName}`,
        config.getAuthHeaders()
      );
      const companyInfo = companyInfoResponse.data;

      // Fetch loads for preview
      const loadsResponse = await axios.post(
        `${config.apiBaseUrl}/invoices/previewLinkedLoadsInvoice`,
        dataToSend,
        config.getAuthHeaders()
      );
      const loads = loadsResponse.data || []; // Ensure loads is always an array

      // Compute values
      const loadCount = loads.length;
      const totalQuantity = loads.reduce((acc, row) => acc + row.UnitQuantity, 0);
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
        totalQuantity: totalQuantity,
        totalAmount: totalAmount.toFixed(2),
        vatRate: vatRate,
        vatAmount: vatAmount.toFixed(2),
        paymentAmount: paymentAmount.toFixed(2)
      };

      console.log('Updated Form Data:', updatedFormData); // Log the updated form data

      onPreview(updatedFormData);
      navigate('/admin/invoicing/other/preview', {
        state: { formData: updatedFormData, previewData: updatedFormData.loads }
      });
    } catch (error) {
      console.error('Error fetching company info or loads:', error);
      alert('Error fetching company info or loads');
    }
  }, [displayFormData, localCompanies, navigate, onPreview]);

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
              }
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
        <OtherInvoicePreviewTable data={displayFormData.loads} />
      )}
    </Box>
  );
};

OtherInvoiceGenFrm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired
};

export default OtherInvoiceGenFrm;
