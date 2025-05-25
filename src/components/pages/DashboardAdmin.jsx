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
          <div style={styles.filtros}>
            <input
              type="text"
              name="nombre"
              placeholder="Buscar por nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              style={styles.input}
            />
            <input
              type="text"
              name="presentacion"
              placeholder="Presentación"
              value={filtros.presentacion}
              onChange={handleFiltroChange}
              style={styles.input}
            />
            <input
              type="text"
              name="ingredientes"
              placeholder="Ingredientes"
              value={filtros.ingredientes}
              onChange={handleFiltroChange}
              style={styles.input}
            />
            <input
              type="number"
              name="precioMax"
              placeholder="Precio máximo"
              value={filtros.precioMax}
              onChange={handleFiltroChange}
              style={styles.input}
            />
            <input
              type="number"
              name="existenciasMin"
              placeholder="Existencias mínimas"
              value={filtros.existenciasMin}
              onChange={handleFiltroChange}
              style={styles.input}
            />
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

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            style={{ backgroundColor: '#1ba576', width: '7%' }}
            onClick={() => setPagina((p) => Math.max(p - 1, 0))}
            disabled={pagina === 0}
          >
            Anterior
          </button>
          <span style={{ margin: '0 1rem' }}>
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            style={{ backgroundColor: '#1ba576', width: '7%' }}
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
    backgroundColor: 'white',
    color: '#333',
    minHeight: '100vh',
  },
  titulo: {
    color: '#1f8663',
    marginBottom: '1rem',
  },
  subtitulo: {
    color: '#2c5f4a',
    marginBottom: '0.5rem',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filtrosContainer: {
    marginBottom: '2rem',
  },
  filtros: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minWidth: '200px',
    flex: '1',
  },
};

export default DashboardAdmin;
