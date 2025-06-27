import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function CheckAuth({ children, isAuthenticated, requireAuth = false }) {
  const location = useLocation();

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  

  // If route requires being unauthenticated (like login/register) but user is authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children
  return children;
}

export default CheckAuth;