import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Package, CreditCard, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
  });

  React.useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // For normal users, only fetch their own orders
      if (user?.user_metadata?.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch orders: ' + error.message);
      setOrders([]);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: formData.fullName },
      });

      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">
                    {user.user_metadata?.full_name || 'User'}
                  </h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-left rounded-md bg-primary-50 text-primary-600">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-left rounded-md hover:bg-gray-50">
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-left rounded-md hover:bg-gray-50">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left rounded-md hover:bg-red-50 text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-display font-bold text-xl mb-6">
                Profile Settings
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-2 rounded-md font-semibold"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </motion.button>
              </form>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-display font-bold text-xl mb-6">
                Recent Orders
              </h3>
              {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Shipping Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatItemsSummary(order.items)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatShippingAddress(order.shipping_address)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;