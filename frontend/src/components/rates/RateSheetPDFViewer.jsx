import React from 'react';
import PropTypes from 'prop-types';
import { PDFViewer } from '@react-pdf/renderer';
import { Modal, Box, Button } from '@mui/material';
import RateSheetPDF from './RateSheetPDF';

const RateSheetPDFViewer = ({ ratesData, onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ alignSelf: 'flex-end', mb: 1 }}
        >
          Close
        </Button>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <RateSheetPDF ratesData={ratesData} />
        </PDFViewer>
      </Box>
    </Modal>
  );
};

RateSheetPDFViewer.propTypes = {
  ratesData: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

export default RateSheetPDFViewer;