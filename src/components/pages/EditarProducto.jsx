// src/pages/EditarProducto.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarProducto = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`http://localhost:8080/productos/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        alert('Error al cargar producto');
        console.error(err);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['existencias', 'precio'].includes(name) ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al actualizar');
      alert('Producto actualizado');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar producto');
    }
  };

  return (
    <div>
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Admin Dashboard</h2>
      </header>

      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Editar Producto</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {[
              'nombre', 'imagen', 'descripcion', 'ingredientes',
              'beneficios', 'presentacion'
            ].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                style={styles.input}
              />
            ))}
            <input
              name="existencias"
              type="number"
              value={formData.existencias}
              onChange={handleChange}
              placeholder="Existencias"
              required
              style={styles.input}
            />
            <input
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              placeholder="Precio"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Guardar Cambios</button>
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

export default EditarProducto;
