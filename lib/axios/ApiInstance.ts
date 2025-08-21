import axios from "axios";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

apiInstance.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");
  const session = await getSession();
  debugger
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token as string | undefined}`;
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    console.log("autorizado");
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada, redirigiendo a login...");
      // window.location.href = "/auth/login";
    }
    return Promise.reject(error.response.data);
  }
);

export default apiInstance;
