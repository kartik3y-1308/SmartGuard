import axios from "axios";

const API_URL = "https://smart-guard-13.vercel.app/api";

const getAuthHeaders = (token) => ({
  headers: { "x-auth-token": token },
});

const getSiteStats = (token) => {
  return axios.get(`${API_URL}/stats`, getAuthHeaders(token));
};

const getAllUsers = (token) => {
  return axios.get(`${API_URL}/users`, getAuthHeaders(token));
};

const adminService = {
  getSiteStats,
  getAllUsers,
};

export default adminService;
