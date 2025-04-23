const config = {
  Version: '2.0.0.1',
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
