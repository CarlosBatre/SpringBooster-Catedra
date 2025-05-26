// src/pages/CrearProducto.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../../img/logo_umbrella.png';

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
  <div style={styles.headerContent}>
    <img
      src={img}
      alt="Logo"
      style={styles.logo}
      onClick={() => navigate('/admin/dashboard')}
    />
    <h2 style={styles.headerTitle}>Admin Dashboard</h2>
  </div>
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
    padding: '1rem 2rem',
    color: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    height: '40px',
    cursor: 'pointer',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '540px',
  },
  title: {
    marginBottom: '2rem',
    color: '#1f8663',
    textAlign: 'center',
    fontSize: '1.75rem',
  },
  form: {
    display: 'grid',
    gap: '1.2rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#e6f2ef',
    transition: 'border-color 0.3s',
  },
  button: {
    backgroundColor: '#1f8663',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    color: '#1f8663',
    border: '2px solid #1f8663',
    padding: '0.75rem 1.25rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
};


export default CrearProducto;
