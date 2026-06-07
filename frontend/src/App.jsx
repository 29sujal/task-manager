import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const Private = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

const Public = ({ children }) => {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login"    element={<Public><Login /></Public>} />
      <Route path="/register" element={<Public><Register /></Public>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#181825',
              color: '#cdd6f4',
              border: '1px solid #313244',
              borderRadius: '12px',
              fontFamily: 'Syne, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#a6e3a1', secondary: '#181825' } },
            error:   { iconTheme: { primary: '#f38ba8', secondary: '#181825' } },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}
