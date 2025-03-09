import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Button, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../config';
import EditLinkLoadForm from './EditLinkLoadForm';

const LinkedLoadsTable = ({ refresh }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLoad, setEditingLoad] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/link-loads/last-1000-linked-loads`,
        config.getAuthHeaders()
      );
      const data = await response.json();
      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/link-loads/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        }
      });

      if (response.ok) {
        setRecords(records.filter((record) => record.ID !== id));
        alert('Record deleted successfully');
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Error deleting record');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [refresh]);

  const columns = [
    { field: 'ID', headerName: 'ID', width: 70 },
    { field: 'CompanyName', headerName: 'Company Name', width: 150 },
    { field: 'Rate', headerName: 'Rate', width: 100 },
    { field: 'PermitNo', headerName: 'Permit No', width: 130 },
    { field: 'WeightDocNo', headerName: 'Weight Doc No', width: 130 },
    { field: 'Origin', headerName: 'Origin', width: 100 },
    { field: 'Destination', headerName: 'Destination', width: 100 },
    { field: 'UnitQuantity', headerName: 'Unit Quantity', width: 120 },
    { field: 'DeliveryDate', headerName: 'Delivery Date', width: 150 },
    { field: 'Purchase', headerName: 'Purchase', width: 100, renderCell: (params) => (params.row.Purchase ? 'Yes' : 'No') },
    { field: 'InvoiceNo', headerName: 'Invoice No', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            size="small"
            onClick={() => setEditingLoad(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => handleDelete(params.row.ID)}
          >
            Delete
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
    <div style={{ height: '80vh', width: '100%' }}> {/* Adjust the height here */}
      <DataGrid
        rows={records}
        columns={columns}
        pageSize={10} // Increase the page size if needed
        getRowId={(row) => row.ID}
      />

      <Modal
        open={!!editingLoad}
        onClose={() => setEditingLoad(null)}
        aria-labelledby="edit-link-load-modal-title"
        aria-describedby="edit-link-load-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4 
        }}>
          {editingLoad && (
            <EditLinkLoadForm
              editingLoad={editingLoad}
              setEditingLoad={setEditingLoad}
              handleRefreshTable={fetchRecords}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

LinkedLoadsTable.propTypes = {
  refresh: PropTypes.bool.isRequired
};

export default LinkedLoadsTable;