import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('build-better-auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('build-better-auth-token');
        localStorage.removeItem('build-better-user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>) => 
    axiosInstance.get<T>(url, { params }).then(res => res.data),
  
  post: <T>(url: string, data?: unknown) => 
    axiosInstance.post<T>(url, data).then(res => res.data),
  
  patch: <T>(url: string, data?: unknown) => 
    axiosInstance.patch<T>(url, data).then(res => res.data),
  
  put: <T>(url: string, data?: unknown) => 
    axiosInstance.put<T>(url, data).then(res => res.data),
  
  delete: <T>(url: string) => 
    axiosInstance.delete<T>(url).then(res => res.data),
};