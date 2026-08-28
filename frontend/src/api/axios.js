import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default api;

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh");
        }

        await refreshPromise;

        refreshPromise = null;

        return api(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
