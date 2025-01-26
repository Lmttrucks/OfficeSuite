import React, { useState } from 'react';
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import InvoiceStructure, { getFileName } from '../pdf/InvoiceStructure';

const InvoicePDFCustomViewer = ({ invoiceData }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  return (
    <div>
      {/* Generate PDF Blob and Embed */}
      <BlobProvider document={<InvoiceStructure invoiceData={invoiceData} />}>
        {({ blob }) => {
          if (blob && !pdfUrl) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          }
          return (
            blob && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="600"
                style={{ border: 'none' }}
                title="Invoice PDF Viewer"
              />
            )
          );
        }}
      </BlobProvider>

      {/* Download Button */}
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

export default InvoicePDFCustomViewer;
