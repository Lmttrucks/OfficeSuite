import React, { useState } from 'react';
import LinkedLoadsTable from '../../../components/loads/LinkedLoadsTable';

const LinkLoadPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  const handleRefreshTable = () => {
    setRefreshTable(!refreshTable);
  };

  return (
    <div>
      <h1>Link Load</h1>
      <LinkedLoadsTable refresh={refreshTable} />
    </div>
  );
};

export default LinkLoadPage;