import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

const getAuthHeaders = (token) => ({
  headers: { 'x-auth-token': token },
});

const getAnalytics = (token) => {
  return axios.get(`${API_URL}/analytics`, getAuthHeaders(token));
};

const updatePassword = (passwords, token) => {
  return axios.put(`${API_URL}/password`, passwords, getAuthHeaders(token));
};

const userService = {
  getAnalytics,
  updatePassword,
};

export default userService;