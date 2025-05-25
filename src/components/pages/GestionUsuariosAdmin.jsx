import React, { useState, useEffect } from 'react';
import AgregarUsuarioModal from '../AgregarUsuarioModal';

const GestionUsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

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
  const confirmado = window.confirm('¿Estás seguro que deseas eliminar este usuario?');
  if (!confirmado) return; // Si cancela, no hace nada

  try {
    const token = localStorage.getItem('token'); // o donde tengas guardado el JWT

    const res = await fetch(`http://localhost:8080/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
      } else {
        throw new Error('Error al eliminar usuario');
      }
    }

    setUsuarios(usuarios.filter((u) => u.id !== id));
  } catch (err) {
    alert(err.message);
  }
};

  const handleUsuarioAgregado = (user) => {
    setUsuarios([...usuarios, user]);
  };

  // Filtrar usuarios según búsqueda (por username o email, ignorando mayúsculas/minúsculas)
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.username.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  return (
    <div>
      <header style={styles.header}>
        <h2 style={styles.headerText}>Admin Dashboard</h2>
        <button style={styles.botonAgregarHeader} onClick={() => setModalAbierto(true)}>
          Agregar Usuario
        </button>
      </header>

      <main style={styles.container}>
        <h1 style={styles.titulo}>Gestión de Usuarios</h1>

        <input
          type="text"
          placeholder="Buscar por nombre de usuario o correo"
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
          style={styles.inputBusqueda}
        />

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={styles.grid}>
            <div style={styles.rolContainer}>
              <h3 style={styles.rolTitulo}>Usuarios con rol USER</h3>
              {usuariosFiltrados.filter((u) => u.role === 'USER').map((user) => (
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
              {usuariosFiltrados.filter((u) => u.role === 'EMPLEADO').map((user) => (
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

      {modalAbierto && (
        <AgregarUsuarioModal
          onClose={() => setModalAbierto(false)}
          onUsuarioAgregado={handleUsuarioAgregado}
        />
      )}
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#1f8663',
    padding: '1rem',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
  },
  headerText: {
    margin: 0,
  },
  botonAgregarHeader: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'white',
    color: '#1f8663',
    border: '1px solid white',
    padding: '0.4rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '10%',
  },
  container: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    color: '#1f8663',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  inputBusqueda: {
    padding: '0.7rem',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '1.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
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
    padding: '0.3rem 0.6rem',
    fontSize: '0.85rem',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '15%',
  },
};

export default GestionUsuariosAdmin;
