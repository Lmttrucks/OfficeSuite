import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Button, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../config';
import EditInvoiceForm from './EditInvoiceForm';
import InvoicePDFViewer from './InvoicePDFViewer';

const Last1000Invoices = ({ refresh }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [reprintInvoice, setReprintInvoice] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/invoices/last-1000-invoices`,
        config.getAuthHeaders()
      );
      const data = await response.json();
      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleDelete = async (invoiceNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/invoices/deleteInvoiceByInvoiceNo/${invoiceNo}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        }
      });

      if (response.ok) {
        setRecords(records.filter((record) => record.InvoiceNo !== invoiceNo));
        alert('Invoice deleted successfully');
      } else {
        alert('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice');
    }
  };

  const handleReprint = async (invoice) => {
    try {
      // Fetch loads by invoice number
      const loadsResponse = await fetch(
        `${config.apiBaseUrl}/invoices/getLoadsByInvoiceNo?invoiceNo=${invoice.InvoiceNo}`,
        config.getAuthHeaders()
      );
      const loadsData = await loadsResponse.json();

      // Fetch company info by company name
      const companyResponse = await fetch(
        `${config.apiBaseUrl}/lookups/company-info/${encodeURIComponent(invoice.CompanyName)}`,
        config.getAuthHeaders()
      );
      if (!companyResponse.ok) {
        throw new Error('Failed to fetch company information');
      }
      const companyData = await companyResponse.json();

      // Compute values
      const loadCount = loadsData.length;
      const totalAmount = loadsData.reduce(
        (acc, load) => acc + load.Rate * load.UnitQuantity,
        0
      );
      const vatRate = parseFloat(invoice.VatRate || 0);
      const vatAmount = totalAmount * (vatRate / 100);
      const paymentAmount = totalAmount + vatAmount;

      // Prepare invoice data
      const invoiceData = {
        ...invoice,
        invoiceNo: invoice.InvoiceNo, // Explicitly include invoiceNo
        startDate: invoice.StartDate, // Explicitly include startDate
        endDate: invoice.EndDate,
        loads: loadsData,
        companyName: companyData.CompanyName,
        companyID: companyData.CompanyID,
        companyAddress: companyData.CompanyAddress,
        companyEmail: companyData.CompanyEmail,
        dateGenerated: invoice.DateAdded, // Set DateAdded as dateGenerated
        loadCount: loadCount,
        totalAmount: parseFloat(totalAmount.toFixed(2)), // Ensure it's a number
        vatRate: vatRate,
        vatAmount: parseFloat(vatAmount.toFixed(2)), // Ensure it's a number
        paymentAmount: parseFloat(paymentAmount.toFixed(2)) // Ensure it's a number
      };

      console.log('Invoice Data before rendering:', invoiceData); // Log the invoice data

      setReprintInvoice(invoiceData);
    } catch (error) {
      console.error('Error reprinting invoice:', error);
      alert('Error reprinting invoice');
    }
  };

  const handleRefreshLoads = async (invoice) => {
    try {
      // Fetch loads by invoice number
      const loadsResponse = await fetch(`${config.apiBaseUrl}/invoices/getLoadsByInvoiceNo?invoiceNo=${invoice.InvoiceNo}`, config.getAuthHeaders());
      const loadsData = await loadsResponse.json();

      if (!Array.isArray(loadsData)) {
        throw new Error('Invalid loads data');
      }

      // Recalculate LoadCount and PaymentAmount
      const loadCount = loadsData.length;
      const paymentAmount = loadsData.reduce((total, load) => total + load.Rate * load.UnitQuantity, 0);

      // Update the invoice
      const updatedInvoice = {
        ...invoice,
        LoadCount: loadCount,
        PaymentAmount: paymentAmount
      };

      const response = await fetch(`${config.apiBaseUrl}/invoices/${invoice.InvoiceNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(updatedInvoice)
      });

      if (response.ok) {
        alert('Invoice updated successfully');
        fetchRecords();
      } else {
        alert('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error refreshing loads:', error);
      alert('Error refreshing loads');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [refresh]);

  const columns = [
    { field: 'InvoiceNo', headerName: 'Invoice No', width: 100 },
    { field: 'CompanyName', headerName: 'Company Name', width: 200 },
    { field: 'StartDate', headerName: 'Start Date', width: 100 },
    { field: 'EndDate', headerName: 'End Date', width: 100 },
    { field: 'VatRate', headerName: 'VAT Rate', width: 80 },
    { field: 'LoadCount', headerName: 'Load Count', width: 100 },
    { field: 'PaymentAmount', headerName: 'Payment Amount', width: 100 },
    { field: 'InvoiceURL', headerName: 'Invoice URL', width: 50 },
    { field: 'UserID', headerName: 'User ID', width: 100 },
    { field: 'DateAdded', headerName: 'Date Added', width: 100 },
    { field: 'Purchase', headerName: 'Purchase', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            size="small"
            onClick={() => setEditingInvoice(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => handleDelete(params.row.InvoiceNo)}
            sx={{ mr: 1 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleReprint(params.row)}
            sx={{ mr: 1 }}
          >
            Reprint
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleRefreshLoads(params.row)}
          >
            Refresh
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        rows={records}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.InvoiceNo}
      />

      <Modal
        open={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
        aria-labelledby="edit-invoice-modal-title"
        aria-describedby="edit-invoice-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          maxHeight: '90vh', // Adjust the max height
          overflowY: 'auto', // Enable scrolling
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4 
        }}>
          {editingInvoice && (
            <EditInvoiceForm
              editingInvoice={editingInvoice}
              setEditingInvoice={setEditingInvoice}
              handleRefreshTable={fetchRecords}
            />
          )}
        </Box>
      </Modal>

      <Modal
        open={!!reprintInvoice}
        onClose={() => setReprintInvoice(null)}
        aria-labelledby="reprint-invoice-modal-title"
        aria-describedby="reprint-invoice-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '80%', 
          height: '80%', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4 
        }}>
          {reprintInvoice && (
            <InvoicePDFViewer invoiceData={reprintInvoice} />
          )}
        </Box>
      </Modal>
    </div>
  );
};

Last1000Invoices.propTypes = {
  refresh: PropTypes.bool.isRequired
};

export default Last1000Invoices;