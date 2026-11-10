
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../api/axios'

export default function Cart() {
    const navigate = useNavigate()

    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [completedOrder, setCompletedOrder] = useState(null)

    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        shipping_address: '',
        payment_method: 'cod',
    })

    useEffect(() => {
        let mounted = true

        async function loadCart() {
            if (!localStorage.getItem('access')) {
                navigate('/login', {
                    state: { from: '/cart' },
                    replace: true,
                })
                return
            }

            try {
                const response = await api.get('/cart/')

                if (mounted) {
                    setCart(response.data)
                }
            } catch (err) {
                if (mounted) {
                    setError('Unable to load your shopping cart.')
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadCart()

        return () => {
            mounted = false
        }
    }, [navigate])

    const items = cart?.items || []

    const totalAmount = items.reduce(
        (total, item) => total + Number(item.subtotal),
        0
    )

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(Number(price))
    }

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1 || newQuantity > item.stock) {
            return
        }

        setUpdatingId(item.id)
        setError('')
        setSuccess('')

        try {
            const response = await api.patch(
                `/cart/items/${item.id}/`,
                { quantity: newQuantity }
            )

            setCart(response.data)
        } catch (err) {
            setError(
                err.response?.data?.quantity?.[0] ||
                err.response?.data?.error ||
                'Unable to update quantity.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    const removeItem = async (itemId) => {
        setUpdatingId(itemId)
        setError('')
        setSuccess('')

        try {
            const response = await api.delete(
                `/cart/items/${itemId}/`
            )

            setCart(response.data)
            setSuccess('Item removed from cart.')
        } catch (err) {
            setError('Unable to remove this item.')
        } finally {
            setUpdatingId(null)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCheckout = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (items.length === 0) {
            setError('Your shopping cart is empty.')
            return
        }

        setCheckoutLoading(true)

        try {
            const response = await api.post(
                '/orders/checkout/',
                formData
            )

            setCompletedOrder(response.data)

            setCart({
                ...cart,
                items: [],
            })

            setSuccess('Your order has been placed successfully!')

        } catch (err) {
            const data = err.response?.data

            if (data && typeof data === 'object') {
                const messages = Object.entries(data)
                    .map(([field, value]) => {
                        const message = Array.isArray(value)
                            ? value.join(' ')
                            : String(value)

                        return `${field}: ${message}`
                    })

                setError(messages.join(' '))
            } else {
                setError('Unable to place your order. Please try again.')
            }
        } finally {
            setCheckoutLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="cart-page section-container">
                <p className="state-message">Loading your cart...</p>
            </main>
        )
    }

    return (
        <main className="cart-page section-container">

            <div className="cart-header">
                <p className="section-label">YOUR SELECTION</p>
                <h1>SHOPPING CART</h1>
                <p>Review your merchandise before checkout.</p>
            </div>

            {completedOrder && (
                <div className="order-success-card">

                    <div className="success-icon">✓</div>

                    <h2>ORDER PLACED!</h2>

                    <p>
                        Thank you for shopping with GRIDLINE.
                        Your order has been successfully submitted.
                    </p>

                    <div className="success-order-details">
                        <span>Order Number</span>
                        <strong>#{completedOrder.id}</strong>

                        <span>Order Total</span>
                        <strong>
                            {formatPrice(completedOrder.total_amount)}
                        </strong>

                        <span>Payment Method</span>
                        <strong>Cash on Delivery</strong>

                        <span>Order Status</span>
                        <strong>Pending</strong>
                    </div>

                    <Link to="/orders" className="cart-checkout-btn">
                        VIEW MY ORDERS
                    </Link>

                </div>
            )}

            {error && (
                <div className="cart-error">{error}</div>
            )}

            {success && !completedOrder && (
                <div className="cart-success">{success}</div>
            )}

            {!completedOrder && (
                <>
                    {items.length === 0 ? (
                        <div className="empty-cart">

                            <div className="empty-cart-icon">🛒</div>

                            <h2>YOUR CART IS EMPTY</h2>

                            <p>
                                Looks like you haven't added any
                                merchandise yet.
                            </p>

                            <Link to="/shop">
                                EXPLORE MERCHANDISE →
                            </Link>

                        </div>
                    ) : (
                        <div className="cart-layout">

                            <section className="cart-items-section">

                                <div className="cart-section-heading">
                                    <h2>YOUR ITEMS</h2>
                                    <span>{items.length} ITEMS</span>
                                </div>

                                {items.map((item) => (
                                    <div
                                        className="cart-item"
                                        key={item.id}
                                    >

                                        <div className="cart-item-image">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.product_name}
                                                />
                                            ) : (
                                                <span>NO IMAGE</span>
                                            )}
                                        </div>

                                        <div className="cart-item-details">

                                            <span className="cart-item-team">
                                                {item.team_name}
                                            </span>

                                            <h3>{item.product_name}</h3>

                                            <p>
                                                Size: {item.size || 'Standard'}
                                                {' · '}
                                                Color: {item.color || 'Default'}
                                            </p>

                                            <span className="cart-item-sku">
                                                SKU: {item.sku}
                                            </span>

                                            <strong className="cart-item-price">
                                                {formatPrice(item.price)}
                                            </strong>

                                            <div className="cart-item-actions">

                                                <div className="quantity-control">

                                                    <button
                                                        onClick={() => updateQuantity(
                                                            item,
                                                            item.quantity - 1
                                                        )}
                                                        disabled={
                                                            updatingId === item.id ||
                                                            item.quantity <= 1
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <span>{item.quantity}</span>

                                                    <button
                                                        onClick={() => updateQuantity(
                                                            item,
                                                            item.quantity + 1
                                                        )}
                                                        disabled={
                                                            updatingId === item.id ||
                                                            item.quantity >= item.stock
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                                <button
                                                    className="remove-item-btn"
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={updatingId === item.id}
                                                >
                                                    REMOVE
                                                </button>

                                            </div>

                                        </div>

                                        <div className="cart-item-subtotal">
                                            {formatPrice(item.subtotal)}
                                        </div>

                                    </div>
                                ))}

                                <Link to="/shop" className="continue-shopping">
                                    ← CONTINUE SHOPPING
                                </Link>

                            </section>

                            <aside className="checkout-section">

                                <div className="checkout-card">

                                    <h2>ORDER SUMMARY</h2>

                                    <div className="checkout-row">
                                        <span>Items</span>
                                        <strong>{items.length}</strong>
                                    </div>

                                    <div className="checkout-row">
                                        <span>Subtotal</span>
                                        <strong>{formatPrice(totalAmount)}</strong>
                                    </div>

                                    <div className="checkout-row">
                                        <span>Shipping</span>
                                        <strong>To be arranged</strong>
                                    </div>

                                    <div className="checkout-total">
                                        <span>ORDER TOTAL</span>
                                        <strong>{formatPrice(totalAmount)}</strong>
                                    </div>

                                    <p className="checkout-note">
                                        Final shipping fees, if applicable,
                                        will be arranged separately.
                                    </p>

                                    <form onSubmit={handleCheckout}>

                                        <h3>SHIPPING INFORMATION</h3>

                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder="Enter recipient name"
                                            required
                                        />

                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            placeholder="09XXXXXXXXX"
                                            required
                                        />

                                        <label>Shipping Address</label>
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleChange}
                                            placeholder="House number, street, barangay, city..."
                                            rows="4"
                                            required
                                        />

                                        <label>Payment Method</label>
                                        <select
                                            name="payment_method"
                                            value={formData.payment_method}
                                            onChange={handleChange}
                                        >
                                            <option value="cod">
                                                Cash on Delivery
                                            </option>
                                        </select>

                                        <button
                                            type="submit"
                                            className="cart-checkout-btn"
                                            disabled={checkoutLoading}
                                        >
                                            {checkoutLoading
                                                ? 'PROCESSING ORDER...'
                                                : 'PLACE ORDER'}
                                        </button>

                                    </form>

                                </div>

                            </aside>

                        </div>
                    )}
                </>
            )}

        </main>
    )
}
