import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const DeleteUserForm = () => {
  const [userId, setUserId] = useState('');
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

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiBaseUrl}/auth/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  return (
    <div>
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
      <p>Are you sure you want to delete this user?</p>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
};

export default DeleteUserForm;
