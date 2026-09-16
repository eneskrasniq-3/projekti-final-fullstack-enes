import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Orders() {
  const { user } = useAuth()
  const location = useLocation()
  const all = JSON.parse(localStorage.getItem('orders') || '[]')
  const orders = all.filter(o => o.userId === user.id).reverse()

  return (
    <div className="orders">
      <h1>Porositë e mia</h1>
      {location.state?.success && <div className="alert success">Pagesa u krye me sukses. Faleminderit!</div>}
      {orders.length === 0 ? (
        <p className="empty">Nuk ke asnjë porosi ende.</p>
      ) : (
        orders.map(o => (
          <div className="order" key={o.id}>
            <div className="order-head">
              <span>#{o.id.replace('ord', '')}</span>
              <span>{new Date(o.date).toLocaleDateString('sq-AL')}</span>
              <span className={`status ${o.status === 'Paguar' ? 'ok' : 'fail'}`}>{o.status}</span>
            </div>
            <div className="order-items">
              {o.items.map(i => (
                <div key={i.id} className="order-item">
                  <span>{i.name} × {i.qty}</span>
                  <span>€{(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="order-total">Totali: <strong>€{o.total.toLocaleString()}</strong></div>
          </div>
        ))
      )}
    </div>
  )
}
