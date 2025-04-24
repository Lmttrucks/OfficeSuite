import React, { useState, useEffect } from 'react';
import AddRateForm from '../../../components/rates/AddRateForm';
import AdjustRatesForm from '../../../components/rates/AdjustRatesForm';
import RatesTable from '../../../components/rates/RatesTable';
import RateSheetPDFViewer from '../../../components/rates/RateSheetPDFViewer';
import config from '../../../config';
import { Button } from '@mui/material';

const RatesPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const [ratesData, setRatesData] = useState([]); // Store rates for the RateSheet
  const [showPreview, setShowPreview] = useState(false); // Toggle PDF preview

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
          setRatesData(data);
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

  return (
    <div style={{ marginLeft: '60px' }}>
      <h1>Manage Rates</h1>
      <AddRateForm onRateAdded={handleRateChange} />
      <AdjustRatesForm onRatesAdjusted={handleRateChange} />
      <Button
        variant="contained"
        onClick={() => setShowPreview(true)}
        sx={{ mb: 2 }}
      >
        Preview Rate Sheet
      </Button>
      <h2>All Rates</h2>
      <RatesTable refresh={refreshTable} onRateEdited={handleRateChange} />

      {/* PDF Viewer for RateSheet */}
      {showPreview && (
        <RateSheetPDFViewer
          ratesData={ratesData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default RatesPage;