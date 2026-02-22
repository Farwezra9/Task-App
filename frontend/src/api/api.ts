import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url ?? "";

      const isAuthRoute =
        url.includes("/auth/login") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      if ((status === 401 || status === 403) && !isAuthRoute) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default API;