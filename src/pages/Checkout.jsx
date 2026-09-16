import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function formatCard(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

export default function Checkout() {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', card: '', expiry: '', cvc: '', zip: '' })
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  if (items.length === 0) {
    return <div className="empty"><p>Shporta është bosh.</p></div>
  }

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const saveOrder = (status) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push({
      id: 'ord' + Date.now(),
      userId: user.id,
      items,
      total,
      status,
      date: new Date().toISOString()
    })
    localStorage.setItem('orders', JSON.stringify(orders))
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const digits = form.card.replace(/\s/g, '')
    if (!form.name.trim()) return setError('Shkruaj emrin në kartë.')
    if (digits.length !== 16) return setError('Numri i kartës duhet të ketë 16 shifra.')
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return setError('Data e skadimit duhet të jetë MM/VV.')
    if (form.cvc.length !== 3) return setError('CVC duhet të ketë 3 shifra.')

    setProcessing(true)
    setTimeout(() => {
      if (digits === '4000000000000002') {
        saveOrder('Dështuar')
        setProcessing(false)
        setError('Karta u refuzua. Provo një kartë tjetër.')
        return
      }
      if (digits === '4242424242424242') {
        saveOrder('Paguar')
        clear()
        setProcessing(false)
        navigate('/porosite', { state: { success: true } })
        return
      }
      setProcessing(false)
      setError('Kartë e panjohur. Përdor kartat test të Stripe.')
    }, 1200)
  }

  return (
    <div className="checkout">
      <div className="checkout-form">
        <h1>Pagesa</h1>
        <p className="hint">Kartat test: 4242 4242 4242 4242 (sukses) · 4000 0000 0000 0002 (refuzim)</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={submit}>
          <label>Emri në kartë</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Filan Fisteku" />

          <label>Numri i kartës</label>
          <input value={form.card} onChange={e => update('card', formatCard(e.target.value))} placeholder="4242 4242 4242 4242" />

          <div className="row">
            <div>
              <label>Skadimi</label>
              <input
                value={form.expiry}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                  update('expiry', v)
                }}
                placeholder="12/28"
              />
            </div>
            <div>
              <label>CVC</label>
              <input value={form.cvc} onChange={e => update('cvc', e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" />
            </div>
            <div>
              <label>ZIP</label>
              <input value={form.zip} onChange={e => update('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="10000" />
            </div>
          </div>

          <button className="btn-solid full" disabled={processing}>
            {processing ? 'Duke procesuar...' : `Paguaj €${total.toLocaleString()}`}
          </button>
        </form>
      </div>

      <div className="checkout-summary">
        <h2>Përmbledhja</h2>
        {items.map(i => (
          <div className="sum-row" key={i.id}>
            <span>{i.name} × {i.qty}</span>
            <span>€{(i.price * i.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="sum-total">
          <span>Totali</span>
          <strong>€{total.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  )
}
