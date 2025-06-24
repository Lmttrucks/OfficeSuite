const config = {
  Version: '2.0.0.1',
  apiBaseUrl: 'https://mlogwebapp-g3caaygbcrenfxe5.westeurope-01.azurewebsites.net/api', // Updated to backend URL
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
