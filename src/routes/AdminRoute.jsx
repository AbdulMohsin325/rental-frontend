import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getIsAuthenticated, getIsAdmin } from '../services/auth'
import { useUser } from '../context/UserContext'

const AdminRoute = ({ children }) => {
  const location = useLocation()
  const { userDetails, isUserLoading } = useUser()

  const isAuthenticated = getIsAuthenticated()
  const authIsAdmin = getIsAdmin()
  const ctxIsAdmin = userDetails?.isAdmin || userDetails?.role === 'admin'
  const effectiveIsAdmin = authIsAdmin || ctxIsAdmin

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading admin session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (!effectiveIsAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute

