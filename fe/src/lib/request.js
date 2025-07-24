import axios from 'axios'

// Create an axios instance with base URL and timeout
const instance = axios.create({
  baseURL: 'https://localhost:5000', // API base URL
  timeout: 10000 // Request timeout in milliseconds
})

// Add a response interceptor to handle responses and errors globally
instance.interceptors.response.use(
  response => {
    const res = response.data

    // If the response code is not 200, treat it as an error
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data // Return only the core data
  },
  error => {
    // Handle request errors
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Encapsulate common HTTP methods for easy use
const api = {
  // GET request
  get(url, params, config = {}) {
    return instance.get(url, { params, ...config })
  },
  // POST request
  post(url, data, config = {}) {
    return instance.post(url, data, config)
  },
  // PUT request
  put(url, data, config = {}) {
    return instance.put(url, data, config)
  },
  // DELETE request
  delete(url, params, config = {}) {
    return instance.delete(url, { params, ...config })
  },
  // PATCH request
  patch(url, data, config = {}) {
    return instance.patch(url, data, config)
  }
}

export default api
