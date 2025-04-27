import React from 'react';
import { motion } from 'framer-motion';
import { Package, FileText, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';
import { useStore } from '../../store/useStore';

const Orders = () => {
  const { user } = useStore();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const downloadInvoice = async (order: Order) => {
    // Generate and download invoice (implementation depends on your needs)
    const invoice = `
Order #${order.id}
Date: ${new Date(order.created_at).toLocaleDateString()}
Total: $${order.total.toFixed(2)}

Items:
${order.items.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Shipping Address:
${order.shipping_address.full_name}
${order.shipping_address.address}
${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}
${order.shipping_address.country}
    `;

    const blob = new Blob([invoice], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Order #{order.id}</h3>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadInvoice(order)}
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
              >
                <Download className="h-4 w-4" />
                <span>Invoice</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ${item.price}
                  </p>
                  {item.selectedSize && <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>}
                  {item.selectedColor && <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>}
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {order.shipping_address.full_name}<br />
                  {order.shipping_address.address}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                  {order.shipping_address.country}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Orders;