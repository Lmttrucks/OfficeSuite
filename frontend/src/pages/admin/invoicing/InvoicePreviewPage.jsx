import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import InvoiceGenFrm from '../../../components/invoice/InvoiceGenFrm';
import InvoicePreviewTable from '../../../components/invoice/InvoicePreviewTable';
import InvoicePreviewForm from '../../../components/invoice/InvoicePreviewForm';
import InvoicePDFViewer from '../../../components/invoice/InvoicePDFViewer';
import axios from 'axios';
import config from '../../../config';

const InvoicePreviewPage = () => {
  const location = useLocation();
  const { previewData, formData } = location.state || {
    previewData: [],
    formData: {}
  };
  const [invoiceData, setInvoiceData] = useState({ ...formData, previewData });
  const [step, setStep] = useState(1);

  const handleFormUpdate = (newData) => {
    setInvoiceData((prevData) => ({ ...prevData, ...newData }));
    setStep(2);
  };

  const handleVatRateUpdate = (vatRate) => {
    setInvoiceData((prevData) => ({ ...prevData, vatRate }));
  };

  const handlePreview = (updatedFormData) => {
    setInvoiceData(updatedFormData);
    setStep(2);
  };

  const handlePrintPreview = () => {
    const updatedInvoiceData = {
      ...invoiceData,
      loadCount: invoiceData.loads?.length || 0,
      paymentAmount:
        (invoiceData.loads || []).reduce(
          (acc, row) => acc + row.Rate * row.UnitQuantity,
          0
        ) *
        (1 + (invoiceData.vatRate || 0) / 100),
      invoiceNo: '' // Set invoice number to blank for print preview
    };

    setInvoiceData(updatedInvoiceData);
    setStep(3); // Move to print preview step
  };

  const handleGenerate = async () => {
    try {
      const updatedInvoiceData = {
        ...invoiceData,
        loadCount: invoiceData.loads?.length || 0,
        paymentAmount:
          (invoiceData.loads || []).reduce(
            (acc, row) => acc + row.Rate * row.UnitQuantity,
            0
          ) *
          (1 + (invoiceData.vatRate || 0) / 100)
      };

      const response = await axios.post(
        `${config.apiBaseUrl}/invoices/insertInvoice`,
        {
          CompanyID: updatedInvoiceData.companyID,
          StartDate: updatedInvoiceData.startDate,
          EndDate: updatedInvoiceData.endDate,
          VatRate: updatedInvoiceData.vatRate,
          LoadCount: updatedInvoiceData.loadCount,
          PaymentAmount: updatedInvoiceData.paymentAmount,
          UserID: localStorage.getItem('userID'),
          Purchase: updatedInvoiceData.purchase // Include Purchase in the request
        },
        config.getAuthHeaders()
      );

      console.log('API response:', response); // Log the entire response

      const invoiceNo = response.data.invoiceNo; // Correctly access invoiceNo
      console.log('invoiceNo:', invoiceNo, typeof invoiceNo);

      setInvoiceData((prevData) => ({ ...prevData, invoiceNo }));

      await Promise.all(
        (updatedInvoiceData.loads || []).map((load) => {
          const id = parseInt(load.ID, 10);
          const invoiceNoInt = parseInt(invoiceNo, 10);

          return axios.put(
            `${config.apiBaseUrl}/loads/update-invoice-no`,
            { id, invoiceNo: invoiceNoInt },
            config.getAuthHeaders()
          );
        })
      );

      const finalInvoiceData = {
        ...updatedInvoiceData,
        loads: updatedInvoiceData.loads,
        invoiceNo
      };
      console.log('Final Invoice Data:', finalInvoiceData);
      setInvoiceData(finalInvoiceData);
      setStep(4); // Move to final invoice step
    } catch (error) {
      console.error('Failed to generate invoice', error);
      alert('Failed to generate invoice');
    }
  };

  return (
    <div>
      {step === 1 ? (
        <InvoiceGenFrm
          initialData={invoiceData}
          onFormUpdate={handleFormUpdate}
          onPreview={handlePreview}
        />
      ) : step === 2 ? (
        <>
          <InvoicePreviewForm
            previewData={invoiceData.loads}
            formData={invoiceData}
            onFormUpdate={handleFormUpdate}
            onVatRateUpdate={handleVatRateUpdate}
            onGenerate={handleGenerate}
            onPrintPreview={handlePrintPreview} // Add print preview handler
          />
          <InvoicePreviewTable data={invoiceData.loads} />
        </>
      ) : step === 3 ? (
        <>
          <InvoicePDFViewer invoiceData={invoiceData} /> {/* Use InvoicePDFViewer for print preview */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setStep(2)}
          >
            Back
          </Button>
        </>
      ) : (
        <>
          {console.log('Invoice Data before rendering:', invoiceData)}
          <InvoicePDFViewer invoiceData={invoiceData} />
        </>
      )}
    </div>
  );
};

export default InvoicePreviewPage;
