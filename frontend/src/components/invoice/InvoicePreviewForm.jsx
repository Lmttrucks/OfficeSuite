import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InvoicePreviewForm = ({ previewData, formData, onGenerate, onPrintPreview }) => {
  const navigate = useNavigate();

  const handleClear = () => {
    navigate('/admin/invoicing/generate');
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Company Name"
            value={formData.companyName}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Company Address"
            value={formData.companyAddress}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Start Date"
            value={formData.startDate}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="End Date"
            value={formData.endDate}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="VAT Rate"
            value={formData.vatRate}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Invoice Type"
            value={formData.purchase ? 'Purchase' : 'Sales'}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Load Count"
            value={formData.loadCount}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Total Amount"
            value={formData.totalAmount}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="VAT Amount"
            value={formData.vatAmount}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Payment Amount"
            value={formData.paymentAmount}
            fullWidth
            InputProps={{
              readOnly: true
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={handleClear}
            sx={{ mr: 2 }}
          >
            Clear
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={onPrintPreview} // Add print preview button
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={onGenerate}
          >
            Generate Invoice
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

InvoicePreviewForm.propTypes = {
  previewData: PropTypes.object.isRequired,
  formData: PropTypes.shape({
    companyName: PropTypes.string,
    companyAddress: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    vatRate: PropTypes.number,
    loadCount: PropTypes.number,
    totalAmount: PropTypes.number,
    vatAmount: PropTypes.number,
    paymentAmount: PropTypes.number,
    purchase: PropTypes.bool // Add purchase
  }).isRequired,
  onGenerate: PropTypes.func.isRequired,
  onPrintPreview: PropTypes.func.isRequired // Add print preview prop
};

export default InvoicePreviewForm;
