
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getProduct } from '../api/products'
import api from '../api/axios'

export default function ProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)

    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        let mounted = true

        async function loadProduct() {
            try {
                const data = await getProduct(id)

                if (!mounted) return

                setProduct(data)
                setSelectedVariant(data.variants?.[0] || null)

            } catch (err) {
                if (mounted) {
                    setError('Unable to load product information.')
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadProduct()

        return () => {
            mounted = false
        }
    }, [id])

    const formattedPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(Number(price))
    }

    const handleAddToCart = async () => {
        setError('')
        setSuccess('')

        if (!localStorage.getItem('access')) {
            navigate('/login', {
                state: {
                    from: `/product/${id}`,
                },
            })
            return
        }

        if (!selectedVariant) {
            setError('No product variant available.')
            return
        }

        setAdding(true)

        try {
            await api.post('/cart/items/', {
                variant_id: selectedVariant.id,
                quantity: Number(quantity),
            })

            setSuccess('Product successfully added to your cart!')

        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login', {
                    state: {
                        from: `/product/${id}`,
                    },
                })
            } else {
                setError(
                    err.response?.data?.quantity?.[0] ||
                    err.response?.data?.error ||
                    'Unable to add product to cart.'
                )
            }
        } finally {
            setAdding(false)
        }
    }

    if (loading) {
        return (
            <main className="product-details-page">
                <p className="state-message">Loading product...</p>
            </main>
        )
    }

    if (!product) {
        return (
            <main className="product-details-page section-container">
                <p className="error-message">
                    {error || 'Product not found.'}
                </p>

                <Link to="/shop">Back to Shop</Link>
            </main>
        )
    }

    return (
        <main className="product-details-page section-container">

            <div className="product-breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/shop">Shop</Link>
                <span>/</span>
                <span>{product.name}</span>
            </div>

            <div className="product-details-layout">

                <div className="product-details-image">

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    ) : (
                        <div className="product-placeholder">
                            NO IMAGE AVAILABLE
                        </div>
                    )}

                    <span className="detail-team">
                        {product.team?.name}
                    </span>

                </div>

                <div className="product-details-info">

                    <p className="section-label">
                        {product.team?.name} MERCHANDISE
                    </p>

                    <h1>{product.name}</h1>

                    <p className="detail-category">
                        {product.category?.name}
                    </p>

                    <h2 className="detail-price">
                        {formattedPrice(product.price)}
                    </h2>

                    <p className="detail-description">
                        {product.description}
                    </p>

                    <div className="detail-divider"></div>

                    {product.variants?.length > 0 ? (
                        <>
                            <label className="variant-label">
                                Select Variant
                            </label>

                            <select
                                className="variant-select"
                                value={selectedVariant?.id || ''}
                                onChange={(e) => {
                                    const variant = product.variants.find(
                                        (item) => item.id === Number(e.target.value)
                                    )

                                    setSelectedVariant(variant)
                                    setQuantity(1)
                                    setError('')
                                }}
                            >
                                {product.variants.map((variant) => (
                                    <option
                                        key={variant.id}
                                        value={variant.id}
                                    >
                                        {variant.size || 'One Size'} -
                                        {' '}{variant.color || 'Default'} -
                                        {' '}Stock: {variant.stock}
                                    </option>
                                ))}
                            </select>

                            {selectedVariant && (
                                <>
                                    <p className="variant-stock">
                                        {selectedVariant.stock > 0
                                            ? `${selectedVariant.stock} items available`
                                            : 'Out of stock'}
                                    </p>

                                    <label className="variant-label">
                                        Quantity
                                    </label>

                                    <input
                                        className="quantity-input"
                                        type="number"
                                        min="1"
                                        max={selectedVariant.stock}
                                        value={quantity}
                                        disabled={selectedVariant.stock === 0}
                                        onChange={(e) => {
                                            const value = Number(e.target.value)

                                            if (
                                                value >= 1 &&
                                                value <= selectedVariant.stock
                                            ) {
                                                setQuantity(value)
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <p className="error-message">
                            No available variants for this product.
                        </p>
                    )}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {success && (
                        <p className="success-message">{success}</p>
                    )}

                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={
                            adding ||
                            !selectedVariant ||
                            selectedVariant.stock < 1
                        }
                    >
                        {adding ? 'ADDING TO CART...' : 'ADD TO CART'}
                    </button>

                    <Link to="/shop" className="back-to-shop">
                        ← CONTINUE SHOPPING
                    </Link>

                </div>

            </div>

        </main>
    )
}
