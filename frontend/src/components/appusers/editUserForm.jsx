import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const EditUserForm = () => {
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userRole: '',
    isActive: true,
    employeeID: '',
    companyID: '',
    contactID: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseUrl}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        alert('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${config.apiBaseUrl}/auth/user/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          const userData = response.data;
          setFormData({
            username: userData.UserName || '',
            password: '',
            userRole: userData.UserRole || '',
            isActive: userData.IsActive || false,
            employeeID: userData.EmployeeID || '',
            companyID: userData.CompanyID || '',
            contactID: userData.ContactID || ''
          });
        } catch (err) {
          console.error(err);
          alert('Error fetching user data');
        }
      };
      fetchUser();
    } else {
      setFormData({
        username: '',
        password: '',
        userRole: '',
        isActive: true,
        employeeID: '',
        companyID: '',
        contactID: ''
      });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${config.apiBaseUrl}/auth/edit/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Select User:</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.UserID} value={user.UserID}>
              {user.UserName}
            </option>
          ))}
        </select>
      </div>
      {userId && (
        <>
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
          <button type="submit">Update User</button>
        </>
      )}
    </form>
  );
};

export default EditUserForm;
