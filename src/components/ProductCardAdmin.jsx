import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCardAdmin = ({ producto }) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
  const confirmDelete = window.confirm(`¿Deseas eliminar el producto "${producto.nombre}"?`);

  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:8080/productos/${producto.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 204 || res.ok) {
      alert('Producto eliminado exitosamente');
      window.location.reload(); // Refresca la lista
    } else {
      const errorText = await res.text();
      throw new Error(`No se pudo eliminar: ${res.status} - ${errorText}`);
    }

  } catch (err) {
    console.error('Error al eliminar:', err);
    alert('Error al eliminar producto. Verifica la consola.');
  }
};


  return (
    <div style={cardStyle}>
      <img
        src={producto.imagen || 'https://via.placeholder.com/150'}
        alt={producto.nombre || 'Producto'}
        style={imgStyle}
      />
      <h3 style={{ color: '#a8d5ba' }}>{producto.nombre || 'Sin nombre'}</h3>
      <p><strong>Descripción:</strong> {producto.descripcion || 'No disponible'}</p>
      <p><strong>Ingredientes:</strong> {producto.ingredientes || 'No disponible'}</p>
      <p><strong>Beneficios:</strong> {producto.beneficios || 'No disponible'}</p>
      <p><strong>Presentación:</strong> {producto.presentacion || 'No disponible'}</p>
      <p><strong>Existencias:</strong> {producto.existencias || 0}</p>
      <p><strong>Precio:</strong> ${producto.precio?.toFixed(2) || '0.00'}</p>
<br/>
      <button onClick={() => navigate(`/admin/dashboard/editar-producto/${producto.id}`)} style={styles.btnEditar}>Editar</button>
      <button onClick={handleDelete} style={styles.btnEliminar}>Eliminar</button>
    </div>
  );
};

const styles = {
  btnEditar: {
    marginRight: '10px',
    backgroundColor: '#1f8663',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',

    
  },
  btnEliminar: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px'
  }
};

const cardStyle = {
  backgroundColor: '#ffffff', // Blanco puro
  color: '#2c2c2c', // Texto gris oscuro
  padding: '1rem',
  margin: '1rem',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Sombra suave
  width: '300px',
};


const imgStyle = {
  width: '100%',
  borderRadius: '10px',
  marginBottom: '1rem',
};

export default ProductCardAdmin;
