import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import config from '../../config';

const DeleteJobForm = () => {
  const [formData, setFormData] = useState({
    JobID: ''
  });
  const [localJobs, setLocalJobs] = useState([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem('localJobs')) || [];
    setLocalJobs(jobs);
  }, []);

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
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiBaseUrl}/jobs/${formData.JobID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting job');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Job ID:
        <Autocomplete
          options={localJobs}
          getOptionLabel={(option) => option.JobID || ''}
          value={localJobs.find((j) => j.JobID === formData.JobID) || null}
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              JobID: newValue ? newValue.JobID : ''
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Job ID" name="JobID" />
          )}
        />
      </label>
      <button type="submit">Delete Job</button>
    </form>
  );
};

export default DeleteJobForm;
