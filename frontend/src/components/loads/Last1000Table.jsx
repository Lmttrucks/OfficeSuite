import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Button, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../config';
import EditLoadForm from './EditLoadForm';
import AddLinkLoadForm from './AddLinkLoadForm';

const Last1000Table = ({ refresh }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLoad, setEditingLoad] = useState(null);
  const [linkingLoad, setLinkingLoad] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([
    'ID',
    'JobID',
    'CompanyName',
    'EmployeeName', // Add this line
    'VehicleReg', // Add this line
    'PermitNo',
    'WeightDocNo',
    'DeliveryDate',
    'UnitQuantity',
    'Gross',
    'Origin',
    'Destination',
    'InvoiceNo',
    'Purchase',
    'Rate',
    'actions'
  ]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/loads/last-1000-loads`,
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
      const response = await fetch(`${config.apiBaseUrl}/loads/${id}`, {
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

  const allColumns = [
    { field: 'ID', headerName: 'ID', width: 70 },
    { field: 'JobID', headerName: 'Job ID', width: 100 },
    { field: 'CompanyName', headerName: 'Company Name', width: 150 },
    { field: 'EmployeeName', headerName: 'Employee Name', width: 150 }, // Add this column
    { field: 'VehicleReg', headerName: 'Vehicle Reg', width: 150 }, // Add this column
    { field: 'InvoiceNo', headerName: 'Invoice No', width: 150 },
    { field: 'PermitNo', headerName: 'Permit No', width: 130 },
    { field: 'WeightDocNo', headerName: 'Weight Doc No', width: 130 },
    { field: 'DeliveryDate', headerName: 'Delivery Date', width: 150 },
    { field: 'UnitQuantity', headerName: 'Net (Unit Qty)', width: 120 },
    { field: 'Gross', headerName: 'Gross', width: 100 },
    { field: 'Origin', headerName: 'Origin', width: 100 },
    { field: 'Destination', headerName: 'Destination', width: 100 },
    {
      field: 'WeightDocURL',
      headerName: 'W',
      width: 50,
      renderCell: (params) =>
        params.row.WeightDocURL && (
          <Button
            variant="contained"
            size="small"
            onClick={() => window.open(params.row.WeightDocURL, '_blank')}
          >
            W
          </Button>
        )
    },
    {
      field: 'PermitURL',
      headerName: 'P',
      width: 50,
      renderCell: (params) =>
        params.row.PermitURL && (
          <Button
            variant="contained"
            size="small"
            onClick={() => window.open(params.row.PermitURL, '_blank')}
          >
            P
          </Button>
        )
    },
    {
      field: 'Purchase',
      headerName: 'Purchase',
      width: 100,
      renderCell: (params) => (params.row.Purchase ? 'Yes' : 'No')
    },
    {
      field: 'Rate',
      headerName: 'Rate',
      width: 100
    },
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
            onClick={() => setLinkingLoad(params.row)}
            sx={{ mr: 1 }}
          >
            Link
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

  const filteredColumns = allColumns.filter((col) =>
    selectedColumns.includes(col.field)
  );

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
        columns={filteredColumns}
        pageSize={10} // Increase the page size if needed
        getRowId={(row) => row.ID}
      />

      <Modal
        open={!!editingLoad}
        onClose={() => setEditingLoad(null)}
        aria-labelledby="edit-load-modal-title"
        aria-describedby="edit-load-modal-description"
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
            <EditLoadForm
              editingLoad={editingLoad}
              setEditingLoad={setEditingLoad}
              handleRefreshTable={fetchRecords}
            />
          )}
        </Box>
      </Modal>

      <Modal
        open={!!linkingLoad}
        onClose={() => setLinkingLoad(null)}
        aria-labelledby="link-load-modal-title"
        aria-describedby="link-load-modal-description"
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
          {linkingLoad && (
            <AddLinkLoadForm
              loadID={linkingLoad.ID}
              handleCloseModal={() => setLinkingLoad(null)}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

Last1000Table.propTypes = {
  refresh: PropTypes.bool.isRequired
};

export default Last1000Table;
