import axios from 'axios';

const API_URL = 'http://smart-guard-13.vercel.app/api/scan';

// Function to scan a URL
const scanUrl = (url, token) => {
  // We must send the token in the headers for the protected route
  const config = {
    headers: {
      'x-auth-token': token,
    },
  };

  return axios.post(API_URL, { url }, config);
};
const getHistory = (token) => {
  const config = {
    headers: {
      'x-auth-token': token,
    },
  };
  return axios.get(`${API_URL}/history`, config);
};
// We will add the function to get history later
const scanService = {
  scanUrl,
  getHistory,
};

export default scanService;