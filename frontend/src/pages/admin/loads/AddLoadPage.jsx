import React, { useState } from 'react';
import AddLoadForm from '../../../components/AddLoadForm';
import Last100Table from '../../../components/Last100Table';

const AddLoadPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  const handleLoadAdded = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <div style={{ marginLeft: '60px' }}>
      <h1>Add Load</h1>
      <AddLoadForm onLoadAdded={handleLoadAdded} />
      <h2>Last 100 Loads</h2>
      <Last100Table refresh={refreshTable} />
    </div>
  );
};

export default AddLoadPage;
