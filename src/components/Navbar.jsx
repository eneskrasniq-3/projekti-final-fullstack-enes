import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">Moto<span>Shop</span></Link>
        <nav className="nav-links">
          <NavLink to="/">Motorrat</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          {user && <NavLink to="/porosite">Porositë</NavLink>}
          <Link to="/shporta" className="cart-link">
            Shporta{count > 0 && <span className="badge">{count}</span>}
          </Link>
          {user ? (
            <div className="nav-user">
              <span>Përshëndetje, {user.name}</span>
              <button className="btn-ghost" onClick={handleLogout}>Dil</button>
            </div>
          ) : (
            <NavLink to="/login" className="btn-solid">Hyr</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
