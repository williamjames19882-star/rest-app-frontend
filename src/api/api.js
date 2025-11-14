import axios from 'axios';

// Use production backend URL or local proxy for development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://rest-app-backend.onrender.com/api'
  : '/api';

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

// Contact API
export const contactAPI = {
  submitRequest: (contactData) => api.post('/contact', contactData),
};

// Admin API
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getAllReservations: (params) => api.get('/admin/reservations', { params }),
  getStats: () => api.get('/admin/stats'),
  createMenuItem: (formData) => api.post('/admin/menu/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMenuItem: (id, formData) => api.put(`/admin/menu/items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMenuItem: (id) => api.delete(`/admin/menu/items/${id}`),
  updateReservationStatus: (id, status) => api.put(`/admin/reservations/${id}/status`, { status }),
  // Table management
  getAllTables: () => api.get('/admin/tables'),
  createTable: (tableData) => api.post('/admin/tables', tableData),
  updateTable: (id, tableData) => api.put(`/admin/tables/${id}`, tableData),
  deleteTable: (id) => api.delete(`/admin/tables/${id}`),
  // Contact requests
  getAllContactRequests: (params) => api.get('/admin/contact-requests', { params }),
  updateContactRequestStatus: (id, status) => api.put(`/admin/contact-requests/${id}/status`, { status }),
  // Banners
  getAllBanners: () => api.get('/admin/banners'),
  createBanner: (formData) => api.post('/admin/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (id, formData) => api.put(`/admin/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
  // Transactions
  getAllTransactions: (params) => api.get('/admin/transactions', { params }),
};

// Public banners API
export const bannersAPI = {
  getActive: () => api.get('/banners'),
};

// Transactions API
export const transactionsAPI = {
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  getMyTransactions: () => api.get('/transactions/my-transactions'),
  getTransaction: (id) => api.get(`/transactions/${id}`),
};

export default api;

