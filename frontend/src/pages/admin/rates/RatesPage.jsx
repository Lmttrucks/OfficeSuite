import React, { useState, useRef, useEffect } from 'react';
import AddRateForm from '../../../components/rates/AddRateForm';
import AdjustRatesForm from '../../../components/rates/AdjustRatesForm';
import RatesTable from '../../../components/rates/RatesTable';
import RateSheet from '../../../components/rates/RateSheet';
import { useReactToPrint } from 'react-to-print';
import config from '../../../config';
import { Button } from '@mui/material'; // Import Button from Material-UI

const RatesPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const [rates, setRates] = useState([]); // Store rates for the RateSheet
  const rateSheetRef = useRef(); // Reference for the RateSheet component

  const handleRateChange = () => {
    setRefreshTable((prev) => !prev);
  };

  // Fetch rates for the RateSheet
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
  }, [refreshTable]);

  // Handle printing the RateSheet
  const handlePrint = useReactToPrint({
    content: () => rateSheetRef.current // Reference the RateSheet component
  });

  return (
    <div style={{ marginLeft: '60px' }}>
      <h1>Manage Rates</h1>
      <AddRateForm onRateAdded={handleRateChange} />
      <AdjustRatesForm onRatesAdjusted={handleRateChange} />
      <Button variant="contained" onClick={handlePrint} sx={{ mb: 2 }}>
        Print Rate Sheet
      </Button>
      <h2>All Rates</h2>
      <RatesTable refresh={refreshTable} onRateEdited={handleRateChange} />

      {/* Hidden RateSheet component for printing */}
      <div style={{ display: 'none' }}>
        <RateSheet ref={rateSheetRef} rates={rates} />
      </div>
    </div>
  );
};

export default RatesPage;