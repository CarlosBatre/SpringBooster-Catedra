import React, { useEffect, useState } from 'react';

const GestionPedidosCliente = () => {
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPedidos(page);
  }, [page]);

  const fetchPedidos = async (pageNum) => {
    try {
      // Aquí deberías usar el ID o email del usuario autenticado
      const userEmail = localStorage.getItem('userEmail'); // Asumiendo que guardas el email en localStorage
      const response = await fetch(`http://localhost:8080/pedidos/usuario/${userEmail}?page=${pageNum}&size=20`);
      if (!response.ok) throw new Error('Error al obtener los pedidos');
      const data = await response.json();
      setPedidos(data._embedded ? data._embedded.pedidoResponseList : []);
      setTotalPages(data.page.totalPages);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const getEstadoStyle = (estado) => {
    switch (estado.toUpperCase()) {
      case 'PEDIDO REALIZADO':
        return { backgroundColor: '#cce5ff', color: '#004085' };
      case 'PEDIDO EN CAMINO':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      case 'PEDIDO ENTREGADO':
        return { backgroundColor: '#d4edda', color: '#155724' };
      default:
        return { backgroundColor: '#cce5ff', color: '#004085' };
    }
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const term = searchTerm.toLowerCase();
    return pedido.id.toString().includes(term);
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.headerText}>Mis Pedidos</h2>
      </header>

      <div style={styles.mainContent}>
        <h2 style={styles.titulo}>Historial de Pedidos</h2>

        <input
          type="text"
          placeholder="Buscar por número de pedido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.pedidosContainer}>
          {filteredPedidos.length === 0 ? (
            <p>No hay pedidos para mostrar.</p>
          ) : (
            filteredPedidos.map((pedido) => (
              <div
                key={pedido.id}
                style={styles.pedidoCard}
              >
                <div style={styles.infoContainer}>
                  <div style={styles.textContent}>
                    <h3>Pedido #{pedido.id}</h3>
                    <div style={{ ...styles.estadoBox, ...getEstadoStyle(pedido.estado) }}>
                      <strong style={{ fontWeight: 'bold', fontSize: '20px' }}>{pedido.estado}</strong>
                    </div>
                    <p><strong>Fecha:</strong> {pedido.fechaPedido}</p>
                    <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                  </div>

                  <div style={styles.imagenesContainer}>
                    {pedido.detalles.map((item) => (
                      <div key={item.id} style={styles.productoContainer}>
                        <img
                          src={item.imagen || 'https://via.placeholder.com/80'}
                          alt={item.nombreProducto}
                          style={styles.productoImg}
                        />
                        <span style={styles.cantidad}>x{item.cantidad}</span>
                        <div style={styles.productoInfo}>
                          <span>{item.nombreProducto}</span>
                          <span>${item.precio}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.pagination}>
          <button onClick={handlePrev} disabled={page === 0} style={styles.btn}>
            Anterior
          </button>
          <span> Página {page + 1} de {totalPages} </span>
          <button onClick={handleNext} disabled={page >= totalPages - 1} style={styles.btn}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#1f8663',
    padding: '1rem',
    textAlign: 'center',
    color: 'white',
  },
  headerText: {
    margin: 0,
  },
  mainContent: {
    padding: '2rem',
  },
  titulo: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    width: '90%',
    maxWidth: '900px',
    padding: '10px',
    marginBottom: '20px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  pedidosContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  pedidoCard: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    width: '90%',
    maxWidth: '900px',
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px',
  },
  textContent: {
    flex: '1',
    minWidth: '250px',
  },
  estadoBox: {
    borderRadius: '8px',
    padding: '10px 16px',
    display: 'inline-block',
    margin: '12px 0',
  },
  imagenesContainer: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    flex: '2',
    minWidth: '300px',
  },
  productoContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '120px',
  },
  productoImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  cantidad: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#1f8663',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  productoInfo: {
    marginTop: '8px',
    textAlign: 'center',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  pagination: {
    textAlign: 'center',
    marginTop: '30px',
  },
  btn: {
    padding: '8px 15px',
    margin: '0 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#1f8663',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '8%',
  },
};

export default GestionPedidosCliente;
