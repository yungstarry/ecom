import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  user_id: string;
  full_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

const Addresses = () => {
  const { user } = useStore();
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);
  const [formData, setFormData] = React.useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    is_default: false,
  });

  React.useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('shipping_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (error) throw error;
        if (data) setAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const addressData = {
        ...formData,
        user_id: user.id,
      };

      if (selectedAddress) {
        const { error } = await supabase
          .from('shipping_addresses')
          .update(addressData)
          .eq('id', selectedAddress.id);

        if (error) throw error;
        toast.success('Address updated successfully');
      } else {
        const { error } = await supabase
          .from('shipping_addresses')
          .insert([addressData]);

        if (error) throw error;
        toast.success('Address added successfully');
      }

      setIsModalOpen(false);
      setSelectedAddress(null);
      setFormData({
        full_name: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
        is_default: false,
      });

      // Refresh addresses
      const { data } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (data) setAddresses(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Address deleted successfully');
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      full_name: address.full_name,
      address: address.address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone,
      is_default: address.is_default,
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p>Loading addresses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Saved Addresses</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{address.full_name}</h3>
                {address.is_default && (
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              {address.address}<br />
              {address.city}, {address.state} {address.postal_code}<br />
              {address.country}<br />
              Phone: {address.phone}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-display font-bold mb-6">
              {selectedAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedAddress(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md"
                >
                  {selectedAddress ? 'Update Address' : 'Add Address'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Addresses;