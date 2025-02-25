import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';

const LinkInvoicePDFViewer = ({ invoiceData }) => {
  const MyDocument = (
    <Document>
      <Page>
        <View>
          <Text>Company Name: {invoiceData.companyName}</Text>
          <Text>Company Address: {invoiceData.companyAddress}</Text>
          <Text>Start Date: {invoiceData.startDate}</Text>
          <Text>End Date: {invoiceData.endDate}</Text>
          <Text>VAT Rate: {invoiceData.vatRate}</Text>
          <Text>Load Count: {invoiceData.loadCount}</Text>
          <Text>Total Amount: {invoiceData.totalAmount}</Text>
          <Text>VAT Amount: {invoiceData.vatAmount}</Text>
          <Text>Payment Amount: {invoiceData.paymentAmount}</Text>
        </View>
        <View>
          {invoiceData.loads.map((load) => (
            <View key={load.ID}>
              <Text>ID: {load.ID}</Text>
              <Text>Permit No: {load.PermitNo}</Text>
              <Text>Weight Doc No: {load.WeightDocNo}</Text>
              <Text>Origin: {load.Origin}</Text>
              <Text>Destination: {load.Destination}</Text>
              <Text>Rate: {load.Rate}</Text>
              <Text>Unit Quantity: {load.UnitQuantity}</Text>
              <Text>Load Total: {(load.Rate * load.UnitQuantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <Box>
      <PDFDownloadLink document={MyDocument} fileName="invoice.pdf">
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
      <Button variant="contained" color="primary" onClick={() => window.print()}>
        Print
      </Button>
    </Box>
  );
};

LinkInvoicePDFViewer.propTypes = {
  invoiceData: PropTypes.shape({
    companyName: PropTypes.string,
    companyAddress: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    vatRate: PropTypes.number,
    loadCount: PropTypes.number,
    totalAmount: PropTypes.number,
    vatAmount: PropTypes.number,
    paymentAmount: PropTypes.number,
    loads: PropTypes.arrayOf(
      PropTypes.shape({
        ID: PropTypes.string,
        PermitNo: PropTypes.string,
        WeightDocNo: PropTypes.string,
        Origin: PropTypes.string,
        Destination: PropTypes.string,
        Rate: PropTypes.number,
        UnitQuantity: PropTypes.number
      })
    )
  }).isRequired
};

export default LinkInvoicePDFViewer;