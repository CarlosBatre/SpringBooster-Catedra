import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    address: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await onSubmit(formData);
      if (result && result.token) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error en autenticación:', err);
      setError(err.message || 'Error en la autenticación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f8663]"
        />
      </div>

      {type === 'register' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f8663]"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f8663]"
        />
      </div>

      {type === 'register' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f8663]"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-[#1f8663] text-white font-semibold rounded-lg hover:bg-[#14664c] transition-colors"
      >
        {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </button>

      <p className="text-sm text-center text-gray-600">
        {type === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <a className="text-[#1f8663] hover:underline" href="/register">
              Regístrate
            </a>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <a className="text-[#1f8663] hover:underline" href="/login">
              Inicia sesión
            </a>
          </>
        )}
      </p>
    </form>
  );
};

export default AuthForm;
