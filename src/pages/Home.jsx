import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { categories } from '../data/products'

export default function Home() {
  const { products } = useProducts()
  const { add } = useCart()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('')

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category ? p.category === category : true
      const matchPrice = maxPrice ? p.price <= Number(maxPrice) : true
      return matchSearch && matchCat && matchPrice
    })
    if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [products, search, category, maxPrice, sort])

  return (
    <div>
      <section className="hero">
        <h1>Gjej motorrin tënd të radhës</h1>
        <p>Përzgjedhje motorrash të reja dhe të përdorura, gati për rrugë.</p>
      </section>

      <div className="filters">
        <input
          type="text"
          placeholder="Kërko motorr..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Të gjitha kategoritë</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          placeholder="Çmimi maksimal (€)"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Rendit sipas</option>
          <option value="asc">Çmimi: nga i ulëti</option>
          <option value="desc">Çmimi: nga i larti</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">Nuk u gjet asnjë motorr me këto kritere.</p>
      ) : (
        <div className="grid">
          {filtered.map(p => (
            <div className="card" key={p.id}>
              <Link to={`/produkt/${p.id}`} className="card-img">
                <img src={p.image} alt={p.name} />
              </Link>
              <div className="card-body">
                <span className="tag">{p.category}</span>
                <h3><Link to={`/produkt/${p.id}`}>{p.name}</Link></h3>
                <p className="year">Viti {p.year}</p>
                <div className="card-footer">
                  <span className="price">€{p.price.toLocaleString()}</span>
                  <button className="btn-solid" onClick={() => add(p)}>Shto në shportë</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
