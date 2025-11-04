// Axios API configuration
// Task: T050-T051 - Implement Axios configuration with base URL

import axios from 'axios'
import config from './config'

const api = axios.create({
    baseURL: `${config.apiUrl}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
    config => {
        // Add any auth tokens here in the future
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response

            if (status === 404) {
                console.error('Resource not found')
            } else if (status === 500) {
                console.error('Server error')
            }

            return Promise.reject(data)
        } else if (error.request) {
            // Request made but no response
            console.error('Network error - no response from server')
            return Promise.reject({ error: 'Network Error', message: 'Could not connect to server' })
        } else {
            // Something else happened
            console.error('Request error:', error.message)
            return Promise.reject({ error: 'Request Error', message: error.message })
        }
    }
)

export default api
