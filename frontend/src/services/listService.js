import axios from 'axios';

const API_URL = 'http://smart-guard-13.vercel.app/api/list';

const getAuthHeaders = (token) => ({
  headers: { 'x-auth-token': token },
});

const getList = (listType, token) => {
  return axios.get(`${API_URL}/${listType}`, getAuthHeaders(token));
};

const addDomain = (listType, domain, token) => {
  return axios.post(`${API_URL}/${listType}`, { domain }, getAuthHeaders(token));
};

const removeDomain = (listType, domain, token) => {
  // We use a POST request to /delete as defined in our backend route
  return axios.post(`${API_URL}/${listType}/delete`, { domain }, getAuthHeaders(token));
};

const listService = {
  getList,
  addDomain,
  removeDomain,
};

export default listService;