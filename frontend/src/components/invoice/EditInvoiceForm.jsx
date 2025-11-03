import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
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

    // Helper to format date to yyyy-MM-dd for input fields
    const toInputDate = (dateStr) => {
        if (!dateStr) return '';

        // Handle dd-MM-yyyy format (like "03-11-2025")
        const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = dateStr.match(ddmmyyyyRegex);

        if (match) {
            const [, day, month, year] = match;
            return `${year}-${month}-${day}`;
        }

        // Fallback for other formats
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mm}-${dd}`;
    };

    useEffect(() => {
        setLocalCompanies(loadLocalData('localCompanies'));
    }, []);

    useEffect(() => {
        if (editingInvoice) {
            setFormData({
                ...editingInvoice,
                StartDate: toInputDate(editingInvoice.StartDate),
                EndDate: toInputDate(editingInvoice.EndDate),
                DateAdded: toInputDate(editingInvoice.DateAdded)
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
            const formattedFormData = {
                ...formData,
                StartDate: formData.StartDate ? `${formData.StartDate}T00:00:00` : null,
                EndDate: formData.EndDate ? `${formData.EndDate}T23:59:59` : null,
                DateAdded: formData.DateAdded ? `${formData.DateAdded}T00:00:00` : null
            };

            const response = await fetch(`${config.apiBaseUrl}/invoices/${formData.InvoiceNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...config.getAuthHeaders().headers
                },
                body: JSON.stringify(formattedFormData)
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
                sx={{ width: '100%' }}
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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.Purchase}
                        onChange={(e) => setFormData({ ...formData, Purchase: e.target.checked })}
                        name="Purchase"
                    />
                }
                label="Purchase"
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
