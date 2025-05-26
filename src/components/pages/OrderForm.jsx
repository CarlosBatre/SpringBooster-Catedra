import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../../img/logo_umbrella.png';

const OrderForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const [formData, setFormData] = useState({
    nombreCliente: '',
    direccion: '',
    email: '',
    telefono: '',
    metodoPago: 'Tarjeta Crédito',
    productos: []
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCartItems(cartData);

      if (cartData.length === 0) {
        setError('El carrito está vacío');
        return;
      }

      const productos = cartData.map(item => ({
        productoId: Number(item.id),
        cantidad: Number(item.quantity)
      }));

      setFormData(prev => ({
        ...prev,
        productos: productos
      }));
    } else {
      setError('No hay productos en el carrito');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        localStorage.removeItem('cart'); // Limpia el carrito
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
    <div className="min-h-screen bg-green-50 pb-12">
      {/* Header farmacéutico */}
      <header className="bg-green-700 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
<img
  src={img}
  alt="Farmacia Natural Logo"
  className="h-10 w-auto mr-3"
/>


          <span className="text-xl font-bold">Farmacia Natural</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">Realizar Pedido</h1>

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
            <InputField
              label="Nombre del Cliente"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Efectivo">Efectivo</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
          </div>

          {/* Productos seleccionados */}
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Productos Seleccionados</h3>
            <div className="bg-green-50 rounded-lg p-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/50"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-700">${item.price} c/u</p>
                    <p className="text-sm font-bold text-green-800">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-semibold text-green-800">
                <span>Total del Pedido:</span>
                <span>
                  ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow disabled:bg-green-300"
            >
              {loading ? 'Enviando...' : 'Crear Pedido'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
    />
  </div>
);

export default OrderForm;
