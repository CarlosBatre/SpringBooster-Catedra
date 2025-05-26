import React, { useState } from 'react';

const AgregarUsuarioModal = ({ onClose, onUsuarioAgregado }) => {
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: '',
    password: '',
    email: '',
    address: '',
    role: 'USER',
  });

  const handleAgregarUsuario = async () => {
    try {
      const token = localStorage.getItem('token');  // Obtener el JWT

      const res = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Enviar token en header
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!res.ok) throw new Error('Error al agregar usuario');
      const user = await res.json();
      onUsuarioAgregado(user);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3 style={modalStyles.titulo}>Agregar Nuevo Usuario</h3>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nuevoUsuario.username}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
          style={modalStyles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
          style={modalStyles.input}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={nuevoUsuario.email}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
          style={modalStyles.input}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={nuevoUsuario.address}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, address: e.target.value })}
          style={modalStyles.input}
          required
        />
        <select
          value={nuevoUsuario.role}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
          style={modalStyles.input}
        >
          <option value="USER">USER</option>
          <option value="EMPLEADO">EMPLEADO</option>
          <option value="DELIVERY">DELIVERY</option>
        </select>

        <div style={modalStyles.botones}>
          <button style={modalStyles.botonAgregar} onClick={handleAgregarUsuario}>
            Agregar Usuario
          </button>
          <button style={modalStyles.botonCerrar} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  titulo: {
    margin: 0,
    color: '#2c5f4a',
    textAlign: 'center',
  },
  input: {
    padding: '0.7rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  botones: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  botonAgregar: {
    backgroundColor: '#1f8663',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    marginRight: '0.5rem',
  },
  botonCerrar: {
    backgroundColor: '#e63946',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default AgregarUsuarioModal;
