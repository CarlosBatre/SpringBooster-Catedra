import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, getUserProfile } from '../../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    username: '',
    email: '',
    address: ''
  });
  const [checkoutData, setCheckoutData] = useState({
    nombreCliente: '',
    direccion: '',
    telefono: '',
    metodoPago: 'Tarjeta Visa',
    estado: 'Pedido Realizado'
  });
  const navigate = useNavigate();

  // Actualizar el localStorage cuando el carrito cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getUserProfile();
      setUserData(data);
      setEditableData({
        username: data.username || '',
        email: data.email || '',
        address: data.address || ''
      });
      setCheckoutData(prev => ({
        ...prev,
        nombreCliente: data.username || '',
        direccion: data.address || ''
      }));
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setError('Error al cargar los datos del usuario');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await updateUserProfile(editableData);
      await loadUserData(); // Recargar los datos del usuario
      setIsEditing(false);
      setSuccess('Datos actualizados correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validar que todos los campos requeridos estén presentes
      if (!userData?.username || !userData?.address || !checkoutData.telefono) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      // Crear el pedido con el formato especificado
      const orderData = {
        id: null,
        nombreCliente: userData.username,
        direccion: userData.address,
        email: userData.email || '',
        telefono: checkoutData.telefono,
        metodoPago: checkoutData.metodoPago,
        estado: "PEDIDO EN CAMINO",
        fechaPedido: new Date().toISOString().split('T')[0],
        total: parseFloat(calculateTotal().toFixed(2)),
        detalles: cartItems.map((item, index) => ({
          id: index + 1,
          productoId: parseInt(item.id, 10),
          nombreProducto: item.name,
          imagen: item.imageUrl || null,
          cantidad: parseInt(item.quantity, 10),
          precioUnitario: parseFloat(item.price.toFixed(2))
        })),
        _links: {
          self: {
            href: `http://localhost:8080/pedidos/${null}` // El ID será actualizado después de la creación
          }
        }
      };// Hacer el POST al endpoint
      const response = await axios.post('http://localhost:8080/pedidos', orderData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
        // Actualizar el ID del pedido y el link con la respuesta del servidor
      const newOrderId = response.data.id;
      orderData.id = newOrderId;
      orderData._links.self.href = `http://localhost:8080/pedidos/${newOrderId}`;

      if (response.status === 201 || response.status === 200) {
        // Guardar el pedido en localStorage para referencia
        localStorage.setItem(`order_${newOrderId}`, JSON.stringify(orderData));
        setCartItems([]);
        localStorage.removeItem('cart');
        setSuccess(`¡Pedido #${newOrderId} realizado con éxito!`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Error al procesar el pedido:', err);
      setError('Error al procesar el pedido. Por favor, intente nuevamente.');
      if (err.response?.data) {
        console.error('Detalle del error:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full lg:w-2/3">
            {/* Resumen del usuario */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Datos del usuario</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50"
                    >
                      {isEditing ? 'Cancelar' : 'Editar datos'}
                    </button>
                  </div>

                  {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                      {error}
                    </div>
                  )}

                  {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                        <input
                          type="text"
                          required
                          value={editableData.username}
                          onChange={(e) => setEditableData({...editableData, username: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          required
                          value={editableData.email}
                          onChange={(e) => setEditableData({...editableData, email: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input
                          type="text"
                          required
                          value={editableData.address}
                          onChange={(e) => setEditableData({...editableData, address: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                      >
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Usuario:</span> {userData?.username}</p>
                      <p><span className="font-medium">Email:</span> {userData?.email}</p>
                      <p><span className="font-medium">Dirección:</span> {userData?.address || 'No especificada'}</p>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-medium">Total de productos: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Contenido del carrito */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-8">Tu Carrito</h1>

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
                          </div>                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex items-center space-x-1 bg-red-500 text-red-600 hover:bg-red-800 px-3 py-1 rounded-md transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Eliminar</span>
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
                        disabled={cartItems.length === 0}
                      >
                        {cartItems.length === 0 ? 'Carrito vacío' : 'Proceder al pago'}
                      </button>
                    ) : (
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{8}"
                            placeholder="Ejemplo: 77445566"
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

                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <h4 className="font-medium mb-2">Resumen del pedido</h4>
                          <p><strong>Cliente:</strong> {userData?.username}</p>
                          <p><strong>Dirección de entrega:</strong> {userData?.address}</p>
                          <p><strong>Email:</strong> {userData?.email}</p>
                          <p><strong>Total a pagar:</strong> ${calculateTotal().toFixed(2)}</p>
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
