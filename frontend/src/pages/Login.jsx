import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';
import config from '../config'; // Import the configuration

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}/auth/login`, {
        username,
        password
      });
      // Check if the response contains the token
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role); // Store the role
        localStorage.setItem('username', response.data.username); // Store the username
        localStorage.setItem('userID', response.data.userID); // Store the userID

        // Navigate to splash screen immediately
        navigate('/loading');
      } else {
        setError('Invalid response from server');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword" style={styles.label}>
            Show Password
          </label>
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// Simple inline styles for demonstration
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px'
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    fontSize: '16px'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  label: {
    marginLeft: '10px',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  }
};

export default Login;
