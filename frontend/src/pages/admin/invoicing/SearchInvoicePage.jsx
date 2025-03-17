import React, { useState } from 'react';
import Last1000Invoices from '../../../components/invoice/Last1000Invoices';

const SearchInvoicePage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Search Invoices</h1>
      <Last1000Invoices refresh={refresh} />
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default SearchInvoicePage;