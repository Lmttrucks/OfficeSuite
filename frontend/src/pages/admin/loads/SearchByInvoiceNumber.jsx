import React, { useState } from 'react';
import config from '../../../config'; // Import the configuration

const SearchByInvoiceNumber = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/loads/search?outgoingInvoiceNo=${invoiceNumber}`,
        config.getAuthHeaders()
      );
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Search by Invoice Number</h1>
      <input
        type="text"
        placeholder="Invoice Number"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.ID}>
            {result.PermitNo} - {result.WeightDocNo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByInvoiceNumber;
