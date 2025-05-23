import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    nombreCliente: '',
    direccion: '',
    telefono: '',
    metodoPago: 'Tarjeta Visa',
    estado: 'Pedido Realizado'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del usuario desde el token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const tokenData = JSON.parse(jsonPayload);
        setUserData({
          email: tokenData.email,
          username: tokenData.sub
        });

        // Pre-llenar los datos del checkout con la información del usuario
        setCheckoutData(prev => ({
          ...prev,
          nombreCliente: tokenData.sub || '',
          email: tokenData.email || ''
        }));
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    }
  }, []);

  // Aquí simulamos los items del carrito en el estado local
  // Ya que no hay un endpoint específico para el carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        ...checkoutData,
        fechaPedido: new Date().toISOString().split('T')[0],
        total: calculateTotal(),
        detalles: cartItems.map(item => ({
          productoId: item.id,
          nombreProducto: item.name,
          cantidad: item.quantity
        }))
      };

      await axios.post('http://localhost:8080/pedidos', orderData);
      
      // Limpiar el carrito
      setCartItems([]);
      // Mostrar mensaje de éxito y redirigir
      alert('¡Pedido realizado con éxito!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al procesar el pedido:', err);
      setError('Error al procesar el pedido. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 rounded-lg shadow-md">
                Procesando...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full lg:w-2/3">
            {/* Resumen del usuario */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Resumen de tu carrito</h2>
                  {userData && (
                    <div className="space-y-1 text-gray-600">
                      <p><span className="font-medium">Usuario:</span> {userData.username}</p>
                      <p><span className="font-medium">Email:</span> {userData.email}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">Total de productos: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Contenido del carrito */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-8">Tu Carrito</h1>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  {error}
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <a href="/products" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    Ver productos
                  </a>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-500">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center border rounded"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center border rounded"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t pt-8">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
                    </div>

                    {!isCheckingOut ? (
                      <button
                        onClick={() => setIsCheckingOut(true)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Proceder al pago
                      </button>
                    ) : (
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                          <input
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={checkoutData.nombreCliente}
                            onChange={(e) => setCheckoutData({...checkoutData, nombreCliente: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dirección de envío</label>
                          <input
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={checkoutData.direccion}
                            onChange={(e) => setCheckoutData({...checkoutData, direccion: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                          <input
                            type="tel"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={checkoutData.telefono}
                            onChange={(e) => setCheckoutData({...checkoutData, telefono: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Método de pago</label>
                          <select
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={checkoutData.metodoPago}
                            onChange={(e) => setCheckoutData({...checkoutData, metodoPago: e.target.value})}
                          >
                            <option value="Tarjeta Visa">Tarjeta Visa</option>
                            <option value="Tarjeta Mastercard">Tarjeta Mastercard</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Efectivo">Efectivo</option>
                          </select>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={loading}
                          >
                            {loading ? 'Procesando...' : 'Confirmar pedido'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCheckingOut(false)}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            disabled={loading}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
