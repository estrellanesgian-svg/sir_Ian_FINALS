
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => Boolean(localStorage.getItem('access'))
    )

    useEffect(() => {
        const updateAuth = () => {
            setIsAuthenticated(
                Boolean(localStorage.getItem('access'))
            )
        }

        window.addEventListener('gridline-auth-change', updateAuth)
        window.addEventListener('storage', updateAuth)

        return () => {
            window.removeEventListener('gridline-auth-change', updateAuth)
            window.removeEventListener('storage', updateAuth)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}
