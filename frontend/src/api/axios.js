
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
})

// Attach JWT access token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Handle expired or invalid JWT tokens
api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status
        const url = error.config?.url || ''

        const isTokenEndpoint = url.includes('/token/')

        const hasAuthorization =
            Boolean(error.config?.headers?.Authorization) ||
            Boolean(error.config?.headers?.authorization)

        if (
            status === 401 &&
            hasAuthorization &&
            !isTokenEndpoint
        ) {
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')

            window.dispatchEvent(
                new Event('gridline-auth-change')
            )
        }

        return Promise.reject(error)
    }
)

export default api
