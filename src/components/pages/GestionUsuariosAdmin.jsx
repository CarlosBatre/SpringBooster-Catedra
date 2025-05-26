import React, { useState, useEffect } from 'react';
import AgregarUsuarioModal from '../AgregarUsuarioModal';
import img from '../../img/logo_umbrella.png';
import { useNavigate } from 'react-router-dom';

const GestionUsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
 const navigate = useNavigate(); 
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
  <div style={styles.headerContent}>
    <img
      src={img}
      alt="Logo"
      style={styles.logo}
      onClick={() => navigate('/admin/dashboard')}
    />
    <h2 style={styles.headerText}>Admin Dashboard</h2>
    <button style={styles.botonAgregarHeader} onClick={() => setModalAbierto(true)}>
      Agregar Usuario
    </button>
  </div>
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
    padding: '1rem 2rem',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: '40px',
    cursor: 'pointer',
  },
  headerText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    margin: 0,
  },
  botonAgregarHeader: {
    backgroundColor: '#ffffff',
    color: '#1f8663',
    border: '2px solid #ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
     width: '30%',
  },
  container: {
    padding: '2rem',
    backgroundColor: '#e6f4f0',
    minHeight: '100vh',
  },
  titulo: {
    color: '#1f8663',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '2rem',
  },
  inputBusqueda: {
    padding: '0.7rem',
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto 2rem auto',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    display: 'block',
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
    padding: '1.5rem',
    borderRadius: '12px',
    width: '45%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  rolTitulo: {
    borderBottom: '2px solid #1f8663',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
    color: '#1f8663',
    fontSize: '1.25rem',
  },
  usuarioCard: {
    backgroundColor: '#d8f3e8',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #b2dfc7',
  },
  botonEliminar: {
    backgroundColor: '#e63946',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '30%',
  },
};


export default GestionUsuariosAdmin;
