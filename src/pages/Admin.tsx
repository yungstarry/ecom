import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, DollarSign, Users, ShoppingBag, Download, AlertTriangle, Bell, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';
import { Tab } from '@headlessui/react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Admin = () => {
  const { user } = useStore();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>([]);
  const [showLowStockOnly, setShowLowStockOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    category: 'men',
    images: [''],
    sizes: [''],
    colors: [''],
    stock: '',
  });
  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalUsers: 0,
    totalValue: 0,
    totalRevenue: 0,
  });
  const [darkMode, setDarkMode] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 15;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [salesData, setSalesData] = React.useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [30, 45, 60, 70, 55, 80],
  });
  const [categoryData, setCategoryData] = React.useState({
    labels: ['Men', 'Women', 'Accessories'],
    data: [40, 35, 25],
  });

  React.useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const isDarkMode = savedMode ? JSON.parse(savedMode) : false;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    fetchProducts();
    fetchStats();
    fetchOrders();
    fetchUsers();
    setupRealtimeSubscriptions();
  }, []);

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = showLowStockOnly ? product.stock < 10 : true;
      return matchesSearch && matchesStock;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, showLowStockOnly]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
        const lowStockProducts = data.filter(product => product.stock < 10);
        if (lowStockProducts.length > 0) {
          toast.error(`Low stock alert: ${lowStockProducts.length} products have stock below 10!`, {
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: totalUsers } = await supabase.rpc('get_total_users');
      const { data: totalValue } = await supabase.rpc('get_total_inventory_value');

      // Fetch all orders to calculate totalOrders and totalRevenue
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total');

      if (ordersError) throw ordersError;

      const totalOrders = ordersData.length; // Calculate total orders directly
      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total, 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        totalValue: totalValue || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      // Fetch all orders and join with user_profiles to get full_name
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, user:user_profiles!user_id(full_name)')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Log the fetched orders for debugging
      console.log('Fetched orders:', ordersData);

      // Map the orders with user names
      const ordersWithUserNames = ordersData.map(order => ({
        ...order,
        user_name: order.user?.full_name || 'Unknown User',
      }));

      setOrders(ordersWithUserNames);

      // Recalculate totalRevenue based on all fetched orders
      const totalRevenue = ordersWithUserNames.reduce((sum, order) => sum + order.total, 0) || 0;
      setStats(prev => ({ ...prev, totalRevenue }));
    } catch (error: any) {
      toast.error('Failed to fetch orders: ' + error.message);
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users');

      if (error) {
        console.error('Error fetching users:', error.message, error.details, error.hint);
        throw error;
      }
      if (data) {
        console.log('Fetched users:', data);
        setUsers(data);
      } else {
        console.warn('No user data returned from get_all_users');
        setUsers([]);
      }
    } catch (error: any) {
      toast.error('Failed to fetch users: ' + error.message);
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const setupRealtimeSubscriptions = () => {
    supabase
      .channel('orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, async (payload) => {
        toast.success('New order placed!', {
          icon: <Bell className="h-5 w-5 text-green-500" />,
        });

        // Fetch the user data for the new order from user_profiles
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', payload.new.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user for new order:', userError.message);
        }

        const userName = userData?.full_name || 'Unknown User';

        const newOrder = {
          ...payload.new,
          user_name: userName,
        };

        setOrders((prev) => [newOrder, ...prev]);
        setStats((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          totalRevenue: prev.totalRevenue + payload.new.total,
        }));
      })
      .subscribe();
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (!publicUrl) throw new Error('Failed to get public URL');

      return publicUrl;
    } catch (error: any) {
      toast.error('Failed to upload image');
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatShippingAddress = (address: any) => {
    if (!address || typeof address !== 'object') return 'N/A';
    const { street, city, state, zip } = address;
    return `${street || ''}${street && (city || state || zip) ? ', ' : ''}${city || ''}${city && (state || zip) ? ', ' : ''}${state || ''}${state && zip ? ' ' : ''}${zip || ''}`.trim() || 'N/A';
  };

  const formatItemsSummary = (items: any) => {
    if (!Array.isArray(items) || items.length === 0) return 'No items';
    return `${items.length} item${items.length !== 1 ? 's' : ''}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let imageUrls: string[] = [];
      imageUrls = [...uploadedImages];

      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const uploadPromises = Array.from(fileInput.files).map(handleImageUpload);
        const uploadedUrls = await Promise.all(uploadPromises);
        const newUploadedUrls = uploadedUrls.filter(Boolean) as string[];
        imageUrls = [...imageUrls, ...newUploadedUrls];
      }

      const manualUrls = formData.images.filter(url => url.trim() !== '');
      imageUrls = [...imageUrls, ...manualUrls];

      if (imageUrls.length === 0) {
        toast.error('Please provide at least one image (upload a file or enter a URL)');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: imageUrls,
        sizes: formData.sizes.filter(size => size.trim() !== ''),
        colors: formData.colors.filter(color => color.trim() !== ''),
      };

      if (selectedProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id);

        if (error) throw error;

        const { data: updatedProduct } = await supabase
          .from('products')
          .select('*')
          .eq('id', selectedProduct.id)
          .single();

        if (updatedProduct) {
          setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
          setFilteredProducts(filteredProducts.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        }

        toast.success('Product updated successfully');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) throw error;
        if (data) {
          setProducts([data[0], ...products]);
          setFilteredProducts([data[0], ...filteredProducts]);
        }
        toast.success('Product added successfully');
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'men',
        images: [''],
        sizes: [''],
        colors: [''],
        stock: '',
      });
      setUploadedImages([]);
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    const uploaded = product.images.filter(img => img.includes('product-images'));
    const manualUrls = product.images.filter(img => !img.includes('product-images'));
    setUploadedImages(uploaded);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: [...manualUrls, ''],
      sizes: [...product.sizes, ''],
      colors: [...product.colors, ''],
      stock: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteTarget);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== deleteTarget));
      setFilteredProducts(filteredProducts.filter(p => p.id !== deleteTarget));
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProductIds);

      if (error) throw error;
      setProducts(products.filter(p => !selectedProductIds.includes(p.id)));
      setFilteredProducts(filteredProducts.filter(p => !selectedProductIds.includes(p.id)));
      toast.success(`${selectedProductIds.length} product(s) deleted successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSelectedProductIds([]);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === currentProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(currentProducts.map(product => product.id));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole },
      });

      if (error) throw error;
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleteTarget(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(deleteTarget);

      if (error) throw error;
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || user.user_metadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedProduct(null);
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  category: 'men',
                  images: [''],
                  sizes: [''],
                  colors: [''],
                  stock: '',
                });
                setUploadedImages([]);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-white dark:bg-gray-700 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`
              }
            >
              Products
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`
              }
            >
              Orders
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`
              }
            >
              Users
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`
              }
            >
              Analytics
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Products</h2>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showLowStockOnly}
                          onChange={() => setShowLowStockOnly(!showLowStockOnly)}
                          className="h-4 w-4 text-primary-600 rounded"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-300">Show Low Stock Only</label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        onClick={() => exportToCSV(filteredProducts, 'products.csv')}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                      >
                        <Download className="h-5 w-5" />
                        Export
                      </button>
                      {selectedProductIds.length > 0 && (
                        <button
                          onClick={handleBulkDelete}
                          className="flex items-center gap-2 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                          Delete Selected ({selectedProductIds.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.length === currentProducts.length && currentProducts.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-primary-600 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                            Loading...
                          </td>
                        </tr>
                      ) : currentProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        currentProducts.map((product) => (
                          <tr key={product.id} className={product.stock < 10 ? 'bg-red-50 dark:bg-red-900' : ''}>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedProductIds.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="h-4 w-4 text-primary-600 rounded"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center group relative">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                                <div className="absolute hidden group-hover:block z-10">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="h-40 w-40 rounded-md object-cover shadow-lg"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-300">
                                    {product.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {product.stock}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredProducts.length > productsPerPage && (
                  <div className="flex justify-between items-center p-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Previous
                    </button>
                    <span className="text-gray-900 dark:text-white">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md flex items-center gap-2 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                  <button
                    onClick={() => exportToCSV(orders, 'orders.csv')}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                  >
                    <Download className="h-5 w-5" />
                    Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Shipping Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-primary-600 hover:text-primary-900 underline"
                            >
                              {order.id}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.user_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatItemsSummary(order.items)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(order.total)}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{formatShippingAddress(order.shipping_address)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                              disabled={order.status === 'shipped' || order.status === 'canceled'}
                            >
                              Mark as Shipped
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'canceled')}
                              className="text-red-600 hover:text-red-900"
                              disabled={order.status === 'shipped' || order.status === 'canceled'}
                            >
                              Cancel Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">User Management</h2>
                  <button
                    onClick={() => exportToCSV(users, 'users.csv')}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                  >
                    <Download className="h-5 w-5" />
                    Export
                  </button>
                </div>
                {users.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No users found. Check the console for errors or verify the 'get_all_users' RPC function in Supabase.
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={user.role || 'user'}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 ml-4"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-white">Sales Overview</h2>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: salesData.labels,
                        datasets: [
                          {
                            label: 'Sales',
                            data: salesData.data,
                            borderColor: 'rgb(79, 70, 229)',
                            backgroundColor: 'rgba(79, 70, 229, 0.2)',
                            fill: true,
                            tension: 0.4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-white">Sales by Category</h2>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: categoryData.labels,
                        datasets: [
                          {
                            data: categoryData.data,
                            backgroundColor: [
                              'rgb(79, 70, 229)',
                              'rgb(59, 130, 246)',
                              'rgb(147, 51, 234)',
                            ],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Images (Provide at least one image) *
                </label>
                <div className="space-y-2">
                  {uploadedImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Uploaded Images:</p>
                      <div className="flex flex-wrap gap-4">
                        {uploadedImages.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imageUrl}
                              alt={`Uploaded ${index}`}
                              className="h-20 w-20 rounded-md object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Or add image URLs:</p>
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="flex-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Image URL"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.images.length > 1) {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== index),
                            });
                          }
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      {index === formData.images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-md"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sizes *
                </label>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      required
                      value={size}
                      onChange={(e) => {
                        const newSizes = [...formData.sizes];
                        newSizes[index] = e.target.value;
                        setFormData({ ...formData, sizes: newSizes });
                      }}
                      className="flex-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Size (e.g., S, M, L, or 23)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.sizes.length > 1) {
                          setFormData({
                            ...formData,
                            sizes: formData.sizes.filter((_, i) => i !== index),
                          });
                        }
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {index === formData.sizes.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, ''] })}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-md"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Colors *
                </label>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      required
                      value={color}
                      onChange={(e) => {
                        const newColors = [...formData.colors];
                        newColors[index] = e.target.value;
                        setFormData({ ...formData, colors: newColors });
                      }}
                      className="flex-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Color name"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.colors.length > 1) {
                          setFormData({
                            ...formData,
                            colors: formData.colors.filter((_, i) => i !== index),
                          });
                        }
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {index === formData.colors.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, colors: [...formData.colors, ''] })}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-md"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                    setUploadedImages([]);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md"
                >
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
          >
            <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {selectedProductIds.length > 0 ? `${selectedProductIds.length} selected products` : 'this item'}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                No
              </button>
              <button
                onClick={selectedProductIds.length > 0 ? confirmBulkDelete : (deleteTarget ? confirmDelete : confirmDeleteUser)}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;