import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getComplaints = async (params = {}) => {
  const response = await api.get('/complaints', { params });
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

export const createComplaint = async (data) => {
  const response = await api.post('/complaints', data);
  return response.data;
};

export const updateComplaint = async (id, data) => {
  const response = await api.patch(`/complaints/${id}`, data);
  return response.data;
};

export const submitFeedback = async (id, feedbackData) => {
  const response = await api.post(`/complaints/${id}/feedback`, feedbackData);
  return response.data;
};

export const analyzeComplaintAI = async (title, description) => {
  const response = await api.post('/ai/analyze', { title, description });
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getExportUrl = () => '/api/export';

export default api;
