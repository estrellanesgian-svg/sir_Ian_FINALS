
import api from './axios'

function notifyAuthChange() {
    window.dispatchEvent(new Event('gridline-auth-change'))
}

// Register customer
export async function registerUser(userData) {
    const response = await api.post('/users/register/', userData)

    return response.data
}

// Login customer
export async function loginUser(credentials) {
    const response = await api.post('/token/', credentials)

    const { access, refresh } = response.data

    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)

    notifyAuthChange()

    return response.data
}

// Logout customer
export function logoutUser() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')

    notifyAuthChange()
}

// Check login status
export function isLoggedIn() {
    return Boolean(localStorage.getItem('access'))
}

// Get access token
export function getAccessToken() {
    return localStorage.getItem('access')
}
