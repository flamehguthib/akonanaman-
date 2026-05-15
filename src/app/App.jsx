import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import { auth, db } from '../lib/firebase.js'

export default function App() {
  const [page, setPage] = useState('login')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const pageRef = useRef(page)

  useEffect(() => {
    pageRef.current = page
  }, [page])

  useEffect(() => {
    let active = true

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return

      setAuthReady(true)

      if (!currentUser) {
        setLoggedInUser(null)
        return
      }

      setLoggedInUser({
        uid: currentUser.uid,
        email: currentUser.email ?? '',
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        type: 'jobseeker',
      })

      if (pageRef.current !== 'register') {
        setPage('dashboard')
      }

      getDoc(doc(db, 'users', currentUser.uid))
        .then((profileSnap) => {
          if (!active) return

          const profileData = profileSnap.exists() ? profileSnap.data() : {}
          setLoggedInUser(prev => ({
            ...prev,
            email: currentUser.email ?? profileData.email ?? '',
            name: profileData.fullName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            type: profileData.accountType || profileData.type || prev?.type || 'jobseeker',
            ...profileData,
          }))
        })
        .catch(() => {})
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setLoggedInUser(null)
    setPage('login')
  }

  const handleRegisterSuccess = async () => {
    await signOut(auth)
    setLoggedInUser(null)
    setPage('login')
  }

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] text-gray-500">
        Loading PARTimed...
      </div>
    )
  }

  if (page === 'login') {
    return <LoginPage onRegister={() => setPage('register')} />
  }
  if (page === 'register') {
    return <RegisterPage onBack={() => setPage('login')} onSuccess={handleRegisterSuccess} />
  }
  if (page === 'dashboard') {
    return <DashboardPage user={loggedInUser} onLogout={handleLogout} />
  }
}
