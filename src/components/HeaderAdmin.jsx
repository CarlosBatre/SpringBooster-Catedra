// HeaderAdmin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderAdmin = () => {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h2>Admin Dashboard</h2>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin/dashboard/crear-producto')} style={styles.button}>
            Agregar Producto
          </button>
          <button onClick={() => navigate('/admin/dashboard/gestion-usuarios')} style={styles.button}>
            Gestión de Usuarios
          </button>
          <button onClick={() => navigate('/admin/dashboard/gestion-pedidos')} style={styles.button}>
            Gestionar Pedidos
          </button>
        </nav>
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
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    backgroundColor: '#fff',
    color: '#1f8663',
    padding: '0.1rem 0.8rem',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
};

export default HeaderAdmin;
