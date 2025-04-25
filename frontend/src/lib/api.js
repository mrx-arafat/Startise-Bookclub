import axios from "axios";

const BASE_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post("/auth/admin/login", credentials),
};

export const books = {
  getAll: () => api.get("/books"),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post("/books", data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const borrowRequests = {
  getAll: async () => {
    const response = await axios.get("http://localhost:5001/api/borrow-requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response;
  },
  
  updateStatus: async (id, status, additionalData = {}) => {
    const response = await axios.put(
      `http://localhost:5001/api/borrow-requests/${id}`,
      { status, ...additionalData },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );
    return response;
  },
  
  approve: (id) => api.put(`/borrow-requests/${id}/approve`),
  reject: (id) => api.put(`/borrow-requests/${id}/reject`),
};

export const suggestions = {
  getAll: () => api.get("/book-suggestions"),
  delete: (id) => api.delete(`/book-suggestions/${id}`),
};

export const users = {
  getAll: () => api.get("/users"),
  create: (data) => api.post("/users", data),
  delete: (id) => api.delete(`/users/${id}`),
  toggleAdmin: (id) => api.put(`/users/${id}/toggle-admin`),
};

export default api; 