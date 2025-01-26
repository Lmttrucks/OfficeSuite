import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config';

const Last100Table = ({ refresh }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    'ID',
    'JobID',
    'CompanyName',
    'PermitNo',
    'WeightDocNo',
    'DeliveryDate',
    'UnitQuantity',
    'Gross',
    'Origin',
    'Destination',
    'WeightDocURL',
    'PermitURL',
    'actions'
  ]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/loads/last-100-loads`,
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
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleDelete(params.row.ID)}
        >
          Delete
        </Button>
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
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={records}
        columns={filteredColumns}
        pageSize={5}
        getRowId={(row) => row.ID}
      />
    </div>
  );
};

Last100Table.propTypes = {
  refresh: PropTypes.func.isRequired
};

export default Last100Table;
