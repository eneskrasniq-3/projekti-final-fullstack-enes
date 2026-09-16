import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (password.length < 4) {
      setError('Fjalëkalimi duhet të ketë të paktën 4 karaktere.')
      return
    }
    const res = register(name, email, password)
    if (res.ok) {
      navigate('/')
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="auth">
      <h1>Regjistrohu</h1>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={submit}>
        <label>Emri</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Fjalëkalimi</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn-solid full">Krijo llogari</button>
      </form>
      <p className="switch">Ke llogari? <Link to="/login">Hyr</Link></p>
    </div>
  )
}
