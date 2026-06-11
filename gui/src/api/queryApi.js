// api/QueryApi.js
import axios from "axios";

// Configuración base de axios
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones CRUD genéricas
export const getAllBd = async (endpoint) => {
  const response = await api.get(`/${endpoint}`);
  return response.data;
};

export const getDatasBd = async (endpoint) => {
  const response = await api.get(`/${endpoint}`);
  return response.data;
};

export const createBd = async (endpoint, data) => {
  const response = await api.post(`/${endpoint}`, data);
  return response.data;
};

export const updateBd = async (endpoint, id, data) => {
  const response = await api.put(`/${endpoint}/${id}`, data);
  return response.data;
};

export const updateBdRol = async (endpoint, data) => {
  const response = await api.put(`/${endpoint}`, data);
  return response.data;
};

export const deleteBd = async (endpoint, id) => {
  const response = await api.delete(`/${endpoint}/${id}`);
  return response.data;
};

export const searchBd = async (endpoint, query) => {
  const response = await api.get(`/${endpoint}/search?q=${query}`);
  return response.data;
};

export const setUrImport = async (endpoint, data) => {
  const formData = new FormData();
  formData.append("file", data);
  const response = await api.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};