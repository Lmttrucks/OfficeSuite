import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LinkInvoiceGenForm from '../../../components/outinvoice/linkinvoicing/LinkInvoiceGenForm';
import LinkInvoicePreviewForm from '../../../components/outinvoice/linkinvoicing/LinkInvoicePreviewForm';
import LinkInvoicePreviewTable from '../../../components/outinvoice/linkinvoicing/LinkInvoicePreviewTable';
import LinkInvoicePDFViewer from '../../../components/outinvoice/linkinvoicing/LinkInvoicePDFViewer';
import axios from 'axios';
import config from '../../../config';

const LinkInvoicePage = () => {
  const location = useLocation();
  const { previewData, formData } = location.state || {
    previewData: [],
    formData: {}
  };
  const [invoiceData, setInvoiceData] = useState({ ...formData, previewData });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setInvoiceData(formData);
      setStep(2);
    }
  }, [formData]);

  const handleFormUpdate = (newData) => {
    setInvoiceData((prevData) => ({ ...prevData, ...newData }));
    setStep(2);
  };

  const handlePreview = async (updatedFormData) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/invoices/previewLinkedLoadsInvoice`,
        {
          CompanyName: updatedFormData.companyName,
          StartDate: updatedFormData.startDate,
          EndDate: updatedFormData.endDate
        },
        config.getAuthHeaders()
      );

      const loads = response.data;
      setInvoiceData((prevData) => ({ ...prevData, loads }));
      setStep(2);
    } catch (error) {
      console.error('Failed to preview linked loads invoice', error);
      alert('Failed to preview linked loads invoice');
    }
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
          const id = parseInt(load.ID, 10);
          const invoiceNoInt = parseInt(invoiceNo, 10);

          return axios.put(
            `${config.apiBaseUrl}/loads/update-outgoing-invoice-no`,
            { id, invoiceNo: invoiceNoInt },
            config.getAuthHeaders()
          );
        })
      );

      const finalInvoiceData = {
        ...updatedInvoiceData,
        invoiceNo
      };
      setInvoiceData(finalInvoiceData);
      setStep(3);
    } catch (error) {
      console.error('Failed to generate invoice', error);
      alert('Failed to generate invoice');
    }
  };

  console.log('Invoice Data:', invoiceData); // Add this line

  return (
    <div>
      {step === 1 ? (
        <LinkInvoiceGenForm
          initialData={invoiceData}
          onFormUpdate={handleFormUpdate}
          onPreview={handlePreview}
        />
      ) : step === 2 ? (
        <>
          <LinkInvoicePreviewForm
            previewData={invoiceData.loads}
            formData={invoiceData}
            onFormUpdate={handleFormUpdate}
            onGenerate={handleGenerate}
          />
          <LinkInvoicePreviewTable data={invoiceData.loads} />
        </>
      ) : (
        <LinkInvoicePDFViewer invoiceData={invoiceData} />
      )}
    </div>
  );
};

export default LinkInvoicePage;