import axios from 'axios';

// The base URL for our backend API
const API_URL = 'http://smart-guard-13.vercel.app/api/auth';

// Register user
const register = (email, password) => {
  return axios.post(`${API_URL}/register`, {
    email,
    password,
  });
};

// Login user
const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};

const authService = {
  register,
  login,
};

export default authService;