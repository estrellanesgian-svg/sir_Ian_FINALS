
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { loginUser } from '../api/auth'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [message] = useState(
        location.state?.message || ''
    )

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            await loginUser({
                username,
                password,
            })

            const destination = location.state?.from || '/'

            navigate(destination, {
                replace: true,
            })

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Invalid username or password.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card login-card">

                <div className="auth-heading">

                    <p className="section-label">
                        WELCOME BACK
                    </p>

                    <h1>GRID<span>LINE</span></h1>

                    <p>
                        Sign in to continue shopping
                        your favorite racing merchandise.
                    </p>

                </div>

                {message && (
                    <div className="auth-success">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="auth-field">
                        <label>Username</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>

                </form>

                <div className="auth-switch">
                    Don't have an account?

                    <Link to="/register">Create Account</Link>
                </div>

            </div>

        </main>
    )
}
