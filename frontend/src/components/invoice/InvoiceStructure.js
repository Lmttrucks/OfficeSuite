import React from 'react';
import PropTypes from 'prop-types';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet
} from '@react-pdf/renderer';
import logo from '../../assets/img/LMH.jpg'; // Import the logo image

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  logo: {
    width: 150,
    height: 80
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 8,
    lineHeight: 1.2
  },
  dividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10
  },
  postBox: {
    marginTop: 10,
    width: '50%',
    padding: 10,
    fontSize: 10,
    lineHeight: 1.5
  },
  invoiceDetails: {
    width: '45%',
    padding: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingVertical: 3
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: 'bold'
  },
  detailValue: {
    fontSize: 8
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  tableRow: {
    flexDirection: 'row',
    wrap: false
  },
  tableCol: {
    width: '12.5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  tableCell: {
    margin: 3,
    fontSize: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  footerLeft: {
    width: '50%',
    padding: 10,
    fontSize: 8,
    border: '1px solid #ccc'
  },
  summaryBox: {
    width: '50%',
    padding: 10,
    border: '1px solid #ccc'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: 'bold'
  },
  summaryValue: {
    fontSize: 8
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    paddingTop: 30
  }
});

// Header Component
const Header = ({ invoiceData }) => (
  <View style={styles.header}>
    <Image style={styles.logo} src={logo} />
    <View style={styles.companyInfo}>
      <Text>Liam Morris Haulage Limited</Text>
      <Text>Cloonlyon, Ballygar, Co. Galway</Text>
      <Text>Email: liammorris@topmail.ie</Text>
      <Text>Phone: 0872588928</Text>
    </View>
  </View>
);

Header.propTypes = {
  invoiceData: PropTypes.shape({
    companyName: PropTypes.string,
    companyAddress: PropTypes.string,
    companyEmail: PropTypes.string
  }).isRequired
};

// Postbox Component (Customer Information)
const PostBox = ({ invoiceData }) => (
  <View style={styles.postBox}>
    <Text>{invoiceData.companyName}</Text>
    <Text>{invoiceData.companyAddress}</Text>
    <Text>{invoiceData.companyEmail}</Text>
  </View>
);

PostBox.propTypes = {
  invoiceData: PropTypes.shape({
    companyName: PropTypes.string,
    companyAddress: PropTypes.string,
    companyEmail: PropTypes.string
  }).isRequired
};

// Invoice Details Component
const InvoiceDetails = ({ invoiceData }) => {
  const today = new Date().toLocaleDateString();

  return (
    <View style={styles.invoiceDetails}>
      {[
        ['Invoice Type:', invoiceData.purchase ? 'Purchase' : 'Sales'],
        ['Invoice No:', invoiceData.invoiceNo || ''],
        ['Date Generated:', invoiceData.dateGenerated || today],
        ['Company ID:', invoiceData.companyID || ''],
        ['Start Date:', invoiceData.startDate || ''],
        ['End Date:', invoiceData.endDate || ''],
        ['VAT Rate:', `${invoiceData.vatRate || 0}%`],
        ['Payment Amount:', `Eur${(invoiceData.paymentAmount || 0).toFixed(2)}`],
        ['Load Count:', invoiceData.loadCount || 0]
      ].map(([label, value], idx) => (
        <View style={styles.detailRow} key={idx}>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

InvoiceDetails.propTypes = {
  invoiceData: PropTypes.shape({
    invoiceNo: PropTypes.string,
    companyID: PropTypes.string,
    startDate: PropTypes.string,
    dateGenerated: PropTypes.string,
    endDate: PropTypes.string,
    vatRate: PropTypes.number,
    paymentAmount: PropTypes.number,
    loadCount: PropTypes.number,
    purchase: PropTypes.bool // Add purchase
  }).isRequired
};

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Table Body
const Body = ({ loads }) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      {[
        'Delivery Date',
        'Permit No',
        'Weight Doc No',
        'Origin',
        'Destination',
        'Rate',
        'Unit Quantity',
        'Load Total'
      ].map((header, idx) => (
        <View style={styles.tableCol} key={idx}>
          <Text style={styles.tableCell}>{header}</Text>
        </View>
      ))}
    </View>
    {loads.map((load, idx) => (
      <View style={styles.tableRow} key={idx}>
        {[
          formatDate(load.DeliveryDate),
          load.PermitNo,
          load.WeightDocNo,
          load.Origin,
          load.Destination,
          load.Rate,
          load.UnitQuantity,
          (load.Rate * load.UnitQuantity).toFixed(2)
        ].map((value, i) => (
          <View style={styles.tableCol} key={i}>
            <Text style={styles.tableCell}>{value}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

Body.propTypes = {
  loads: PropTypes.arrayOf(
    PropTypes.shape({
      DeliveryDate: PropTypes.string,
      PermitNo: PropTypes.string,
      WeightDocNo: PropTypes.string,
      Origin: PropTypes.string,
      Destination: PropTypes.string,
      Rate: PropTypes.number,
      UnitQuantity: PropTypes.number
    })
  ).isRequired
};

// Footer Component
const Footer = ({ netTotal, vatAmount, grossTotal }) => (
  <View style={styles.footer}>
    <View style={styles.footerLeft}>
      <Text>IBAN: IE74AIBK93714207013073</Text>
      <Text>BIC: AIBKIE2D</Text>
      <Text>VAT No: IE 9654843G</Text>
      <Text>Payment should be made within 30 days.</Text>
    </View>
    <View style={styles.summaryBox}>
            {[
                ['Net Total:', `Eur${netTotal.toFixed(2)}`],
                ['VAT:', `Eur${vatAmount.toFixed(2)}`],
                ['Gross Total:', `Eur${grossTotal.toFixed(2)}`]
            ].map(([label, value], idx) => (
                <View style={styles.summaryRow} key={idx}>
                    <Text style={styles.summaryLabel}>{label}</Text>
                    <Text style={styles.summaryValue}>{value}</Text>
                </View>
            ))}
    </View>
  </View>
);

Footer.propTypes = {
  netTotal: PropTypes.number.isRequired,
  vatAmount: PropTypes.number.isRequired,
  grossTotal: PropTypes.number.isRequired
};

// Main Invoice Structure
const InvoiceStructure = ({ invoiceData }) => {
  const netTotal = (invoiceData.loads || []).reduce(
    (acc, load) => acc + load.Rate * load.UnitQuantity,
    0
  );
  const vatAmount = netTotal * ((invoiceData.vatRate || 0) / 100);
  const grossTotal = netTotal + vatAmount;

  // Function to paginate records into pages
  const paginateRecords = (records, firstPageCount, otherPageCount) => {
    const pages = [];
    // First page with 21 records
    pages.push(records.slice(0, firstPageCount));
    // Remaining pages with 45 records each
    for (let i = firstPageCount; i < records.length; i += otherPageCount) {
      pages.push(records.slice(i, i + otherPageCount));
    }
    return pages;
  };

  // Paginate records: 21 for the first page, 45 for others
  const pages = paginateRecords(invoiceData.loads || [], 25, 43);

  return (
    <Document>
      {pages.map((pageLoads, index) => (
        <Page key={index} style={styles.page}>
          {index === 0 && <Header invoiceData={invoiceData} />}
          {index === 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10
              }}
            >
              <PostBox invoiceData={invoiceData} />
              <InvoiceDetails invoiceData={invoiceData} />
            </View>
          )}
          <Body loads={pageLoads} />
          {index === pages.length - 1 && (
            <Footer
              netTotal={netTotal}
              vatAmount={vatAmount}
              grossTotal={grossTotal}
            />
          )}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </Page>
      ))}
    </Document>
  );
};

InvoiceStructure.propTypes = {
  invoiceData: PropTypes.shape({
    invoiceNo: PropTypes.string,
    companyID: PropTypes.string,
    startDate: PropTypes.string,
    dateGenerated: PropTypes.string,
    endDate: PropTypes.string,
    vatRate: PropTypes.number,
    paymentAmount: PropTypes.number,
    loadCount: PropTypes.number,
    loads: PropTypes.arrayOf(
      PropTypes.shape({
        DeliveryDate: PropTypes.string,
        PermitNo: PropTypes.string,
        WeightDocNo: PropTypes.string,
        Origin: PropTypes.string,
        Destination: PropTypes.string,
        Rate: PropTypes.number,
        UnitQuantity: PropTypes.number
      })
    ).isRequired,
    purchase: PropTypes.bool // Add purchase
  }).isRequired
};

// Function to generate the custom filename
export const getFileName = (invoiceData) => {
  const companyID = invoiceData.companyID || 'undefined';
  const invoiceNo = invoiceData.invoiceNo || 'undefined';
  return `LMH${companyID}-${invoiceNo}.pdf`;
};

export default InvoiceStructure;
