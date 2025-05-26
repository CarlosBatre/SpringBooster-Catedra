import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/productos');
        if (!response.ok) throw new Error('Error al cargar los productos');
        const data = await response.json();
        setProducts(data._embedded.productoResponseList);
        setFilteredProducts(data._embedded.productoResponseList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtro por nombre, presentación y orden por precio
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.presentacion && product.presentacion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortOption === 'asc') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (sortOption === 'desc') {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reiniciar a la página 1 al cambiar filtro
  }, [searchTerm, sortOption, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título llamativo */}
      <h1 className="text-4xl font-extrabold text-green-700 text-center mb-8 drop-shadow-md uppercase tracking-wide">
        Medicina Natural
      </h1>
<br/>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o presentación"
          className="px-4 py-2 border rounded-md w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-md w-full md:w-1/4"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.nombre,
                description: product.descripcion,
                price: product.precio,
                imageUrl: product.imagen,
                stock: product.existencias,
                presentation: product.presentacion,
                ingredients: product.ingredientes
              }}
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-600">No se encontraron productos.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Anterior
        </button>

        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Products;
