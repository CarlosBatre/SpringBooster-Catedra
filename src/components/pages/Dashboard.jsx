import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/api';
import Products from './Products';
import logo from '../../img/logo_umbrella.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [notification, setNotification] = useState({ show: false, message: '' });

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const tokenData = JSON.parse(jsonPayload);
      setUser({
        username: tokenData.sub,
        email: tokenData.email || 'usuario@example.com'
      });
    } catch (error) {
      console.error('Error decodificando el token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }

    const interval = setInterval(() => {
      if (!localStorage.getItem('token')) {
        setUser(null);
        navigate('/login');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate]);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        showNotification(`Otra unidad de ${product.name} añadida al carrito`);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showNotification(`${product.name} fue agregado al carrito`);
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-100">
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 mt-16 rounded-md shadow-lg">
          {notification.message}
        </div>
      )}

      <nav className="bg-green-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between relative">
            {/* Botón menú móvil */}
            <div className="sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>

            {/* Logo y navegación */}
            <div className="flex items-center space-x-6">
              <img className="h-10" src={logo} alt="Logo Umbrella" />
              <div className="hidden sm:flex space-x-4">
                <a href="/dashboard" className="text-white font-medium hover:text-gray-300">Dashboard</a>
                <a href="/create-order" className="text-white font-medium hover:text-gray-300">Realizar Pedidos</a>
                <a href="/mis-pedidos" className="text-white font-medium hover:text-gray-300">Mis Pedidos</a>
              </div>
            </div>

            {/* Usuario y carrito */}
            <div className="flex items-center space-x-4">
              <span className="text-white hidden sm:block">{user?.username}</span>
              <a href="/cart" className="relative text-white hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2-6M7 13l-2 6h12"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </a>
              <div className="relative">
                <button onClick={toggleUserMenu} className="focus:outline-none">
                  <img className="h-8 w-8 rounded-full" src="https://i.pravatar.cc/300" alt="User" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-10">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tu Perfil</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
                    <button
                    onClick={handleLogout}
                    style={logoutButtonStyle}
                  >
                    Cerrar sesión
                  </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
            <a href="/dashboard" className="block text-white hover:text-gray-300">Dashboard</a>
            <a href="/products" className="block text-white hover:text-gray-300">Productos</a>
            <a href="/create-order" className="block text-white hover:text-gray-300">Pedidos</a>
            <a href="/mis-pedidos" className="block text-white hover:text-gray-300">Mis Pedidos</a>
          </div>
        )}
      </nav>

      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <img src="/image.png" alt="Imagen de bienvenida" className="mx-auto max-w-full h-auto mb-6" />
          <Products onAddToCart={handleAddToCart} />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2023 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
const logoutButtonStyle = {
  color: 'red',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  width: '100%',
  textAlign: 'left'
};

export default Dashboard;
