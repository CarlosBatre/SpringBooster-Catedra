import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if we have a token in localStorage
  const token = localStorage.getItem('token');
  const isAuthenticated = token !== null;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Return the protected route component
  return children;
};

export default PrivateRoute;