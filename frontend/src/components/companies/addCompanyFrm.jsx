import React, { useState } from 'react';
import api from '../../services/api';

function AddCompanyFrm() {
  const [formData, setFormData] = useState({
    CompanyName: '',
    CompanyAddress: '',
    CompanyPhone: '',
    CompanyEmail: ''
  });

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
      await api.post('/companies', formData);
      alert('Company added successfully');
    } catch (error) {
      console.error('There was an error adding the company!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
}

export default AddCompanyFrm;
