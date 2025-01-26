const config = {
  Version: '0.0.0.8',
  apiBaseUrl: 'http://localhost:5000/api',
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
