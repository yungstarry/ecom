import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        setProduct(data);
        if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    if (product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    
    toast.success('Added to cart');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-lg overflow-hidden"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary-600' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-display font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-primary-600 font-semibold mb-6">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border rounded-md hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 border rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;