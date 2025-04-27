import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/useStore";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

const OrderDetail = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const { user } = useStore();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.user_metadata?.role !== "admin") return;
    fetchOrderDetails();
  }, [orderId, user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      // Fetch the order with user details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*, user:user_profiles!user_id(full_name)")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;
      if (!orderData) throw new Error("Order not found");

      // Fetch product details for each item in the order
      const productIds = orderData.items.map((item) => item.product_id);
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) throw productsError;

      // Map products to their IDs for easy lookup
      const productsMap = productsData.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

      setOrder({
        ...orderData,
        user_name: orderData.user?.full_name || "Unknown User",
      });
      setProducts(productsMap);
    } catch (error) {
      toast.error("Failed to fetch order details: " + error.message);
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatShippingAddress = (address) => {
    if (!address || typeof address !== "object") return "N/A";
    const { street, city, state, zip } = address;
    return (
      `${street || ""}${street && (city || state || zip) ? ", " : ""}${
        city || ""
      }${city && (state || zip) ? ", " : ""}${state || ""}${
        state && zip ? " " : ""
      }${zip || ""}`.trim() || "N/A"
    );
  };

  if (!user || user.user_metadata?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link
            to="/admin"
            className="flex items-center text-primary-600 hover:text-primary-900"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Admin Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
          Order Details - {order.id}
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID
              </p>
              <p className="text-gray-900 dark:text-white">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">User</p>
              <p className="text-gray-900 dark:text-white">{order.user_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-gray-900 dark:text-white">
                {formatCurrency(order.total)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-gray-900 dark:text-white">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created At
              </p>
              <p className="text-gray-900 dark:text-white">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Updated At
              </p>
              <p className="text-gray-900 dark:text-white">
                {new Date(order.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shipping Address
              </p>
              <p className="text-gray-900 dark:text-white">
                {formatShippingAddress(order.shipping_address)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Items
          </h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-6">
              {order.items.map((item, index) => {
                const product = products[item.product_id];
                return (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      {product && product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {product ? product.name : "Product Not Found"}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Product ID
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {item.product_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {item.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Size
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {item.size || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Color
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {item.color || "N/A"}
                            </p>
                          </div>
                          {product && (
                            <>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Category
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {product.category}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Price (Each)
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {formatCurrency(product.price)}
                                </p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Description
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {product.description}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No items in this order.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
