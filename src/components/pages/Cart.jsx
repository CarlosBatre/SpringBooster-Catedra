import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../../img/logo_umbrella.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header con logo */}
      <header className="bg-green-700 text-white py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src={img} alt="Farmacia Natural Logo" className="h-10 w-auto mr-3" />
          <span className="text-xl font-bold">Farmacia Natural</span>
        </div>
      </header>

      {/* Contenido del carrito */}
      <div className="container mx-auto px-4 pt-12">
        <div className="w-full lg:w-2/3 mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Carrito de Compras</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tu carrito está vacío</p>
              <br/>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition"
      >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 text-gray-700 rounded hover:bg-green-100"
                        >-</button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 text-gray-700 rounded hover:bg-green-100"
                        >+</button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-6 text-lg text-green-700 font-semibold">
                  <span>Total del Pedido:</span>
                  <span className="text-2xl font-bold text-green-800">${calculateTotal().toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate('/create-order')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition"
                >
                  Proceder al Pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
