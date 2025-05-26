import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { registerUser } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      await registerUser(userData);
      navigate('/login'); // Redirige después del registro exitoso
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#eafaf2] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#1f8663]">
          Crear Nueva Cuenta
        </h1>
        <AuthForm type="register" onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default Register;
