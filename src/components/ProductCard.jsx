import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden m-4 transition-transform hover:scale-105">
      <img 
        className="w-full h-48 object-cover"
        src={product.imageUrl} 
        alt={product.name}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <br />
          <br />
          <button 
            onClick={() => onAddToCart(product)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
