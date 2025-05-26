import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { loginUser } from '../../services/api';
import img from '../../img/logo_umbrella.png';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setError('');
      const response = await loginUser(credentials);

      if (response && response.token) {
        localStorage.setItem('token', response.token);

        const base64Url = response.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );

        const userData = JSON.parse(jsonPayload);
        localStorage.setItem('user', JSON.stringify({
          email: userData.email,
          role: userData.role
        }));

switch (userData.role) {
  case 'ADMIN':
  case 'EMPLEADO':
    navigate('/admin/dashboard');
    break;
  case 'DELIVERY':
    navigate('/admin/dashboard/gestion-pedidos'); // ✅ Redirección específica para DELIVERY
    break;
  case 'USER':
  default:
    navigate('/dashboard');
    break;
}

      } else {
        setError('Error: Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setError(error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex flex-col items-center justify-center px-4">
      <img src={img} alt="Logo Umbrella" className="w-64 mb-6 " />
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-[#cce3d2] ">
        <h1 className="text-2xl font-bold text-center text-[#1f8663] mb-6">Bienvenido</h1>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
