import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Menu API
export const menuAPI = {
  getMenuItems: (category) => api.get('/menu/items', { params: { category } }),
  getMenuItem: (id) => api.get(`/menu/items/${id}`),
  getCategories: () => api.get('/menu/categories'),
};

// Reservations API
export const reservationsAPI = {
  getAvailableTables: (date, time) => 
    api.get('/reservations/tables/available', { params: { date, time } }),
  createReservation: (reservationData) => 
    api.post('/reservations', reservationData),
  getMyReservations: () => 
    api.get('/reservations/my-reservations'),
};

export default api;

