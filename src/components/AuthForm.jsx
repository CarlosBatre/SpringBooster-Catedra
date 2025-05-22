import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };    const handleSubmit = async (e) => {
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
        <div className="bg-white relative items-center w-75 px-5 py-12 mx-auto my-40 md:px-5 lg:px-8 max-w-7xl border-2 border-gray-200 rounded-lg shadow-md">
            <h2>{type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="col-span-full">
                    <label className="block mb-3 text-sm font-medium text-gray-600">Nombre de usuario:</label>
                    <input
                        className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                {type === 'register' && (
                    <div className="col-span-full">
                        <label className="block mb-3 text-sm font-medium text-gray-600">Email:</label>
                        <input
                            className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div  className="col-span-full">
                    <label className="block mb-3 text-sm font-medium text-gray-600">Contraseña:</label>
                    <input
                        className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {type === 'register' && (
                    <div className="col-span-full">
                        <label className="block mb-3 text-sm font-medium text-gray-600">Dirección:</label>
                        <input
                            className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <button type="submit" className="items-center justify-center w-full m-1 px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:text-black hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black">
                    {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
            </form>
            {type === 'login' ? (
                <p>¿No tienes cuenta? <a className='text-blue-500' href="/register">Regístrate</a></p>
            ) : (
                <p>¿Ya tienes cuenta? <a className='text-blue-500' href="/login">Inicia sesión</a></p>
            )}
        </div>
    );
};

export default AuthForm;