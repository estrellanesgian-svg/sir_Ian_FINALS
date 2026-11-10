
import { useEffect, useState } from 'react'
import { getProducts, getTeams } from '../api/products'
import ProductCard from '../components/ProductCard'

export default function Shop() {
    const [products, setProducts] = useState([])
    const [teams, setTeams] = useState([])
    const [selectedTeam, setSelectedTeam] = useState('All')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true

        async function loadProducts() {
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
                    setError('Unable to load products.')
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadProducts()

        return () => {
            mounted = false
        }
    }, [])

    const filteredProducts = products.filter((product) => {
        return (
            selectedTeam === 'All' ||
            product.team?.name === selectedTeam
        )
    })

    return (
        <main className="shop-page section-container">

            <div className="shop-header">
                <p className="section-label">GRIDLINE STORE</p>
                <h1>SHOP ALL MERCHANDISE</h1>
                <p>
                    Explore racing-inspired merchandise
                    from your favorite teams.
                </p>
            </div>

            <div className="shop-toolbar">

                <div className="team-filters">
                    <button
                        className={
                            selectedTeam === 'All' ? 'filter-active' : ''
                        }
                        onClick={() => setSelectedTeam('All')}
                    >
                        ALL
                    </button>

                    {teams.map((team) => (
                        <button
                            key={team.id}
                            className={
                                selectedTeam === team.name
                                    ? 'filter-active'
                                    : ''
                            }
                            onClick={() => setSelectedTeam(team.name)}
                        >
                            {team.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                <span className="product-count">
                    {filteredProducts.length} PRODUCTS
                </span>

            </div>

            {loading && (
                <p className="state-message">Loading products...</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
                <p className="state-message">
                    No products found.
                </p>
            )}

        </main>
    )
}
