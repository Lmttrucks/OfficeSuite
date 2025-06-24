import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import config from '../../config';

const EditInvoiceForm = ({ editingInvoice, setEditingInvoice, handleRefreshTable }) => {
  const [formData, setFormData] = useState({
    InvoiceNo: '',
    CompanyName: '',
    StartDate: '',
    EndDate: '',
    VatRate: '',
    LoadCount: '',
    PaymentAmount: '',
    InvoiceURL: '',
    UserID: '',
    DateAdded: '',
    Purchase: false
  });

  const [localCompanies, setLocalCompanies] = useState([]);

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

  const convertDateToISO = (date) => {
    // Convert dd-mm-yyyy to yyyy-mm-dd
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setLocalCompanies(loadLocalData('localCompanies'));
  }, []);

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        ...editingInvoice,
        StartDate: editingInvoice.StartDate ? convertDateToISO(editingInvoice.StartDate) : '',
        EndDate: editingInvoice.EndDate ? convertDateToISO(editingInvoice.EndDate) : '',
        DateAdded: editingInvoice.DateAdded ? convertDateToISO(editingInvoice.DateAdded) : ''
      });
    }
  }, [editingInvoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/invoices/${formData.InvoiceNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Invoice updated successfully');
        handleRefreshTable();
        setEditingInvoice(null);
      } else {
        alert('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Error updating invoice');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Invoice
      </Typography>
      <TextField
        label="Invoice No"
        name="InvoiceNo"
        value={formData.InvoiceNo}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />
      <Autocomplete
        options={localCompanies}
        getOptionLabel={(option) => option?.CompanyName || ''}
        value={
          localCompanies.find(
            (c) => c.CompanyName === formData.CompanyName
          ) || null
        }
        onChange={(event, newValue) => {
          setFormData((prev) => ({
            ...prev,
            CompanyName: newValue ? newValue.CompanyName : ''
          }));
        }}
        renderInput={(params) => (
          <TextField {...params} label="Company Name" name="CompanyName" fullWidth margin="normal" />
        )}
        sx={{ width: '100%' }} // Make the Autocomplete box full width
      />
      <TextField
        label="Start Date"
        name="StartDate"
        type="date"
        value={formData.StartDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Date"
        name="EndDate"
        type="date"
        value={formData.EndDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="VAT Rate"
        name="VatRate"
        value={formData.VatRate}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Load Count"
        name="LoadCount"
        value={formData.LoadCount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Payment Amount"
        name="PaymentAmount"
        value={formData.PaymentAmount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Invoice URL"
        name="InvoiceURL"
        value={formData.InvoiceURL}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="User ID"
        name="UserID"
        value={formData.UserID}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date Added"
        name="DateAdded"
        type="date"
        value={formData.DateAdded}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Purchase"
        name="Purchase"
        type="checkbox"
        checked={formData.Purchase}
        onChange={(e) => setFormData({ ...formData, Purchase: e.target.checked })}
        fullWidth
        margin="normal"
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setEditingInvoice(null)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

EditInvoiceForm.propTypes = {
  editingInvoice: PropTypes.object,
  setEditingInvoice: PropTypes.func.isRequired,
  handleRefreshTable: PropTypes.func.isRequired
};

export default EditInvoiceForm;