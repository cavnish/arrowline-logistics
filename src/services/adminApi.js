import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "";

const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use(async (config) => {
  const result = supabase ? await supabase.auth.getSession() : null;
  const token = result?.data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminApi;
