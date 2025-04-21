const config = {
  Version: '0.0.0.8',
  apiBaseUrl: 'https://mlogappbe-aqgmbxe6aedqd5hg.westeurope-01.azurewebsites.net/api',
  encryptionKey: 'IKBVFnsdj569684dght589dhbeubHGTG',
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
};

export default config;
