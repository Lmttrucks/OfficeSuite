import React, { useState } from 'react';
import config from '../../../config'; // Import the configuration

const SearchByCompanyAndDate = () => {
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    startDate: '',
    endDate: ''
  });
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/loads/search?companyName=${searchParams.companyName}&startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`,
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
      <h1>Search by Company and Date</h1>
      <input
        name="companyName"
        placeholder="Company Name"
        onChange={handleChange}
      />
      <input type="date" name="startDate" onChange={handleChange} />
      <input type="date" name="endDate" onChange={handleChange} />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.ID}>
            {result.CompanyName} - {result.DeliveryDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByCompanyAndDate;
