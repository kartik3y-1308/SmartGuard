import axios from 'axios';

const API_URL = 'http://localhost:5000/api/email';

const checkEmail = (email, token) => {
  const config = {
    headers: {
      'x-auth-token': token,
    },
  };
  // This calls the new backend route we just made
  return axios.post(`${API_URL}/check`, { email }, config);
};

const getHistory = (token) => {
  const config = {
    headers: { 'x-auth-token': token },
  };
  return axios.get(`${API_URL}/history`, config);
};

const emailService = {
  checkEmail,
  getHistory,
};

export default emailService;