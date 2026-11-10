
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">
                    <h2>
                        GRID<span>LINE</span>
                    </h2>

                    <p>
                        Your destination for Formula 1-inspired
                        merchandise and racing collectibles.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>

                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/cart">Shopping Cart</Link>
                    <Link to="/orders">My Orders</Link>
                </div>

                <div className="footer-teams">
                    <h3>Our Teams</h3>

                    <p>Mercedes</p>
                    <p>Ferrari</p>
                    <p>McLaren</p>
                </div>

            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} GRIDLINE.
                    All rights reserved.
                </p>

                <p>Built for racing fans.</p>
            </div>

        </footer>
    )
}
