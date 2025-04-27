import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { cart, guestCart, user } = useStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Use appropriate cart based on auth status
  const currentCart = user ? cart : guestCart;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    closeMenu();
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-display text-2xl font-bold text-primary-900">
              LUXE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Shop
            </Link>
            <Link to="/products?category=men" className="text-gray-700 hover:text-primary-600">
              Men
            </Link>
            <Link to="/products?category=women" className="text-gray-700 hover:text-primary-600">
              Women
            </Link>
            <Link to="/products?category=accessories" className="text-gray-700 hover:text-primary-600">
              Accessories
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSearch}
                    className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 w-72"
                  >
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-700" />
              {currentCart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {currentCart.length}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/auth"}>
              <User className="h-6 w-6 text-gray-700" />
            </Link>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/products"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link
                to="/products?category=men"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={closeMenu}
              >
                Men
              </Link>
              <Link
                to="/products?category=women"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={closeMenu}
              >
                Women
              </Link>
              <Link
                to="/products?category=accessories"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={closeMenu}
              >
                Accessories
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;