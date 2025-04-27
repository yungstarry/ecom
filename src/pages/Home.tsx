import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Truck, Shield, Clock, CreditCard, Award, Users, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const productsPerPage = 10;

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Featured Products
        const { data: featured, error: featuredError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(productsPerPage);
        
        if (featuredError) throw new Error(featuredError.message);
        if (featured) setFeaturedProducts(featured);

        // New Arrivals
        const { data: arrivals, error: arrivalsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .range(productsPerPage, productsPerPage * 2 - 1);
        
        if (arrivalsError) throw new Error(arrivalsError.message);
        if (arrivals) setNewArrivals(arrivals);

      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">LUXE</h1>
          <p className="text-xl md:text-2xl mb-8">Elevate Your Style</p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-900 px-8 py-3 rounded-md font-semibold"
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Featured Collections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-bold">Featured Collections</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))
            ) : (
              featuredProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/products?category=women">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative h-[400px] rounded-lg overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800"
                  alt="Women's Collection"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-display text-2xl font-bold">Women</h3>
                </div>
              </motion.div>
            </Link>
            <Link to="/products?category=men">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative h-[400px] rounded-lg overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800"
                  alt="Men's Collection"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-display text-2xl font-bold">Men</h3>
                </div>
              </motion.div>
            </Link>
            <Link to="/products?category=accessories">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative h-[400px] rounded-lg overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800"
                  alt="Accessories Collection"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-display text-2xl font-bold">Accessories</h3>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))
            ) : (
              newArrivals.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Truck className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $100</p>
            </div>
            <div className="text-center">
              <Shield className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment</p>
            </div>
            <div className="text-center">
              <Clock className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated support</p>
            </div>
            <div className="text-center">
              <CreditCard className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">30 day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex text-primary-600 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The quality of their products is outstanding. I'm a regular customer and have never been disappointed."
                </p>
                <div className="flex items-center">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="Customer"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">Customer Name</p>
                    <p className="text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LUXE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Why Choose LUXE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                We source only the finest materials and work with skilled artisans to create exceptional pieces.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-4">Expert Curation</h3>
              <p className="text-gray-600">
                Our fashion experts carefully curate each collection to ensure the perfect blend of style and sophistication.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-4">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're committed to providing an exceptional shopping experience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-gray-900"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-900 px-6 py-2 rounded-md font-semibold"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
