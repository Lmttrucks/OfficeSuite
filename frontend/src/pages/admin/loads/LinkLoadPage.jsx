import React, { useState } from 'react';
import AddLinkLoadTable from '../../../components/loads/AddLinkLoadTable';

const LinkLoadPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);

  const handleRefreshTable = () => {
    setRefreshTable(!refreshTable);
  };

  return (
    <div>
      <h1>Link Load</h1>
      <AddLinkLoadTable refreshTable={refreshTable} />
    </div>
  );
};

export default LinkLoadPage;