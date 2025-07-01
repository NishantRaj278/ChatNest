import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});
