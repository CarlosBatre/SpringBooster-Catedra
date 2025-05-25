import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombreCliente: '',
    direccion: '',
    email: '',
    telefono: '',
    metodoPago: 'Tarjeta Crédito',
    productos: []
  });
  // Efecto para cargar los productos del carrito
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCartItems(cartData);
      
      if (cartData.length === 0) {
        setError('El carrito está vacío');
        return;
      }

      // Convertir el carrito al formato requerido por la API
      const productos = cartData.map(item => ({
        productoId: Number(item.id), // Aseguramos que sea número
        cantidad: Number(item.quantity) // Aseguramos que sea número
      }));
      
      // Actualizar el formData con los productos del carrito
      setFormData(prev => ({
        ...prev,
        productos: productos
      }));
    } else {
      setError('No hay productos en el carrito');
    }
  }, []);

  // Función para manejar cambios en los campos principales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/pedidos', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess('¡Pedido creado con éxito!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Pedido</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
              <input
                type="text"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Efectivo">Efectivo</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
          </div>

          {/* Lista de productos seleccionados */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Productos Seleccionados</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-4">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${item.price} c/u</p>
                    <p className="text-sm font-bold text-blue-600">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Total del Pedido:</span>
                  <span className="font-bold text-blue-600">
                    ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Enviando...' : 'Crear Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
