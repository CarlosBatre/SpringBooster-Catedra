import React, { useEffect, useState } from 'react';
import ProductCardAdmin from '../ProductCardAdmin';
import HeaderAdmin from '../HeaderAdmin';


const DashboardAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros avanzados
  const [filtros, setFiltros] = useState({
    nombre: '',
    presentacion: '',
    ingredientes: '',
    precioMax: '',
    existenciasMin: ''
  });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/productos?page=${pagina}&size=12`);
        if (!response.ok) throw new Error('Error al cargar los productos');

        const data = await response.json();
        const lista = data._embedded?.productoResponseList || [];
        setProductos(lista);
        setTotalPaginas(data.page?.totalPages || 1);
      } catch (err) {
        console.error('Fallo al obtener productos:', err);
        setError(err.message);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [pagina]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const productosFiltrados = productos.filter((producto) => {
    const {
      nombre,
      presentacion,
      ingredientes,
      precioMax,
      existenciasMin
    } = filtros;

    return (
      producto.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
      producto.presentacion.toLowerCase().includes(presentacion.toLowerCase()) &&
      producto.ingredientes.toLowerCase().includes(ingredientes.toLowerCase()) &&
      (precioMax === '' || producto.precio <= parseFloat(precioMax)) &&
      (existenciasMin === '' || producto.existencias >= parseInt(existenciasMin))
    );
  });

  return (
    <div>
      <HeaderAdmin />

      <main style={styles.main}>
        <h2 style={styles.titulo}>Bienvenido al panel de administración</h2>
        <p>Aquí puedes gestionar productos, usuarios y más. Esta farmacia está dedicada a la medicina natural.</p>
<br/><br/>
        <div style={styles.filtrosContainer}>
          <h2 style={styles.subtitulo}>Productos en inventario</h2>
          <div style={styles.filtrosContainer}>
  <h2 style={styles.subtitulo}>Filtrar productos</h2>
  <div style={styles.filtroGrid}>
    <div style={styles.filtroItem}>
      <label style={styles.label}>Nombre</label>
      <input
        type="text"
        name="nombre"
        placeholder="Buscar por nombre"
        value={filtros.nombre}
        onChange={handleFiltroChange}
        style={styles.input}
      />
    </div>
    <div style={styles.filtroItem}>
      <label style={styles.label}>Presentación</label>
      <input
        type="text"
        name="presentacion"
        placeholder="Ej: cápsulas"
        value={filtros.presentacion}
        onChange={handleFiltroChange}
        style={styles.input}
      />
    </div>
    <div style={styles.filtroItem}>
      <label style={styles.label}>Ingredientes</label>
      <input
        type="text"
        name="ingredientes"
        placeholder="Ej: jengibre, cúrcuma"
        value={filtros.ingredientes}
        onChange={handleFiltroChange}
        style={styles.input}
      />
    </div>
    <div style={styles.filtroItem}>
      <label style={styles.label}>Precio máximo</label>
      <input
        type="number"
        name="precioMax"
        placeholder="Ej: 50"
        value={filtros.precioMax}
        onChange={handleFiltroChange}
        style={styles.input}
      />
    </div>
    <div style={styles.filtroItem}>
      <label style={styles.label}>Existencias mínimas</label>
      <input
        type="number"
        name="existenciasMin"
        placeholder="Ej: 10"
        value={filtros.existenciasMin}
        onChange={handleFiltroChange}
        style={styles.input}
      />
    </div>
  </div>
</div>

        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : productosFiltrados.length === 0 ? (
          <p>No hay productos que coincidan con el filtro.</p>
        ) : (
          <div style={styles.grid}>
            {productosFiltrados.map((producto) => (
              <ProductCardAdmin key={producto.id} producto={producto} />
            ))}
          </div>
        )}

              <div style={styles.pagination}>
                <button
                  style={styles.button}
                  onClick={() => setPagina((p) => Math.max(p - 1, 0))}
                  disabled={pagina === 0}
                >
                  Anterior
                </button>
                <span style={{ margin: '0 1rem' }}>
                  Página {pagina + 1} de {totalPaginas}
                </span>
                <button
                  style={styles.button}
                  onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas - 1))}
                  disabled={pagina >= totalPaginas - 1}
                >
                  Siguiente
                </button>
              </div>
      </main>
    </div>
  );
};

const styles = {
  main: {
    padding: '2rem',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  titulo: {
    color: '#1f8663',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitulo: {
    color: '#1f8663',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  filtrosContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
  },
  filtros: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#e6f2ef',
    minWidth: '200px',
    flex: '1',
    transition: 'border-color 0.3s ease',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1.5rem',
  },
  button: {
    backgroundColor: '#1ba576',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '8%',
  },
  pagination: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  filtroGrid: {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginTop: '1rem',
},

filtroItem: {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '200px',
  flex: '1 1 200px',
},

label: {
  marginBottom: '0.3rem',
  color: '#1f8663',
  fontWeight: 'bold',
},

};

export default DashboardAdmin;
