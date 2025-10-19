import axios from "axios";

const BASE_URL = "https://gentle-garden-502.x-cloud.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const suggestions = {
  getAll: async () => {
    const response = await api.get("/book-suggestions");
    return response.data;
  },

  getUserSuggestions: async () => {
    const response = await api.get("/book-suggestions/me");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/book-suggestions", data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/book-suggestions/${id}`);
    return response.data;
  },
};
