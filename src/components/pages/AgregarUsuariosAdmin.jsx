import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- IMPORTANTE para navegación

const GestionUsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/users');
        if (!res.ok) throw new Error('Error al cargar usuarios');
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleEliminarUsuario = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar usuario');
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h2 style={styles.headerText}>Admin Dashboard</h2>
        <nav style={styles.nav}>
          <button
            style={styles.botonAgregarHeader}
            onClick={() => navigate('/agregar-usuario')}
          >
            Agregar Nuevo Usuario
          </button>
        </nav>
      </header>

      <main style={styles.container}>
        <h1 style={styles.titulo}>Gestión de Usuarios</h1>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={styles.grid}>
            <div style={styles.rolContainer}>
              <h3 style={styles.rolTitulo}>Usuarios con rol USER</h3>
              {usuarios.filter((u) => u.role === 'USER').map((user) => (
                <div key={user.id} style={styles.usuarioCard}>
                  <div>
                    <strong>{user.username}</strong>
                    <p>{user.email}</p>
                  </div>
                  <button
                    style={styles.botonEliminar}
                    onClick={() => handleEliminarUsuario(user.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.rolContainer}>
              <h3 style={styles.rolTitulo}>Usuarios con rol EMPLEADO</h3>
              {usuarios.filter((u) => u.role === 'EMPLEADO').map((user) => (
                <div key={user.id} style={styles.usuarioCard}>
                  <div>
                    <strong>{user.username}</strong>
                    <p>{user.email}</p>
                  </div>
                  <button
                    style={styles.botonEliminar}
                    onClick={() => handleEliminarUsuario(user.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#1f8663',
    padding: '1rem',
    textAlign: 'center',
    position: 'relative',
  },
  headerText: {
    color: 'white',
    margin: 0,
  },
  nav: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  botonAgregarHeader: {
    backgroundColor: '#1f8663',
    color: 'white',
    border: '2px solid white',
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  container: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    color: '#1f8663',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: '3rem',
  },
  rolContainer: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    width: '45%',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  rolTitulo: {
    borderBottom: '2px solid #1f8663',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
    color: '#2c5f4a',
  },
  usuarioCard: {
    backgroundColor: '#eefaf6',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#e63946',
    color: 'white',
    border: 'none',
    margin: '30px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '30%',
  },
};

export default GestionUsuariosAdmin;
