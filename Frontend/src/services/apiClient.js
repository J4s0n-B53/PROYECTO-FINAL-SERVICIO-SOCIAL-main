import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  r => r,
  err => {
    const is401 = err.response?.status === 401;
    const isAuthEndpoint = ['/auth/login', '/auth/me', '/auth/logout'].some(path =>
      err.config?.url?.includes(path)
    );

    if (is401 && !isAuthEndpoint) {
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export default api;
