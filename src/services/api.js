import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

/* ── attach JWT token to every request automatically ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("safemap_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── handle 401 globally — auto logout if token expires ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("safemap_token");
      localStorage.removeItem("safemap_user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;