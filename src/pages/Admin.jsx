import { useState } from 'react'
import { useProducts } from '../context/ProductsContext.jsx'
import { categories } from '../data/products'

const empty = { name: '', category: 'Naked', price: '', year: '', image: '', description: '' }

export default function Admin() {
  const { products, addProduct, updateProduct, removeProduct } = useProducts()
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const submit = (e) => {
    e.preventDefault()
    const data = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      year: Number(form.year),
      image: form.image || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      description: form.description
    }
    if (editingId) {
      updateProduct(editingId, data)
    } else {
      addProduct(data)
    }
    setForm(empty)
    setEditingId(null)
  }

  const edit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      year: p.year,
      image: p.image,
      description: p.description
    })
    setEditingId(p.id)
  }

  const cancel = () => {
    setForm(empty)
    setEditingId(null)
  }

  return (
    <div className="admin">
      <h1>Paneli i adminit</h1>

      <div className="admin-grid">
        <form className="admin-form" onSubmit={submit}>
          <h2>{editingId ? 'Ndrysho motorrin' : 'Shto motorr të ri'}</h2>
          <label>Emri</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} required />

          <label>Kategoria</label>
          <select value={form.category} onChange={e => update('category', e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="row">
            <div>
              <label>Çmimi (€)</label>
              <input type="number" value={form.price} onChange={e => update('price', e.target.value)} required />
            </div>
            <div>
              <label>Viti</label>
              <input type="number" value={form.year} onChange={e => update('year', e.target.value)} required />
            </div>
          </div>

          <label>URL e fotos</label>
          <input value={form.image} onChange={e => update('image', e.target.value)} placeholder="https://..." />

          <label>Përshkrimi</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows="3" />

          <div className="admin-actions">
            <button className="btn-solid">{editingId ? 'Ruaj ndryshimet' : 'Shto motorrin'}</button>
            {editingId && <button type="button" className="btn-outline" onClick={cancel}>Anulo</button>}
          </div>
        </form>

        <div className="admin-list">
          <h2>Motorrat ({products.length})</h2>
          {products.map(p => (
            <div className="admin-row" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="admin-row-info">
                <strong>{p.name}</strong>
                <span>{p.category} · €{p.price.toLocaleString()}</span>
              </div>
              <div className="admin-row-actions">
                <button className="btn-ghost" onClick={() => edit(p)}>Ndrysho</button>
                <button className="btn-ghost danger" onClick={() => removeProduct(p.id)}>Fshij</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
