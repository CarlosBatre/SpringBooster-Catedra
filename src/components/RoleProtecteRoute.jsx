import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Obtener rol del token (ya decodificado en login) o decodificarlo aquí
  const userData = JSON.parse(localStorage.getItem('user'));
  const userRole = userData?.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />; // o una página de acceso denegado
  }

  return children;
};

export default RoleProtectedRoute;
