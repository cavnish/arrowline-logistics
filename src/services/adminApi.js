import axios from "axios";

const API_URL = (import.meta.env?.VITE_API_URL || "").trim();
const adminApi = axios.create({
  baseURL: `${API_URL.replace(/\/$/, "")}/api/admin`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default adminApi;