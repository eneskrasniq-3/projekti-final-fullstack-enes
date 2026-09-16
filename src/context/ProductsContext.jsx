import { createContext, useContext, useEffect, useState } from 'react'
import { seedProducts } from '../data/products'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('products'))
      if (Array.isArray(stored) && stored.length) return stored
    } catch {}
    return seedProducts
  })

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  const addProduct = (data) => {
    setProducts(prev => [...prev, { ...data, id: 'p' + Date.now() }])
  }

  const updateProduct = (id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
