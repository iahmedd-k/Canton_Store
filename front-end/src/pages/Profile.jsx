import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEdit3,
} from "react-icons/fi";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [user, setUser] = useState({ id: "guest", email: "guest@example.com" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
          navigate("/login");
          return;
        }

        // derive user info from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: userId, email: payload?.email || "" });
        } catch (_) {
          setUser({ id: userId, email: "" });
        }

        // fetch all orders and filter to current user
  const { data } = await axios.get(`${API_URL}/orders/`);
        const filtered = (data || []).filter((o) => {
          if (o?.user && userId) return String(o.user) === String(userId);
          if (o?.shippingAddress?.email && user?.email) return o.shippingAddress.email === user.email;
          return false;
        });
        setOrders(filtered);

      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Status helpers
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FiClock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <FiPackage className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <FiTruck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiClock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price) =>
    typeof price === "number" ? `PKR ${price.toLocaleString()}` : price;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUser className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.email || "Guest"}! 👋
              </h1>
              <p className="text-gray-600">
                Manage your account and view order history
              </p>
              <p className="text-sm text-gray-500 mt-1">User ID: {user?.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar (orders only) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiShoppingBag className="h-5 w-5" />
                  <span>Order History</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order History
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        You haven't placed any orders yet.
                      </p>
                      <a
                        href="/products"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Shopping
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">
                                Order #{order._id.slice(-8)}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Ordered on</p>
                              <p className="font-medium">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          {/* Order details here... */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No profile settings section per request */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
