import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: product.colors[0],
    });
    toast.success('Added to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group relative"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/5] relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary-50"
          >
            <ShoppingBag className="h-5 w-5 text-primary-600" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-primary-600 font-semibold">${product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;