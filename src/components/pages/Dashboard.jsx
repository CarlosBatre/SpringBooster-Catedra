import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/api';
import Products from './Products';

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

  {/* Función para cerrar sesión y redirigir al login */ }
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // En caso de error, intentar limpiar el estado local de todos modos
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  {/* Función para alternar el menú móvil */ }
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  {/* Función para alternar el menú de usuario */ }
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };  {/* Efecto para verificar autenticación y cargar datos del usuario */ }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Decodificar el token JWT para obtener la información del usuario
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const tokenData = JSON.parse(jsonPayload);
      setUser({
        username: tokenData.sub, // 'sub' es el campo estándar para el username en JWT
        email: tokenData.email || 'usuario@example.com' // Fallback si no hay email en el token
      });
    } catch (error) {
      console.error('Error decodificando el token:', error);
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    // Verificar expiración del token cada 10 segundos
    const checkTokenInterval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setUser(null);
        navigate('/login');
      }
    }, 10000);

    return () => {
      clearInterval(checkTokenInterval);
    };
  }, [navigate]);

  // Función para mostrar notificación
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000); // La notificación desaparecerá después de 3 segundos
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        showNotification(`Se agregó otra unidad de ${product.name} al carrito`);
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showNotification(`${product.name} fue agregado al carrito`);
      return [...prevCart, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        imageUrl: product.imageUrl || null
      }];
    });
  };

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notificación */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 mt-[4rem] rounded-md shadow-lg transition-opacity duration-300">
          {notification.message}
        </div>
      )}
      {/* Barra de navegación principal */}
      <nav className="bg-green-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Botón del menú móvil */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>

                {!isMobileMenuOpen ? (
                  <svg className="block size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg className="block size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo y enlaces de navegación */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
              </div>
              <div className="hidden sm:ml-6 sm:block">                <div className="flex space-x-4">
                  <a href="/dashboard" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
                  <a href="/products" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Productos</a>
                  <a href="/create-order" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Pedidos</a>
                </div>
              </div>
            </div>

            {/* Sección de usuario y menú desplegable */}            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Nombre del usuario */}
              <p className='text-white text-sm sm:text-base font-medium mr-4 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {user?.username}
              </p>

              {/* Carrito de compras */}
              <div className="relative">
                <a href="/cart" className="text-white hover:text-gray-300 transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
                    />
                  </svg>
                  {/* Contador de items en el carrito */}
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </a>
              </div>

              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                    id="user-menu-button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleUserMenu}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </button>
                </div>

                {/* Menú desplegable del usuario */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1">Tu Perfil</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1">Configuración</a>
                    <a href="#" className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" onClick={handleLogout}>Cerrar sesión</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">            <div className="space-y-1 px-2 pt-2 pb-3">
              <a href="/dashboard" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
              <a href="/products" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Productos</a>
              <a href="/create-order" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Pedidos</a>
            </div>
          </div>
        )}
      </nav>

      {/* Contenido principal */}
      <main>
        <img src="/image.png" alt="Imagen de bienvenida" className="mx-auto max-w-full h-auto" />
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Products onAddToCart={handleAddToCart} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Tu Empresa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;