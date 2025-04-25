import axios from "axios";

const BASE_URL = "http://localhost:5001/api";

export const suggestions = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/book-suggestions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data;
  },

  getUserSuggestions: async (userId) => {
    const response = await axios.get(
      `${BASE_URL}/book-suggestions/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post(`${BASE_URL}/book-suggestions`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/book-suggestions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data;
  },
};
