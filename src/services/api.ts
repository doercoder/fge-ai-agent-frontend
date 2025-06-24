import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Cambiar según tu backend

export const uploadDocument = async (payload: {
  filename: string;
  base64_data: string;
}) => {
  const res = await axios.post(`${API_BASE_URL}/process-base64`, payload);
  return res.data;
};

export const searchDocuments = async (query: string) => {
  const res = await axios.get(`${API_BASE_URL}/mcp/search`, {
    params: { query }
  });
  return res.data;
};

export const sendChatMessage = async (payload: {
  user_id: string;
  session_id: string;
  message: string;
}) => {
  const res = await axios.post(`${API_BASE_URL}/chat`, payload);
  return res.data;
};

// 📄 NUEVOS ENDPOINTS DEL MCP
export const getAllDocuments = async () => {
  const res = await axios.get(`${API_BASE_URL}/documents`);
  return res.data;
};

export const processDocument = async (payload: {
  title: string;
  base64_data: string;
  file_type: 'pdf' | 'image';
}) => {
  const res = await axios.post(`${API_BASE_URL}/process-document`, payload);
  return res.data;
};

export const getMcpDocuments = async () => {
  const res = await axios.get(`${API_BASE_URL}/mcp/explore-dir`);
  return res.data;
};