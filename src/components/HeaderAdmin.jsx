// src/components/HeaderAdmin.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';
import img from '../img/logo_umbrella.png';

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const tokenData = JSON.parse(jsonPayload);
      setUserEmail(tokenData.email || 'usuario@example.com');
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* LOGO A LA IZQUIERDA */}
        <div style={styles.left}>
          <img
            src={img}
            alt="Logo"
            onClick={() => navigate('/admin/dashboard')}
            style={styles.logo}
            title="Ir al Dashboard"
          />
          <h2 style={styles.title}>Panel de Administración</h2>
        </div>

        <div style={styles.right}>
          <span style={styles.email}>Hola, {userEmail}</span>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ ...styles.hamburger, ...(menuOpen ? styles.hamburgerActive : {}) }}
          >
            <div style={styles.bar}></div>
            <div style={styles.bar}></div>
            <div style={styles.bar}></div>
          </button>

          <div
            style={{
              ...styles.dropdown,
              maxHeight: menuOpen ? '400px' : '0',
              opacity: menuOpen ? 1 : 0,
              padding: menuOpen ? '0.5rem 0' : '0',
            }}
          >
            <button onClick={() => navigate('/admin/dashboard/crear-producto')} style={styles.menuItem}>
              Agregar Producto
            </button>
            <button onClick={() => navigate('/admin/dashboard/gestion-usuarios')} style={styles.menuItem}>
              Gestión de Usuarios
            </button>
            <button onClick={() => navigate('/admin/dashboard/gestion-pedidos')} style={styles.menuItem}>
              Gestionar Pedidos
            </button>
            <button onClick={handleLogout} style={{ ...styles.menuItem, backgroundColor: '#e74c3c', color: '#fff' }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#1f8663',
    padding: '1rem',
    color: '#fff',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    width: '70px',
    height: '70px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
  },
  email: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  hamburger: {
    width: '30px',
    height: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
  },
  hamburgerActive: {
    transform: 'rotate(90deg)',
  },
  bar: {
    width: '100%',
    height: '4px',
    backgroundColor: '#fff',
    borderRadius: '2px',
  },
  dropdown: {
    position: 'absolute',
    top: '3.5rem',
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    zIndex: 999,
  },
  menuItem: {
    padding: '1rem 1.5rem',
    backgroundColor: '#fff',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1.1rem',
    color: '#1f8663',
    borderBottom: '1px solid #ddd',
  },
};

export default HeaderAdmin;
