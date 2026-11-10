
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getTeams } from '../api/products'
import ProductCard from '../components/ProductCard'

export default function Home() {
    const [products, setProducts] = useState([])
    const [teams, setTeams] = useState([])
    const [activeTeam, setActiveTeam] = useState('All')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true

        async function loadData() {
            try {
                const [productData, teamData] = await Promise.all([
                    getProducts(),
                    getTeams(),
                ])

                if (!mounted) return

                setProducts(
                    Array.isArray(productData)
                        ? productData
                        : productData.results || []
                )

                setTeams(
                    Array.isArray(teamData)
                        ? teamData
                        : teamData.results || []
                )
            } catch (err) {
                if (mounted) {
                    setError(
                        'Unable to load merchandise. Please check the backend server.'
                    )
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadData()

        return () => {
            mounted = false
        }
    }, [])

    const filteredProducts = products.filter((product) => {
        return (
            activeTeam === 'All' ||
            product.team?.name === activeTeam
        )
    })

    return (
        <div className="home-page">

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-background"></div>

                <div className="hero-container">

                    <div className="hero-content">
                        <p className="hero-label">
                            THE RACING COLLECTION
                        </p>

                        <h1>
                            BUILT FOR
                            <br />
                            <span>THE GRID.</span>
                        </h1>

                        <p className="hero-description">
                            Discover motorsport-inspired merchandise
                            from Mercedes, Ferrari, and McLaren.
                            Bring the racing spirit into your everyday style.
                        </p>

                        <Link to="/shop" className="hero-button">
                            EXPLORE COLLECTION
                            <span>→</span>
                        </Link>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-circle hero-circle-one"></div>
                        <div className="hero-circle hero-circle-two"></div>

                        <div className="hero-visual-text">
                            <span>01</span>
                            <strong>RACE</strong>
                            <strong>YOUR</strong>
                            <strong>STYLE.</strong>
                        </div>

                        <div className="hero-bottom-label">
                            GRIDLINE / F1 MERCH STORE
                        </div>
                    </div>

                </div>

                <div className="hero-bottom">
                    <span>PRECISION</span>
                    <span>PERFORMANCE</span>
                    <span>PASSION</span>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="teams-section section-container">

                <div className="section-heading">
                    <div>
                        <p className="section-label">CHOOSE YOUR TEAM</p>
                        <h2>THE THREE TEAMS</h2>
                    </div>

                    <p>
                        Represent your favorite racing team.
                    </p>
                </div>

                <div className="team-grid">

                    {teams.map((team) => (
                        <button
                            key={team.id}
                            className="team-card"
                            style={{
                                '--team-color': team.primary_color || '#e10600'
                            }}
                            onClick={() => {
                                setActiveTeam(team.name)
                                document.getElementById('merchandise')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >
                            <span className="team-indicator"></span>

                            {team.logo && (
                                <img
                                    src={team.logo}
                                    alt={`${team.name} logo`}
                                />
                            )}

                            <h3>{team.name}</h3>

                            <span className="team-explore">
                                EXPLORE TEAM →
                            </span>
                        </button>
                    ))}

                </div>
            </section>

            {/* PRODUCT SECTION */}
            <section
                className="products-section section-container"
                id="merchandise"
            >

                <div className="section-heading">
                    <div>
                        <p className="section-label">GRIDLINE COLLECTION</p>
                        <h2>FEATURED MERCHANDISE</h2>
                    </div>

                    <Link to="/shop" className="view-all-link">
                        VIEW ALL PRODUCTS →
                    </Link>
                </div>

                <div className="team-filters">
                    <button
                        className={activeTeam === 'All' ? 'filter-active' : ''}
                        onClick={() => setActiveTeam('All')}
                    >
                        ALL TEAMS
                    </button>

                    {teams.map((team) => (
                        <button
                            key={team.id}
                            className={
                                activeTeam === team.name
                                    ? 'filter-active'
                                    : ''
                            }
                            onClick={() => setActiveTeam(team.name)}
                        >
                            {team.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                {loading && (
                    <p className="state-message">
                        Loading merchandise...
                    </p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                {!loading && !error && (
                    <>
                        <div className="product-grid">
                            {filteredProducts.slice(0, 6).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <p className="state-message">
                                No products available for this team yet.
                            </p>
                        )}
                    </>
                )}

            </section>

            {/* BRAND BANNER */}
            <section className="brand-banner">
                <div className="brand-banner-content">
                    <p>FOR THE LOVE OF RACING</p>
                    <h2>FEEL THE SPEED.</h2>
                    <Link to="/shop">
                        SHOP THE COLLECTION →
                    </Link>
                </div>
            </section>

        </div>
    )
}
