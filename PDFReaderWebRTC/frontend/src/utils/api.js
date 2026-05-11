import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const api = {
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  askQuestion: async (question) => {
    const response = await axios.post(`${API_BASE_URL}/ask-question`, {
      question: question
    });
    
    return response.data;
  },

  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  },

  resetSession: async () => {
    const response = await axios.post(`${API_BASE_URL}/reset`);
    return response.data;
  }
};