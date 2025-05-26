import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import img from '../../img/logo_umbrella.png';


const DetallePedidoAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await fetch(`http://localhost:8080/pedidos/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener el pedido');
        const data = await res.json();
        setPedido(data);
        setNuevoEstado(data.estado);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPedido();
  }, [id]);

  const actualizarEstado = async () => {
    try {
      const res = await fetch(`http://localhost:8080/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error('Error al actualizar el estado');
      setMensaje('Estado actualizado correctamente');

      setTimeout(() => {
        navigate('/admin/dashboard/gestion-pedidos');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoStyle = (estado) => {
    switch (estado.toUpperCase()) {
      case 'PEDIDO REALIZADO':
      case 'Pedido Realizado':
        return {
          backgroundColor: '#cce5ff', // azul claro
          color: '#004085', // azul oscuro texto
        };
      case 'PEDIDO EN CAMINO':
        return {
          backgroundColor: '#f8d7da', // rojo claro
          color: '#721c24', // rojo oscuro texto
        };
      case 'PEDIDO ENTREGADO':
        return {
          backgroundColor: '#d4edda', // verde claro
          color: '#155724', // verde oscuro texto
        };
      default:
        return {
          backgroundColor: '#cce5ff', // default azul claro
          color: '#004085',
        };
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!pedido) return <p>Cargando...</p>;

  return (
    <div style={styles.container}>
<header style={styles.header}>
  <div style={styles.headerContent}>
    <img
      src={img}
      alt="Logo"
      style={styles.logo}
      onClick={() => navigate('/admin/dashboard')}
    />
    <h2 style={styles.headerText}>Admin Dashboard</h2>
  </div>
</header>


      <main style={styles.main}>
        <div style={styles.section}>
          <h1 style={styles.title}>Pedido #{pedido.id}</h1>

          <div style={styles.infoBox}>
            <p><strong>Cliente:</strong> {pedido.nombreCliente}</p>
            <p><strong>Email:</strong> {pedido.email}</p>
            <p><strong>Dirección:</strong> {pedido.direccion}</p>
            <p><strong>Teléfono:</strong> {pedido.telefono}</p>
            <p><strong>Método de Pago:</strong> {pedido.metodoPago}</p>
            <p><strong>Fecha del Pedido:</strong> {pedido.fechaPedido}</p>
            <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
          </div>

          <div style={styles.estadoSection}>
            <p><strong>Estado actual:</strong></p>
            <div style={{ ...styles.estado, ...getEstadoStyle(pedido.estado) }}>
              {pedido.estado}
            </div>
          </div>

          <div style={styles.estadoForm}>
            <br/> <br/>
            <label><strong>Cambiar estado:</strong></label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              style={styles.select}
            >
              <option value="Pedido Realizado">Pedido Realizado</option>
              <option value="PEDIDO EN CAMINO">Pedido En Camino</option>
              <option value="PEDIDO ENTREGADO">Pedido Entregado</option>
            </select>
             <br/> <br/>
            <button onClick={actualizarEstado} style={styles.btnActualizar}>
              Actualizar Estado
            </button>
          </div>

          {mensaje && <p style={styles.success}>{mensaje}</p>}
        </div>

        <hr style={styles.divider} />

        <div style={styles.section}>
          <h3 style={styles.subtitle}>Productos del Pedido:</h3>
          <div style={styles.productosContainer}>
            {pedido.detalles.map((d) => (
              <div key={d.id} style={styles.productoCard}>
                <img
                  src={d.imagen || 'https://via.placeholder.com/100'}
                  alt={d.nombreProducto}
                  style={styles.productoImg}
                />
                <p><strong>{d.nombreProducto}</strong></p>
                <p>Cantidad: {d.cantidad}</p>
                <p>Precio unitario: ${d.precioUnitario}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  headerContent: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},
logo: {
  height: '50px',
  position: 'absolute',
  left: '1rem',
  cursor: 'pointer',
},

  container: {
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  backgroundColor: '#e6f4f0',
  minHeight: '100vh',
},
header: {
  backgroundColor: '#1f8663',
  padding: '1rem 2rem',
  color: 'white',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
},
headerText: {
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: 'white',
},
main: {
  padding: '2rem',
  backgroundColor: '#f0fbf7',
},
section: {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '12px',
  marginBottom: '2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
},
title: {
  fontSize: '26px',
  color: '#1f8663',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
},
subtitle: {
  fontSize: '20px',
  color: '#1f8663',
  marginBottom: '1rem',
  fontWeight: 'bold',
},
infoBox: {
  lineHeight: '1.8',
  fontSize: '16px',
  marginBottom: '1rem',
  padding: '1rem',
  backgroundColor: '#f7fdfc',
  borderRadius: '8px',
  border: '1px solid #c1e7da',
},
estado: {
  padding: '0.6rem 1.4rem',
  borderRadius: '6px',
  fontSize: '18px',
  display: 'inline-block',
  marginTop: '0.5rem',
  fontWeight: 'bold',
},
select: {
  padding: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  backgroundColor: '#f0fdf8',
},
btnActualizar: {
  backgroundColor: '#1f8663',
  color: 'white',
  border: 'none',
  padding: '0.6rem 1.2rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
},
success: {
  color: '#1f8663',
  marginTop: '1rem',
  fontWeight: 'bold',
},
divider: {
  margin: '2rem 0',
  border: 'none',
  height: '2px',
  backgroundColor: '#c1e7da',
},
productosContainer: {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginTop: '1rem',
},
productoCard: {
  backgroundColor: '#ffffff',
  border: '1px solid #cce5dd',
  padding: '1rem',
  borderRadius: '10px',
  width: '200px',
  textAlign: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
},
productoImg: {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  marginBottom: '0.5rem',
  borderRadius: '6px',
},
};

export default DetallePedidoAdmin;
