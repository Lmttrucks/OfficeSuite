import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10
  },
  header: {
    textAlign: 'center',
    marginBottom: 5
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    border: '1px solid black',
    padding: 1, // Reduced padding
    flex: 1,
    textAlign: 'center',
    fontSize: 10, // Reduced font size
    lineHeight: 1.2 // Reduced line height
  },
  footer: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 8
  }
});

const RateSheetPDF = ({ ratesData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Rate Sheet</Text>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>KM Range From</Text>
            <Text style={styles.tableCell}>KM Range To</Text>
            <Text style={styles.tableCell}>Rate (€)</Text>
          </View>
          {ratesData.map((rate) => (
            <View style={styles.tableRow} key={rate.RateID}>
              <Text style={styles.tableCell}>{rate.KMRangeFrom}</Text>
              <Text style={styles.tableCell}>{rate.KMRangeTo}</Text>
              <Text style={styles.tableCell}>{rate.RateEuro}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text>Note: Rates are subject to change without prior notice.</Text>
        </View>
      </Page>
    </Document>
  );
};

RateSheetPDF.propTypes = {
  ratesData: PropTypes.arrayOf(
    PropTypes.shape({
      RateID: PropTypes.number.isRequired,
      KMRangeFrom: PropTypes.number.isRequired,
      KMRangeTo: PropTypes.number.isRequired,
      RateEuro: PropTypes.number.isRequired
    })
  ).isRequired
};

export default RateSheetPDF;