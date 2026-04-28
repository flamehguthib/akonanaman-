import { useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

export default function App() {
  const [page, setPage] = useState('login')
  const [loggedInUser, setLoggedInUser] = useState(null)

  const handleLogin = (userData) => {
    setLoggedInUser(userData)
    setPage('dashboard')
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    setPage('login')
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onRegister={() => setPage('register')} />
  }
  if (page === 'register') {
    return <RegisterPage onBack={() => setPage('login')} onSuccess={() => setPage('login')} />
  }
  if (page === 'dashboard') {
    return <DashboardPage user={loggedInUser} onLogout={handleLogout} />
  }
}
