// src/pages/CrearProducto.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearProducto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    descripcion: '',
    ingredientes: '',
    beneficios: '',
    presentacion: '',
    existencias: 0,
    precio: 0.0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['existencias', 'precio'].includes(name) ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear producto');

      alert('Producto creado exitosamente');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error al crear:', error);
      alert('Error al crear producto');
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Admin Dashboard</h2>
      </header>

      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Crear Nuevo Producto</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {[
              'nombre', 'imagen', 'descripcion', 'ingredientes',
              'beneficios', 'presentacion'
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                required
                style={styles.input}
              />
            ))}
            <input
              name="existencias"
              type="number"
              placeholder="Existencias"
              value={formData.existencias}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="precio"
              type="number"
              placeholder="Precio"
              value={formData.precio}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Crear Producto</button>
             <button type="button" style={styles.cancelButton} onClick={() => navigate('/admin/dashboard')}>
              Cancelar
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#1f8663',
    padding: '1rem',
    color: '#ffffff',
    textAlign: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
  },
  container: {
    backgroundColor: '#e6f4f0',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    marginTop: '2rem',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#1f8663',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
    buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    color: '#1f8663',
    border: '2px solid #1f8663',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },

  button: {
    backgroundColor: '#1f8663',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default CrearProducto;
