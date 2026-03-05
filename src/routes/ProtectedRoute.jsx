import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getIsAuthenticated } from '../services/auth'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()

  if (!getIsAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute

