import axios from "axios";
import { useStateContext } from "../context/ContextProvider";

// const axiosClient = axios.create({
//   baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
// })

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://10.18.6.149:8080/"
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  // Don't add Authorization header for login endpoints
  if (config.url && !config.url.includes("/temp-login") && !config.url.includes("/adminlogin")) {
    config.headers.Authorization = token;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // Handle connection errors gracefully
    if (!error.response) {
      console.error("Network error - backend may be unreachable:", error.message);
      // Return a mock response or rethrow
      throw new Error("Unable to connect to server. Please check your connection.");
    }
    
    const { response } = error;
    if (response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    }

    throw error;
  }
);

export default axiosClient;
