import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';

const Cart = () => {
  const navigate = useNavigate();
  const { user, cart, guestCart, removeFromCart, updateCartItemQuantity } = useStore();
  
  // Use appropriate cart based on user status
  const currentCart = user ? cart : guestCart;
  const total = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (currentCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue Shopping
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {currentCart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && ' · '}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.price}</p>
                    <p className="text-sm text-gray-600">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="font-display font-bold text-xl mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold"
              >
                Proceed to Checkout
              </motion.button>
              {!user && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign in
                  </button>{' '}
                  to save your cart and checkout
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;