import React from 'react';
import PropTypes from 'prop-types';

const RateSheet = React.forwardRef(({ rates }, ref) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Rate Sheet</h1>
      <p style={{ textAlign: 'center' }}>Generated on: {currentDate}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>KM Range From</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>KM Range To</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Rate (€)</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.RateID}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{rate.KMRangeFrom}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{rate.KMRangeTo}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{rate.RateEuro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

RateSheet.displayName = 'RateSheet';

RateSheet.propTypes = {
  rates: PropTypes.arrayOf(
    PropTypes.shape({
      RateID: PropTypes.number.isRequired,
      KMRangeFrom: PropTypes.number.isRequired,
      KMRangeTo: PropTypes.number.isRequired,
      RateEuro: PropTypes.number.isRequired
    })
  ).isRequired
};

export default RateSheet;