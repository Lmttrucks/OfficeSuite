import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function EditCompanyFrm() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [formData, setFormData] = useState({
    CompanyName: '',
    CompanyAddress: '',
    CompanyPhone: '',
    CompanyEmail: ''
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('There was an error fetching the companies!', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    try {
      const response = await api.get(`/companies/${companyId}`);
      setFormData(response.data);
    } catch (error) {
      console.error('There was an error fetching the company details!', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/companies/${selectedCompany}`, formData);
      alert('Company updated successfully');
    } catch (error) {
      console.error('There was an error updating the company!', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) {
      alert('Please select a company to delete');
      return;
    }

    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await api.delete(`/companies/${selectedCompany}`);
        alert('Company deleted successfully');
        setCompanies(companies.filter(company => company.CompanyID !== selectedCompany));
        setSelectedCompany('');
        setFormData({
          CompanyName: '',
          CompanyAddress: '',
          CompanyPhone: '',
          CompanyEmail: ''
        });
      } catch (error) {
        console.error('There was an error deleting the company!', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Select Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange} required>
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.CompanyID} value={company.CompanyID}>
              {company.CompanyName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Company Name:</label>
        <input
          type="text"
          name="CompanyName"
          value={formData.CompanyName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Company Address:</label>
        <input
          type="text"
          name="CompanyAddress"
          value={formData.CompanyAddress}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Company Phone:</label>
        <input
          type="text"
          name="CompanyPhone"
          value={formData.CompanyPhone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Company Email:</label>
        <input
          type="email"
          name="CompanyEmail"
          value={formData.CompanyEmail}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
    </form>
  );
}

export default EditCompanyFrm;
