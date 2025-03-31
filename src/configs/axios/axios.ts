import axios from "axios";
import { BASE_URL } from "../env";

const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "text/plain",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
    }
    return Promise.reject(error);
  }
);

export default api;
