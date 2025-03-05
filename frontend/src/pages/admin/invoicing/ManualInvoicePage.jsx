import React, { useState } from 'react';
import ManualInvoiceGenForm from '../../../components/outinvoice/ManualInvoiceGenForm';
import InvoicePDFViewer from '../../../components/outinvoice/InvoicePDFViewer';

const ManualInvoicePage = () => {
  const [invoiceData, setInvoiceData] = useState({});
  const [step, setStep] = useState(1);

  const handleFormUpdate = (newData) => {
    setInvoiceData((prevData) => ({ ...prevData, ...newData }));
    setStep(2);
  };

  const handlePreview = (updatedFormData) => {
    setInvoiceData(updatedFormData);
    setStep(2);
  };

  const handleGenerate = () => {
    // Implement the logic to generate the manual invoice
    setStep(3);
  };

  return (
    <div>
      {step === 1 ? (
        <ManualInvoiceGenForm
          initialData={invoiceData}
          onFormUpdate={handleFormUpdate}
          onPreview={handlePreview}
        />
      ) : step === 2 ? (
        <>
          {/* Implement a preview form and table if needed */}
          <button onClick={handleGenerate}>Generate Invoice</button>
        </>
      ) : (
        <InvoicePDFViewer invoiceData={invoiceData} />
      )}
    </div>
  );
};

export default ManualInvoicePage;