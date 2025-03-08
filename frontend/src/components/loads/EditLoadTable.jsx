import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import config from '../../config';

const EditLoadTable = ({ setEditingLoad, refreshTable }) => {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/loads/non-archived-loads`, {
          headers: {
            ...config.getAuthHeaders().headers
          }
        });
        const data = await response.json();
        setLoads(data);
      } catch (error) {
        console.error('Error fetching loads:', error);
      }
    };

    fetchLoads();
  }, [refreshTable]);

  const handleEditClick = (load) => {
    setEditingLoad(load);
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company Name</TableCell>
            <TableCell>Employee Name</TableCell>
            <TableCell>Vehicle Reg</TableCell>
            <TableCell>Job ID</TableCell>
            <TableCell>Permit No</TableCell>
            <TableCell>Weight Doc No</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Gross</TableCell>
            <TableCell>Tare</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Unit Type</TableCell>
            <TableCell>Unit Quantity</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Checked</TableCell>
            <TableCell>Permit URL</TableCell>
            <TableCell>Weight Doc URL</TableCell>
            <TableCell>Paper Doc Filed</TableCell>
            <TableCell>Mobile UL</TableCell>
            <TableCell>Purchase</TableCell> {/* Add Purchase header */}
            <TableCell>User ID</TableCell>
            <TableCell>Date Added</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loads.map((load) => (
            <TableRow key={load.ID}>
              <TableCell>{load.CompanyName}</TableCell>
              <TableCell>{load.EmployeeName}</TableCell>
              <TableCell>{load.VehicleReg}</TableCell>
              <TableCell>{load.JobID}</TableCell>
              <TableCell>{load.PermitNo}</TableCell>
              <TableCell>{load.WeightDocNo}</TableCell>
              <TableCell>{load.DeliveryDate}</TableCell>
              <TableCell>{load.Rate}</TableCell>
              <TableCell>{load.Gross}</TableCell>
              <TableCell>{load.Tare}</TableCell>
              <TableCell>{load.Origin}</TableCell>
              <TableCell>{load.Destination}</TableCell>
              <TableCell>{load.UnitType}</TableCell>
              <TableCell>{load.UnitQuantity}</TableCell>
              <TableCell>{load.Paid ? 'Yes' : 'No'}</TableCell>
              <TableCell>{load.Checked ? 'Yes' : 'No'}</TableCell>
              <TableCell>{load.PermitURL}</TableCell>
              <TableCell>{load.WeightDocURL}</TableCell>
              <TableCell>{load.PaperDocFiled ? 'Yes' : 'No'}</TableCell>
              <TableCell>{load.MobileUL}</TableCell>
              <TableCell>{load.Purchase ? 'Yes' : 'No'}</TableCell> {/* Add Purchase cell */}
              <TableCell>{load.UserID}</TableCell>
              <TableCell>{load.DateAdded}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditClick(load)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

EditLoadTable.propTypes = {
  setEditingLoad: PropTypes.func.isRequired,
  refreshTable: PropTypes.bool.isRequired
};

export default EditLoadTable;
