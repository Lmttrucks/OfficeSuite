import axios from 'axios';
import CryptoJS from 'crypto-js';
import config from '../config';

// Encryption key (use a secure and consistent key)
const ENCRYPTION_KEY = config.encryptionKey;

// Encrypt data
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

// Decrypt data
const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Save encrypted data to localStorage
const saveEncryptedData = (localKey, data) => {
  const encrypted = encryptData(data);
  localStorage.setItem(localKey, encrypted);
};

// Retrieve and decrypt data from localStorage
const getDecryptedData = (localKey) => {
  const encrypted = localStorage.getItem(localKey);
  if (!encrypted) return null;
  return decryptData(encrypted);
};

// Save data to localStorage
const saveData = (localKey, data) => {
  localStorage.setItem(localKey, JSON.stringify(data));
};

// Retrieve data from localStorage
const getData = (localKey) => {
  const data = localStorage.getItem(localKey);
  if (!data) return null;
  return JSON.parse(data);
};

// Export clearTable function
export const clearTable = (localKey) => {
  console.log(`Clearing data for ${localKey}`);
  localStorage.removeItem(localKey);
};

// Sync data and save securely
const syncTable = async (apiEndpoint, localKey) => {
  try {
    clearTable(localKey); // Clear existing data
    const response = await axios.get(
      `${config.apiBaseUrl}${apiEndpoint}`,
      config.getAuthHeaders()
    );
    saveData(localKey, response.data); // Save JSON data to localStorage
    console.log(`${localKey} synced successfully.`);
  } catch (error) {
    console.error(`Error syncing ${localKey}:`, error);
  }
};

// Access data securely
const accessTable = (localKey) => {
  try {
    const data = getData(localKey);
    if (!data) {
      console.error(`${localKey} data not found.`);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Error accessing ${localKey}:`, error);
    return null;
  }
};

// Encrypt tables after 10 minutes
export const encryptTables = () => {
  setTimeout(
    () => {
      const tables = [
        'localCompanies',
        'localEmployees',
        'localVehicles',
        'localLocations',
        'localJobs'
      ];
      tables.forEach((table) => {
        const data = localStorage.getItem(table);
        if (data) {
          saveEncryptedData(table, data);
          console.log(`${table} encrypted.`);
        }
      });
    },
    10 * 60 * 1000
  ); // 10 minutes
};

// Exported functions for each table
export const syncCompanies = () => syncTable('/lookups/companies', 'localCompanies');
export const syncEmployees = () => syncTable('/lookups/employees', 'localEmployees');
export const syncVehicles = () => syncTable('/lookups/vehicles', 'localVehicles');
export const syncLocations = () => syncTable('/lookups/locations', 'localLocations');
export const syncJobs = () => syncTable('/lookups/jobs', 'localJobs');
export const syncOrigins = () => syncTable('/lookups/origins', 'localOrigins'); // New function for syncing origins
export const syncDestinations = () => syncTable('/lookups/destinations', 'localDestinations'); // New function for syncing destinations

export const accessCompanies = () => accessTable('localCompanies');
export const accessEmployees = () => accessTable('localEmployees');
export const accessVehicles = () => accessTable('localVehicles');
export const accessLocations = () => accessTable('localLocations');
export const accessJobs = () => accessTable('localJobs');
export const accessOrigins = () => accessTable('localOrigins'); // New function for accessing origins
export const accessDestinations = () => accessTable('localDestinations'); // New function for accessing destinations
