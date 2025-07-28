import axios from "axios";

// Read Tiingo token and API base URL from environment variables (Vite project)
const TIINGO_TOKEN = import.meta.env.VITE_TIINGO_TOKEN;
const TIINGO_API = import.meta.env.VITE_TIINGO_API;
const BE_API = import.meta.env.VITE_BE_API;

// Create an axios instance with base URL and timeout for your local API
const instance = axios.create({
  baseURL: BE_API, // API base URL
  timeout: 10000, // Request timeout in milliseconds
});

// Add a response interceptor to handle responses and errors globally
instance.interceptors.response.use(
  (response) => {
    const res = response.data;

console.log(res);

    // If the response code is not 200, treat it as an error
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res.data; // Return only the core data
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Create a separate axios instance for Tiingo API
const tiingoInstance = axios.create({
  baseURL: TIINGO_API, // Tiingo API base URL
  timeout: 10000, // Request timeout in milliseconds
});

// Add a request interceptor for Tiingo instance to automatically include token param in every request
tiingoInstance.interceptors.request.use((config) => {
  // Make sure params exists
  if (!config.params) config.params = {};
  // Always add Tiingo token as a param
  config.params.token = TIINGO_TOKEN;
  return config;
});

// Add a response interceptor for Tiingo API to handle responses and errors
tiingoInstance.interceptors.response.use(
  (response) => response.data, // Return response data directly
  (error) => {
    // Handle Tiingo request errors
    console.error("Tiingo Request error:", error);
    return Promise.reject(error);
  },
);

// Encapsulate common HTTP methods for easy use (local API)
const api = {
  // GET request
  get(url, params, config = {}) {
    return instance.get(url, { params, ...config });
  },
  // POST request
  post(url, data, config = {}) {
    return instance.post(url, data, config);
  },
  // PUT request
  put(url, data, config = {}) {
    return instance.put(url, data, config);
  },
  // DELETE request
  delete(url, params, config = {}) {
    return instance.delete(url, { params, ...config });
  },
  // PATCH request
  patch(url, data, config = {}) {
    return instance.patch(url, data, config);
  },

  // Tiingo GET request: automatically includes token param
  tiingoGet(url, params, config = {}) {
    return tiingoInstance.get(url, { params, ...config });
  },
};

export default api;
