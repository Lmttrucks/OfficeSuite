import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userRole: '',
    isActive: true,
    employeeID: '',
    companyID: '',
    contactID: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.apiBaseUrl}/auth/register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User added successfully');
    } catch (err) {
      console.error(err);
      alert('Error adding user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>User Role:</label>
        <input
          type="text"
          name="userRole"
          value={formData.userRole}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Is Active:</label>
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
        />
      </div>
      <div>
        <label>Employee ID:</label>
        <input
          type="number"
          name="employeeID"
          value={formData.employeeID}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Company ID:</label>
        <input
          type="number"
          name="companyID"
          value={formData.companyID}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Contact ID:</label>
        <input
          type="number"
          name="contactID"
          value={formData.contactID}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
