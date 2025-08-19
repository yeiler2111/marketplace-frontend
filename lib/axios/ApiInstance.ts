import axios from "axios";
import Cookies from "js-cookie";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

apiInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    console.log('autorizado')
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada, redirigiendo a login...");
      window.location.href = '/auth/login';
    }
    return Promise.reject(error.response.data);
  }
);

export default apiInstance;
