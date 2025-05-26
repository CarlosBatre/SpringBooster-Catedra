import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 border border-green-200">
      <img 
        className="w-full h-48 object-cover" 
        src={product.imageUrl || '/placeholder.jpg'} 
        alt={product.name} 
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

        {/* Mostrar presentación */}
        {product.presentation && (
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold text-green-700">Presentación:</span> {product.presentation}
          </p>
        )}

        {/* Mostrar ingredientes */}
        {product.ingredients && (
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold text-green-700">Ingredientes:</span> {product.ingredients}
          </p>
        )}

        {/* Mostrar existencias */}
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold text-green-700">Existencias:</span> {product.stock ?? 'N/D'}
        </p>

        <div className="mt-2">
          <span className="text-lg font-bold text-green-600 block mb-2">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => onAddToCart(product)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
