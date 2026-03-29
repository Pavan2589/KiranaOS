import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'
import CustomerDashboard from './pages/CustomerDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import RiderDashboard from './pages/RiderDashboard'

function Protected({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) return <Navigate to={`/auth/${role}`} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/:role" element={<AuthPage />} />
          <Route path="/customer" element={<Protected role="customer"><CustomerDashboard /></Protected>} />
          <Route path="/owner" element={<Protected role="owner"><OwnerDashboard /></Protected>} />
          <Route path="/rider" element={<Protected role="rider"><RiderDashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  )
}
