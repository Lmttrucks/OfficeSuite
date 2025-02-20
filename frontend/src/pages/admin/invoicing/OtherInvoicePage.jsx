import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OtherInvoiceGenFrm from '../../../components/outinvoice/otherinvoices/OtherInvoiceGenFrm';
import OtherInvoicePreviewTable from '../../../components/outinvoice/otherinvoices/OtherInvoicePreviewTable';
import OtherInvoicePreviewForm from '../../../components/outinvoice/otherinvoices/OtherInvoicePreviewForm';
import InvoicePDFViewer from '../../../components/outinvoice/InvoicePDFViewer';
import axios from 'axios';
import config from '../../../config';

const OtherInvoicePage = () => {
  const location = useLocation();
  const { previewData, formData } = location.state || {
    previewData: [],
    formData: {}
  };
  const [invoiceData, setInvoiceData] = useState({ ...formData, previewData });
  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log('Invoice Data:', invoiceData); // Log the invoice data
  }, [invoiceData]);

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
        `${config.apiBaseUrl}/invoices/insertOutInvoice`,
        {
          CompanyID: updatedInvoiceData.companyID,
          StartDate: updatedInvoiceData.startDate,
          EndDate: updatedInvoiceData.endDate,
          VatRate: updatedInvoiceData.vatRate,
          LoadCount: updatedInvoiceData.loadCount,
          PaymentAmount: updatedInvoiceData.paymentAmount,
          UserID: localStorage.getItem('userID')
        },
        config.getAuthHeaders()
      );

      const invoiceNo = response.data.outvoiceNo;

      setInvoiceData((prevData) => ({ ...prevData, invoiceNo }));

      await Promise.all(
        (updatedInvoiceData.loads || []).map((load) => {
          const id = parseInt(load.ID, 10); // Use ID instead of LoadID
          const invoiceNoInt = parseInt(invoiceNo, 10);

          return axios.put(
            `${config.apiBaseUrl}/loads/update-link-load`,
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
      setInvoiceData(finalInvoiceData);
      setStep(3);
    } catch (error) {
      console.error('Failed to generate invoice', error);
      alert('Failed to generate invoice');
    }
  };

  return (
    <div>
      {step === 1 ? (
        <OtherInvoiceGenFrm
          initialData={invoiceData}
          onFormUpdate={handleFormUpdate}
          onPreview={handlePreview}
        />
      ) : step === 2 ? (
        <>
          <OtherInvoicePreviewForm
            previewData={invoiceData.loads}
            formData={invoiceData}
            onGenerate={handleGenerate}
          />
          <OtherInvoicePreviewTable data={invoiceData.loads} />
        </>
      ) : (
        <>
          <InvoicePDFViewer invoiceData={invoiceData} />
        </>
      )}
    </div>
  );
};

export default OtherInvoicePage;
