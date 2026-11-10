
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Orders() {
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true

        async function loadOrders() {
            if (!localStorage.getItem('access')) {
                navigate('/login', {
                    state: { from: '/orders' },
                    replace: true,
                })
                return
            }

            try {
                const response = await api.get('/orders/')

                if (mounted) {
                    setOrders(
                        Array.isArray(response.data)
                            ? response.data
                            : response.data.results || []
                    )
                }
            } catch (err) {
                if (mounted) {
                    if (err.response?.status === 401) {
                        navigate('/login', {
                            state: { from: '/orders' },
                            replace: true,
                        })
                    } else {
                        setError('Unable to load your order history.')
                    }
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadOrders()

        return () => {
            mounted = false
        }
    }, [navigate])

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(Number(price))
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-PH', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    }

    const getStatusClass = (status) => {
        return status?.toLowerCase() || 'pending'
    }

    if (loading) {
        return (
            <main className="orders-page section-container">
                <p className="state-message">Loading your orders...</p>
            </main>
        )
    }

    return (
        <main className="orders-page section-container">

            <div className="orders-header">
                <p className="section-label">YOUR PURCHASES</p>
                <h1>MY ORDERS</h1>
                <p>Track and review your GRIDLINE purchases.</p>
            </div>

            {error && (
                <div className="cart-error">{error}</div>
            )}

            {!error && orders.length === 0 && (
                <div className="empty-orders">
                    <div className="empty-cart-icon">📦</div>

                    <h2>NO ORDERS YET</h2>

                    <p>
                        You haven't placed an order.
                        Explore our merchandise collection.
                    </p>

                    <Link to="/shop">
                        START SHOPPING →
                    </Link>
                </div>
            )}

            <div className="orders-list">

                {orders.map((order) => (
                    <article className="order-card" key={order.id}>

                        <div className="order-card-header">

                            <div>
                                <span className="order-label">
                                    ORDER NUMBER
                                </span>

                                <h2>#{order.id}</h2>

                                <p className="order-date">
                                    {formatDate(order.created_at)}
                                </p>
                            </div>

                            <span
                                className={`order-status ${getStatusClass(order.status)}`}
                            >
                                {order.status}
                            </span>

                        </div>

                        <div className="order-card-items">

                            {order.items.map((item) => (
                                <div className="order-product" key={item.id}>

                                    <div className="order-product-info">
                                        <h3>{item.product_name}</h3>

                                        <p>
                                            SKU: {item.variant_sku}
                                        </p>

                                        <p>
                                            Size: {item.size || 'Standard'}
                                            {' · '}
                                            Color: {item.color || 'Default'}
                                        </p>

                                        <p>
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>

                                    <div className="order-product-price">
                                        {formatPrice(item.subtotal)}
                                    </div>

                                </div>
                            ))}

                        </div>

                        <div className="order-card-footer">

                            <div className="order-payment-info">
                                <span>PAYMENT METHOD</span>
                                <strong>
                                    {order.payment_method === 'cod'
                                        ? 'Cash on Delivery'
                                        : order.payment_method}
                                </strong>

                                <span>PAYMENT STATUS</span>
                                <strong>{order.payment_status}</strong>
                            </div>

                            <div className="order-total">
                                <span>ORDER TOTAL</span>
                                <strong>
                                    {formatPrice(order.total_amount)}
                                </strong>
                            </div>

                        </div>

                        <div className="order-shipping">
                            <strong>DELIVERY ADDRESS</strong>
                            <p>{order.shipping_address}</p>
                            <p>Recipient: {order.full_name}</p>
                            <p>Contact: {order.phone_number}</p>
                        </div>

                    </article>
                ))}

            </div>

        </main>
    )
}
