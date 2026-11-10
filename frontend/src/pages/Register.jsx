
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

export default function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        confirm_password: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            const {
                confirm_password,
                ...userData
            } = formData

            await registerUser(userData)

            navigate('/login', {
                state: {
                    message: 'Account created successfully! Please log in.',
                },
            })

        } catch (err) {
            const data = err.response?.data

            if (data) {
                const messages = Object.entries(data)
                    .map(([field, errors]) => {
                        const message = Array.isArray(errors)
                            ? errors.join(' ')
                            : String(errors)

                        return `${field}: ${message}`
                    })

                setError(messages.join(' '))
            } else {
                setError('Unable to create account. Please try again.')
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-heading">
                    <p className="section-label">JOIN THE GRID</p>

                    <h1>CREATE ACCOUNT</h1>

                    <p>
                        Create your GRIDLINE account and explore
                        our racing merchandise collection.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="auth-form-grid">

                        <div className="auth-field">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="First name"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Last name"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose username"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="09XXXXXXXXX"
                                required
                            />
                        </div>

                        <div className="auth-field full-width">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                            />
                        </div>

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
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>

                </form>

                <div className="auth-switch">
                    Already have an account?

                    <Link to="/login">Sign In</Link>
                </div>

            </div>

        </main>
    )
}
