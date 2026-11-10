
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAddToCart }) {

    const formattedPrice = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(product.price))

    return (
        <div className="product-card">

            <Link
                to={`/product/${product.id}`}
                className="product-image-container"
            >
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="product-placeholder">
                        NO IMAGE AVAILABLE
                    </div>
                )}

                <span className="product-team">
                    {product.team?.name}
                </span>
            </Link>

            <div className="product-info">

                <span className="product-category">
                    {product.category?.name}
                </span>

                <h3>{product.name}</h3>

                <p className="product-price">
                    {formattedPrice}
                </p>

                <Link
                    to={`/product/${product.id}`}
                    className="product-view-btn"
                >
                    View Product
                </Link>

                {onAddToCart && (
                    <button
                        className="product-add-btn"
                        onClick={() => onAddToCart(product)}
                    >
                        Add to Cart
                    </button>
                )}

            </div>

        </div>
    )
}
