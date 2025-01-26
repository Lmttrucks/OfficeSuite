import React from 'react';
import PropTypes from 'prop-types';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoiceStructure, { getFileName } from '../pdf/InvoiceStructure';

const InvoicePDFViewer = ({ invoiceData }) => {
  return (
    <div>
      <PDFViewer width="100%" height="600">
        <InvoiceStructure invoiceData={invoiceData} />
      </PDFViewer>
      <PDFDownloadLink
        document={<InvoiceStructure invoiceData={invoiceData} />}
        fileName={getFileName(invoiceData)}
        style={{
          textDecoration: 'none',
          padding: '10px',
          color: '#fff',
          backgroundColor: '#007bff',
          borderRadius: '5px'
        }}
      >
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};

InvoicePDFViewer.propTypes = {
  invoiceData: PropTypes.object.isRequired
};

export default InvoicePDFViewer;
