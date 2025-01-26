import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import config from '../../config';

const EditJobForm = () => {
  const [formData, setFormData] = useState({
    JobID: '',
    HarvestDate: '',
    FellingLicenseNo: '',
    ForestName: '',
    ForestOwner: '',
    FMCompanyName: '',
    FMContactID: '',
    HarvestCompanyName: '',
    FWContactID: '',
    County: '',
    Town: '',
    FSC100: false,
    FSCCon: false,
    AccessType: '',
    GateLocation: '',
    RoadCondition: '',
    EstSize: '',
    DefaultCompany: '',
    DefaultOrigin: '',
    DefaultDestination: '',
    DefaultRate: '',
    PlantPassportLink: '',
    FellingLicenceLink: '',
    Comments: '',
    CleanUp: false,
    Started: false,
    Complete: false,
    UserID: '',
    DateAdded: ''
  });

  const [localCompanies, setLocalCompanies] = useState([]);
  const [localJobs, setLocalJobs] = useState([]);

  useEffect(() => {
    const companies = JSON.parse(localStorage.getItem('localCompanies')) || [];
    setLocalCompanies(companies);
    const jobs = JSON.parse(localStorage.getItem('localJobs')) || [];
    setLocalJobs(jobs);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value || ''
    });
  };

  const handleJobSelect = async (event, newValue) => {
    if (newValue) {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/jobs/${newValue.JobID}`,
          config.getAuthHeaders()
        );
        const selectedJob = response.data;
        setFormData({
          ...selectedJob,
          HarvestDate: formatDate(selectedJob.HarvestDate),
          DateAdded: formatDate(selectedJob.DateAdded),
          FMCompanyName:
            localCompanies.find((c) => c.CompanyID === selectedJob.FMCompanyID)
              ?.CompanyName || '',
          HarvestCompanyName:
            localCompanies.find(
              (c) => c.CompanyID === selectedJob.HarvestCompanyID
            )?.CompanyName || ''
        });
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    } else {
      setFormData({
        JobID: '',
        HarvestDate: '',
        FellingLicenseNo: '',
        ForestName: '',
        ForestOwner: '',
        FMCompanyName: '',
        FMContactID: '',
        HarvestCompanyName: '',
        FWContactID: '',
        County: '',
        Town: '',
        FSC100: false,
        FSCCon: false,
        AccessType: '',
        GateLocation: '',
        RoadCondition: '',
        EstSize: '',
        DefaultCompany: '',
        DefaultOrigin: '',
        DefaultDestination: '',
        DefaultRate: '',
        PlantPassportLink: '',
        FellingLicenceLink: '',
        Comments: '',
        CleanUp: false,
        Started: false,
        Complete: false,
        UserID: '',
        DateAdded: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}/jobs/${formData.JobID}`,
        formData,
        config.getAuthHeaders()
      );
      if (response.status === 200) {
        alert('Job updated successfully');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
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
          onChange={handleJobSelect}
          renderInput={(params) => (
            <TextField {...params} label="Job ID" name="JobID" />
          )}
        />
      </label>
      <label>
        Harvest Date:
        <input
          type="date"
          name="HarvestDate"
          value={formData.HarvestDate || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Felling License No:
        <input
          type="text"
          name="FellingLicenseNo"
          value={formData.FellingLicenseNo || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Forest Name:
        <input
          type="text"
          name="ForestName"
          value={formData.ForestName || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Forest Owner:
        <input
          type="text"
          name="ForestOwner"
          value={formData.ForestOwner || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        FM Company Name:
        <Autocomplete
          options={localCompanies}
          getOptionLabel={(option) => option.CompanyName || ''}
          value={
            localCompanies.find(
              (c) => c.CompanyName === formData.FMCompanyName
            ) || ''
          }
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              FMCompanyName: newValue ? newValue.CompanyName : ''
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="FM Company Name"
              name="FMCompanyName"
            />
          )}
        />
      </label>
      <label>
        FM Contact ID:
        <input
          type="text"
          name="FMContactID"
          value={formData.FMContactID || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Harvest Company Name:
        <Autocomplete
          options={localCompanies}
          getOptionLabel={(option) => option.CompanyName || ''}
          value={
            localCompanies.find(
              (c) => c.CompanyName === formData.HarvestCompanyName
            ) || ''
          }
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              HarvestCompanyName: newValue ? newValue.CompanyName : ''
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Harvest Company Name"
              name="HarvestCompanyName"
            />
          )}
        />
      </label>
      <label>
        FW Contact ID:
        <input
          type="text"
          name="FWContactID"
          value={formData.FWContactID || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        County:
        <input
          type="text"
          name="County"
          value={formData.County || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Town:
        <input
          type="text"
          name="Town"
          value={formData.Town || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        FSC 100:
        <input
          type="checkbox"
          name="FSC100"
          checked={formData.FSC100}
          onChange={handleChange}
        />
      </label>
      <label>
        FSC Con:
        <input
          type="checkbox"
          name="FSCCon"
          checked={formData.FSCCon}
          onChange={handleChange}
        />
      </label>
      <label>
        Access Type:
        <input
          type="text"
          name="AccessType"
          value={formData.AccessType || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Gate Location:
        <input
          type="text"
          name="GateLocation"
          value={formData.GateLocation || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Road Condition:
        <input
          type="text"
          name="RoadCondition"
          value={formData.RoadCondition || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Estimated Size:
        <input
          type="number"
          name="EstSize"
          value={formData.EstSize || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Default Company:
        <input
          type="text"
          name="DefaultCompany"
          value={formData.DefaultCompany || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Default Origin:
        <input
          type="text"
          name="DefaultOrigin"
          value={formData.DefaultOrigin || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Default Destination:
        <input
          type="text"
          name="DefaultDestination"
          value={formData.DefaultDestination || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Default Rate:
        <input
          type="number"
          name="DefaultRate"
          value={formData.DefaultRate || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Plant Passport Link:
        <input
          type="url"
          name="PlantPassportLink"
          value={formData.PlantPassportLink || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Felling Licence Link:
        <input
          type="url"
          name="FellingLicenceLink"
          value={formData.FellingLicenceLink || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Comments:
        <textarea
          name="Comments"
          value={formData.Comments || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Clean Up:
        <input
          type="checkbox"
          name="CleanUp"
          checked={formData.CleanUp}
          onChange={handleChange}
        />
      </label>
      <label>
        Started:
        <input
          type="checkbox"
          name="Started"
          checked={formData.Started}
          onChange={handleChange}
        />
      </label>
      <label>
        Complete:
        <input
          type="checkbox"
          name="Complete"
          checked={formData.Complete}
          onChange={handleChange}
        />
      </label>
      <label>
        User ID:
        <input
          type="text"
          name="UserID"
          value={formData.UserID || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Date Added:
        <input
          type="date"
          name="DateAdded"
          value={formData.DateAdded || ''}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Edit Job</button>
    </form>
  );
};

export default EditJobForm;
