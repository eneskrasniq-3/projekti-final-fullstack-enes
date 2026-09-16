import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem('users')) || []
  } catch {
    return []
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [user])

  const register = (name, email, password) => {
    const users = loadUsers()
    if (users.some(u => u.email === email)) {
      return { ok: false, error: 'Ky email është i regjistruar tashmë.' }
    }
    const isAdmin = email === 'admin@moto.com'
    const newUser = { id: Date.now().toString(), name, email, password, role: isAdmin ? 'admin' : 'user' }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    const safe = { id: newUser.id, name, email, role: newUser.role }
    setUser(safe)
    return { ok: true }
  }

  const login = (email, password) => {
    const users = loadUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) {
      return { ok: false, error: 'Email ose fjalëkalim i pasaktë.' }
    }
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role })
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
