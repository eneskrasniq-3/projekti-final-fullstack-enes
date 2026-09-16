import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = login(email, password)
    if (res.ok) {
      navigate('/')
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="auth">
      <h1>Hyr në llogari</h1>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Fjalëkalimi</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn-solid full">Hyr</button>
      </form>
      <p className="switch">Nuk ke llogari? <Link to="/regjistrohu">Regjistrohu</Link></p>
    </div>
  )
}
