import React, { useState } from 'react';
import config from '../../../config'; // Import the configuration

const SearchByLast = () => {
  const [lastXLoads, setLastXLoads] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/loads/search?lastXLoads=${lastXLoads}`,
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
      <h1>Search by Last X Loads</h1>
      <input
        type="number"
        placeholder="Enter number of loads"
        value={lastXLoads}
        onChange={(e) => setLastXLoads(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.ID}>
            {result.DeliveryDate} - {result.WeightDocNo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByLast;
