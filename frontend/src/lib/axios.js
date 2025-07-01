import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-nest-api-eight.vercel.app/api",
  withCredentials: true,
});
