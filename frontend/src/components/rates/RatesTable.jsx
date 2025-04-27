import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Modal, Box, TextField } from '@mui/material';
import config from '../../config';

const RatesTable = ({ refresh, onRateEdited }) => {
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/rates`, {
          headers: config.getAuthHeaders().headers
        });
        if (response.ok) {
          const data = await response.json();
          setRates(data);
        } else {
          alert('Failed to fetch rates');
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching rates');
      }
    };

    fetchRates();
  }, [refresh]);

  const handleEdit = (rate) => {
    setSelectedRate(rate);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRate(null);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/rates/${selectedRate.RateID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.getAuthHeaders().headers
        },
        body: JSON.stringify(selectedRate)
      });

      if (response.ok) {
        onRateEdited();
        handleModalClose();
      } else {
        alert('Failed to update rate');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating rate');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRate({ ...selectedRate, [name]: value });
  };

  return (
    <>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>KM Range From</TableCell>
              <TableCell>KM Range To</TableCell>
              <TableCell>Rate (€)</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.RateID}>
                <TableCell>{rate.KMRangeFrom}</TableCell>
                <TableCell>{rate.KMRangeTo}</TableCell>
                <TableCell>{rate.RateEuro}</TableCell>
                <TableCell>{rate.IsActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(rate)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for editing rates */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <h2>Edit Rate</h2>
          {selectedRate && (
            <>
              <TextField
                label="KM Range From"
                name="KMRangeFrom"
                type="number"
                value={selectedRate.KMRangeFrom}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="KM Range To"
                name="KMRangeTo"
                type="number"
                value={selectedRate.KMRangeTo}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Rate (€)"
                name="RateEuro"
                type="number"
                value={selectedRate.RateEuro}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

RatesTable.propTypes = {
  refresh: PropTypes.bool.isRequired,
  onRateEdited: PropTypes.func.isRequired
};

export default RatesTable;