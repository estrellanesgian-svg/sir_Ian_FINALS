
import { useState } from 'react'
import {
    Link,
    NavLink,
    useNavigate,
} from 'react-router-dom'

import { logoutUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const closeMenu = () => setMenuOpen(false)

    const handleLogout = () => {
        logoutUser()
        closeMenu()
        navigate('/', { replace: true })
    }

    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    GRID<span>LINE</span>
                    <small>F1 MERCH STORE</small>
                </Link>

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

                <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>

                    <NavLink to="/" onClick={closeMenu}>
                        Home
                    </NavLink>

                    <NavLink to="/shop" onClick={closeMenu}>
                        Shop
                    </NavLink>

                    {isAuthenticated ? (
                        <>
                            <NavLink to="/cart" onClick={closeMenu}>
                                Cart
                            </NavLink>

                            <NavLink to="/orders" onClick={closeMenu}>
                                My Orders
                            </NavLink>

                            <button
                                className="nav-login"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={closeMenu}>
                                Sign In
                            </NavLink>

                            <Link
                                to="/register"
                                className="nav-login"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </>
                    )}

                </nav>

            </div>
        </header>
    )
}
