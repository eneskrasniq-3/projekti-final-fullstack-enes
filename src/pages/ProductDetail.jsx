import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const { products } = useProducts()
  const { add } = useCart()
  const navigate = useNavigate()
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="empty">
        <p>Motorri nuk u gjet.</p>
        <Link to="/" className="btn-solid">Kthehu te lista</Link>
      </div>
    )
  }

  return (
    <div className="detail">
      <div className="detail-img">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="detail-info">
        <span className="tag">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="year">Viti {product.year}</p>
        <p className="detail-desc">{product.description}</p>
        <div className="price big">€{product.price.toLocaleString()}</div>
        <div className="detail-actions">
          <button className="btn-solid" onClick={() => add(product)}>Shto në shportë</button>
          <button className="btn-outline" onClick={() => { add(product); navigate('/shporta') }}>Bli tani</button>
        </div>
      </div>
    </div>
  )
}
