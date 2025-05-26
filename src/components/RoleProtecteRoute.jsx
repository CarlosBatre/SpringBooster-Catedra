import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userData = JSON.parse(localStorage.getItem('user'));
  const userRole = userData?.role;

  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'EMPLEADO' || userRole === 'DELIVERY') {
      alert('Acceso denegado: no tienes permisos para acceder a esta sección.');
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleProtectedRoute;
