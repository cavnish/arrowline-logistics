import axios from "axios";
import { apiUrl } from "../lib/api";

const adminApi = axios.create({
  baseURL: apiUrl("/api/admin"),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default adminApi;