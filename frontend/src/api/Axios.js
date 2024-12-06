import axios from "axios";

// Define your Axios instance
export const Axios = axios.create({
//   baseURL: import.meta.env.VITE_APPBASEBACKENDURL,
  baseURL: "http://localhost:5001/api",
});

// Attach the auth token to every request and handle file uploads
Axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("_auth");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Check if the request has file data and set the appropriate Content-Type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized responses
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("_auth");
    }
    return Promise.reject(error);
  }
);
