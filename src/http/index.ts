import axios from "axios";
import { BASE_URL } from "../constants";

export const axiosHttp = axios.create({
  baseURL: BASE_URL,
});

axiosHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});