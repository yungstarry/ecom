import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Sliders } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [showFilters, setShowFilters] = React.useState(false);
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const productsPerPage = 5;

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Count total products
      let countQuery = supabase.from('products').select('id', { count: 'exact' });
      
      if (category) {
        countQuery = countQuery.eq('category', category);
      }
      if (minPrice) {
        countQuery = countQuery.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        countQuery = countQuery.lte('price', parseFloat(maxPrice));
      }
      if (color) {
        countQuery = countQuery.contains('colors', [color]);
      }
      if (size) {
        countQuery = countQuery.contains('sizes', [size]);
      }
      if (search) {
        countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { count } = await countQuery;
      if (count !== null) setTotalProducts(count);

      // Fetch products with filters
      let query = supabase
        .from('products')
        .select('*')
        .range((page - 1) * productsPerPage, page * productsPerPage - 1);
      
      if (category) {
        query = query.eq('category', category);
      }
      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }
      if (color) {
        query = query.contains('colors', [color]);
      }
      if (size) {
        query = query.contains('sizes', [size]);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, minPrice, maxPrice, color, size, page, sortBy, search]);

  const handleFilterChange = (filters: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set('page', '1'); // Reset to first page when filters change
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection` : 'All Products'}
          {search && ` - Search results for "${search}"`}
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          {showFilters ? <X className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-1 space-y-6"
          >
            {/* Sort By */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {['Black', 'White', 'Navy', 'Brown', 'Tan', 'Gray', 'Red'].map((colorOption) => (
                  <button
                    key={colorOption}
                    onClick={() => handleFilterChange({ color: color === colorOption ? '' : colorOption })}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      color === colorOption ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {colorOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((sizeOption) => (
                  <button
                    key={sizeOption}
                    onClick={() => handleFilterChange({ size: size === sizeOption ? '' : sizeOption })}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      size === sizeOption ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {sizeOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setSearchParams(new URLSearchParams(category ? { category } : {}))}
              className="w-full px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${showFilters ? 'col-span-3' : 'col-span-4'}`}>
          {loading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">No products found</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Products;