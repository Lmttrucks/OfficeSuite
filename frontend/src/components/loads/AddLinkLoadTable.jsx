import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Modal } from '@mui/material';
import config from '../../config';
import AddLinkLoadForm from './AddLinkLoadForm';

const AddLinkLoadTable = ({ refreshTable }) => {
  const [loads, setLoads] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/loads/external-loads`, {
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

  const handleLinkClick = (load) => {
    setSelectedLoad(load);
  };

  const handleCloseModal = () => {
    setSelectedLoad(null);
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job ID</TableCell>
            <TableCell>Permit No</TableCell>
            <TableCell>Weight Doc No</TableCell>
            <TableCell>Delivery Date</TableCell>
            <TableCell>Unit Quantity</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loads.map((load) => (
            <TableRow key={load.ID}>
              <TableCell>{load.JobID}</TableCell>
              <TableCell>{load.PermitNo}</TableCell>
              <TableCell>{load.WeightDocNo}</TableCell>
              <TableCell>{load.DeliveryDate}</TableCell>
              <TableCell>{load.UnitQuantity}</TableCell>
              <TableCell>{load.Origin}</TableCell>
              <TableCell>{load.Destination}</TableCell>
              <TableCell>
                <Button onClick={() => handleLinkClick(load)}>Link</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={!!selectedLoad}
        onClose={handleCloseModal}
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
          {selectedLoad && (
            <AddLinkLoadForm
              loadID={selectedLoad.ID}
              jobID={selectedLoad.JobID}
              permitNo={selectedLoad.PermitNo}
              weightDocNo={selectedLoad.WeightDocNo}
              deliveryDate={selectedLoad.DeliveryDate}
              unitQuantity={selectedLoad.UnitQuantity}
              origin={selectedLoad.Origin}
              destination={selectedLoad.Destination}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

AddLinkLoadTable.propTypes = {
  refreshTable: PropTypes.bool.isRequired
};

export default AddLinkLoadTable;