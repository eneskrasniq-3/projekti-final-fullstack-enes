import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Cart() {
  const { items, remove, setQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="empty">
        <p>Shporta jote është bosh.</p>
        <Link to="/" className="btn-solid">Shiko motorrat</Link>
      </div>
    )
  }

  const goToCheckout = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div className="cart">
      <h1>Shporta</h1>
      <div className="cart-list">
        {items.map(i => (
          <div className="cart-row" key={i.id}>
            <img src={i.image} alt={i.name} />
            <div className="cart-name">
              <h3>{i.name}</h3>
              <span>€{i.price.toLocaleString()}</span>
            </div>
            <input
              type="number"
              min="1"
              value={i.qty}
              onChange={e => setQty(i.id, e.target.value)}
            />
            <span className="cart-sub">€{(i.price * i.qty).toLocaleString()}</span>
            <button className="btn-ghost" onClick={() => remove(i.id)}>Hiq</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <span>Totali:</span>
        <strong>€{total.toLocaleString()}</strong>
      </div>
      <div className="cart-actions">
        <Link to="/" className="btn-outline">Vazhdo blerjet</Link>
        <button className="btn-solid" onClick={goToCheckout}>Vazhdo te pagesa</button>
      </div>
    </div>
  )
}
