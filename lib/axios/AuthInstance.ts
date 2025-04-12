import axios from "axios";

export const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_AUTH,
});

authInstance.interceptors.response.use(
  (response) => response,
  
  (error) => {
    console.error("Auth error:", error);
    return Promise.reject(error);
  }
);

export default authInstance;
