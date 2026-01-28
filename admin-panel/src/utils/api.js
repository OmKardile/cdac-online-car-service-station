const API_BASE_URL = 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const uid = typeof window !== 'undefined' ? localStorage.getItem('uid') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(uid && { uid }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: false, message: error.message };
  }
};

// Auth APIs
export const loginUser = (email, password) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getProfile = () => apiCall('/auth/profile');

// Admin APIs
export const getAdminStatistics = () => apiCall('/admin/statistics');

export const getAllUsers = () => apiCall('/admin/users');

export const getAllBookings = () => apiCall('/admin/bookings');

export const getServices = () => apiCall('/services');

export const getStations = () => apiCall('/stations');

export const getStationServices = (stationId) =>
  apiCall(`/services/station/${stationId}`);

// Service Management
export const createService = (serviceData) =>
  apiCall('/admin/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });

export const updateService = (serviceData) =>
  apiCall('/admin/services', {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });

export const deleteService = (serviceId) =>
  apiCall('/admin/services', {
    method: 'DELETE',
    body: JSON.stringify({ id: serviceId }),
  });

// Station APIs
export const createStation = (stationData) =>
  apiCall('/admin/stations', {
    method: 'POST',
    body: JSON.stringify(stationData),
  });

export const addServiceToStation = (stationServiceData) =>
  apiCall('/admin/station-services', {
    method: 'POST',
    body: JSON.stringify(stationServiceData),
  });

// Booking APIs
export const updateBookingStatus = (bookingId, status) =>
  apiCall(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const getBookingDetails = (bookingId) =>
  apiCall(`/bookings/${bookingId}`);

// User Management
export const getUserById = (userId) => apiCall(`/users/${userId}`);

export const updateUserRole = (userId, role) =>
  apiCall(`/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });

export const updateUserStatus = (userId, isActive) =>
  apiCall(`/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  });
