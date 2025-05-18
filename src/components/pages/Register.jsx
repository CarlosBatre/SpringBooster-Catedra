import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { registerUser } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      const user = await registerUser(userData);
      // Redirigir al login después de un registro exitoso
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <h1>Crear nueva cuenta</h1>
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default Register;