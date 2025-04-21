import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.apiBaseUrl 
});

// Inject Authorization Header dynamically
api.interceptors.request.use(
  (request) => {
    const authHeaders = config.getAuthHeaders().headers;
    request.headers = { ...request.headers, ...authHeaders };
    return request;
  },
  (error) => Promise.reject(error)
);

export default api;
