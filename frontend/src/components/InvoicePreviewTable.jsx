import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const InvoicePreviewTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Permit No</TableCell>
            <TableCell>Weight Doc No</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Unit Quantity</TableCell>
            <TableCell>Load Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
              <TableCell>{row.PermitNo}</TableCell>
              <TableCell>{row.WeightDocNo}</TableCell>
              <TableCell>{row.Origin}</TableCell>
              <TableCell>{row.Destination}</TableCell>
              <TableCell>{row.Rate}</TableCell>
              <TableCell>{row.UnitQuantity}</TableCell>
              <TableCell>{(row.Rate * row.UnitQuantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

InvoicePreviewTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.string,
      PermitNo: PropTypes.string,
      WeightDocNo: PropTypes.string,
      Origin: PropTypes.string,
      Destination: PropTypes.string,
      Rate: PropTypes.number,
      UnitQuantity: PropTypes.number
    })
  ).isRequired
};

export default InvoicePreviewTable;
