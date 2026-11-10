
import {
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom'

import { useAuth } from './context/AuthContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'


function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        )
    }

    return children
}


function NotFound() {
    return (
        <main className="coming-soon section-container">
            <p className="section-label">GRIDLINE STORE</p>
            <h1>404 - PAGE NOT FOUND</h1>
            <p>The page you are looking for does not exist.</p>
        </main>
    )
}


export default function App() {
    return (
        <>
            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/shop" element={<Shop />} />

                <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="*" element={<NotFound />} />

            </Routes>

            <Footer />
        </>
    )
}
