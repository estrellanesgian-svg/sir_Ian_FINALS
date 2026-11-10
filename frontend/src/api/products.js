
import api from './axios'

// Get all products
export async function getProducts() {
    const response = await api.get('/products/')

    return response.data
}

// Get individual product
export async function getProduct(id) {
    const response = await api.get(`/products/${id}/`)

    return response.data
}

// Get F1 teams
export async function getTeams() {
    const response = await api.get('/products/teams/')

    return response.data
}

// Get product categories
export async function getCategories() {
    const response = await api.get('/products/categories/')

    return response.data
}
