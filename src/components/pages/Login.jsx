import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { loginUser } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setError('');
      const response = await loginUser(credentials);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        // Decodificar el token para obtener la información del usuario
        try {
          const base64Url = response.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const userData = JSON.parse(jsonPayload);
          localStorage.setItem('user', JSON.stringify({
            email: userData.email
          }));
        } catch (error) {
          console.error('Error decodificando el token:', error);
        }
        navigate('/dashboard');
      } else {
        setError('Error: Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      {error && <div className="error-message">{error}</div>}
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;