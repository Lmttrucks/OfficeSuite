import React, { useState } from 'react';
import AddLoadForm from '../../../components/loads/AddLoadForm';
import Last1000Table from '../../../components/loads/Last1000Table';

const AddLoadPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  const handleLoadAdded = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <div style={{ marginLeft: '60px' }}>
      <h1>Add Load</h1>
      <AddLoadForm onLoadAdded={handleLoadAdded} />
      <h2>Last 1000 Loads</h2>
      <Last1000Table refresh={refreshTable} />
    </div>
  );
};

export default AddLoadPage;
