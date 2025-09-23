import { useState, useEffect } from "react";
import {
  FiBox,
  FiList,
  FiShoppingCart,
  FiLogOut,
  FiHome,
} from "react-icons/fi";

import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [productMsg, setProductMsg] = useState("");
  const [productError, setProductError] = useState("");
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
  });
  const [editProductId, setEditProductId] = useState(null);

  // Calculate revenue (only from delivered orders)
  const totalRevenue = orders.reduce(
    (acc, order) => {
      const status = order.status ? order.status.toLowerCase() : '';
      return status === 'delivered' ? acc + (order.totalAmount || 0) : acc;
    },
    0
  );

  // Calculate order statistics
  const pendingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
  const processingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'processing').length;
  const shippedOrders = orders.filter(order => (order.status || '').toLowerCase() === 'shipped').length;
  const deliveredOrders = orders.filter(order => (order.status || '').toLowerCase() === 'delivered').length;
  const cancelledOrders = orders.filter(order => (order.status || '').toLowerCase() === 'cancelled').length;

  // Growth percentages (mock)
  const revenueGrowth = totalRevenue > 0 ? Math.round(Math.random() * 20 + 5) : 0;
  const orderGrowth = orders.length > 0 ? Math.round(Math.random() * 15 + 3) : 0;
  const productGrowth = products.length > 0 ? Math.round(Math.random() * 10 + 2) : 0;

  // Average order value
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Conversion rate (mock)
  const conversionRate = orders.length > 0 ? Math.round((orders.length / (orders.length * 10)) * 100) : 0;

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setOrdersError("No authentication token found");
        setOrders([]);
        return;
      }

      const res = await axios.get(`${API_URL}/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Orders API response:", res.data);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      if (err.response?.status === 401) {
        setOrdersError("Authentication failed. Please login again.");
        localStorage.removeItem("token");
      } else if (err.response?.status === 403) {
        setOrdersError("Access denied. Admin privileges required.");
      } else {
        setOrdersError("Failed to fetch orders. Please try again.");
      }
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories/`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categories/`, { name: categoryName });
      setCategoryName("");
      fetchCategories();
      alert("Category created");
    } catch (err) {
      console.error("Failed to add category", err);
      alert(err.response?.data?.message || "Error creating category");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Error deleting category");
    }
  };

  // Product Create / Update
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductMsg("");
    setProductError("");

    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      setProductError("Please fill all required fields: Name, Price, Category, Stock.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProductError("No authentication token found. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category", newProduct.category);
      formData.append("description", newProduct.description);
      if (newProduct.images && newProduct.images.length > 0) {
        newProduct.images.forEach((file) => formData.append("images", file));
      }

      if (editProductId) {
        await axios.put(`${API_URL}/products/${editProductId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setProductMsg("Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/products/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setProductMsg("Product created successfully!");
      }

      setNewProduct({ name: "", price: "", stock: "", category: "", description: "", images: [] });
      setEditProductId(null);
      setTimeout(() => {
        setProductMsg("");
        setProductError("");
        setActiveTab("products");
      }, 1500);
      fetchProducts();
    } catch (err) {
      console.error("Failed to create/update product", err);
      setProductError(err.response?.data?.message || "Failed to create/update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter((p) => p._id !== id));
      setProductMsg("Product deleted successfully!");
      setTimeout(() => setProductMsg(""), 2000);
    } catch (err) {
      console.error("Failed to delete product", err);
      setProductError("Error deleting product");
      setTimeout(() => setProductError(""), 2000);
    }
  };

  // Edit Product
  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || "",
      description: product.description,
      images: [],
    });
    setActiveTab("add-product");
  };

  // Status Change
  const handleStatusChange = async (id, newStatus) => {
    const originalOrder = orders.find(order => order._id === id);
    if (!originalOrder) return;

    setUpdatingOrderId(id);
    setOrders(prev => prev.map(order => order._id === id ? { ...order, status: newStatus } : order));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await axios.put(`${API_URL}/orders/${id}`, { status: newStatus.toLowerCase() }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.order) {
        setOrders(prev => prev.map(order => order._id === id ? response.data.order : order));
      }
    } catch (err) {
      console.error("Failed to update order status", err);
      setOrders(prev => prev.map(order => order._id === id ? originalOrder : order));
      alert(err.response?.data?.message || err.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) alert("Please login first");
  }, []);

  // Effects
  useEffect(() => {
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "dashboard") {
      fetchProducts();
      fetchCategories();
      fetchOrders();
    }
    if (activeTab === "products") {
      fetchProducts();
      fetchCategories();
    }
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Success/Error message for product actions */}
      {(productMsg || productError) && (
        <div className="w-full text-center mt-2 text-xs">
          {productMsg && (
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded shadow-sm">{productMsg}</span>
          )}
          {productError && (
            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded shadow-sm ml-2">{productError}</span>
          )}
        </div>
      )}
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-gray-900 text-white p-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern Sidebar - Absolute Positioned */}
      <aside className={`fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-30 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            <div>
              <h1 className="text-white text-xl font-bold">Canton</h1>
              <p className="text-gray-400 text-sm">Furniture Store Admin</p>
            </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                setEditProductId(null);
                setNewProduct({
                  name: "",
                  price: "",
                  stock: "",
                  category: "",
                  description: "",
                  images: [],
                });
                setActiveTab("add-product");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              <FiBox className="h-5 w-5" />
              <span className="font-medium">Add Product</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("categories");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              <FiList className="h-5 w-5" />
              <span className="font-medium">Add Category</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Navigation</h3>
          
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FiHome className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
            {activeTab === "dashboard" && (
              <div className="ml-auto h-2 w-2 bg-white rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("products");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "products" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FiBox className="h-5 w-5" />
            <span className="font-medium">Products</span>
            <span className="ml-auto bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
              {products.length}
            </span>
            {activeTab === "products" && (
              <div className="ml-2 h-2 w-2 bg-white rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("categories");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "categories" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FiList className="h-5 w-5" />
            <span className="font-medium">Categories</span>
            <span className="ml-auto bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
              {categories.length}
            </span>
            {activeTab === "categories" && (
              <div className="ml-2 h-2 w-2 bg-white rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("orders");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "orders" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FiShoppingCart className="h-5 w-5" />
            <span className="font-medium">Orders</span>
            <span className="ml-auto bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
              {orders.length}
            </span>
            {activeTab === "orders" && (
              <div className="ml-2 h-2 w-2 bg-white rounded-full"></div>
            )}
          </button>
        </nav>

        {/* Stats Summary */}
        <div className="p-4 border-t border-gray-700">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Revenue</span>
              <span className="text-green-400 font-semibold">PKR {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Active Orders</span>
              <span className="text-yellow-400 font-semibold">
                {orders.filter(o => o.status === "Pending" || o.status === "Processing").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">In Stock</span>
              <span className="text-blue-400 font-semibold">
                {products.filter(p => p.stock > 0).length}
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              alert("Logged out successfully");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-all duration-200"
          >
            <FiLogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-4 lg:p-8 min-h-screen">
        {/* Categories Management */}
        {activeTab === "categories" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Category Management</h2>
              <div className="flex gap-4">
              <input
                type="text"
                  placeholder="Search categories..."
                  className="border px-4 py-2 rounded-md"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500">
                  Export Categories
                </button>
              </div>
            </div>

            {/* Category Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                  <FiList className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Products per Category</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.length > 0 ? Math.round(products.length / categories.length) : 0}
                    </p>
                  </div>
                  <FiBox className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Most Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.length > 0 ? categories[0]?.name?.slice(0, 8) + '...' : 'N/A'}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">★</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Category Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border px-4 py-2 rounded-md flex-1"
                required
              />
              <button
                type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 flex items-center gap-2"
              >
                  <FiList className="h-4 w-4" />
                Add Category
              </button>
            </form>
            </div>

            {/* Categories Grid */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Categories</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                </tr>
              </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-lg">
                                {category.name?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                              <div className="text-sm text-gray-500">Category</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.description || 'No description'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {products.filter(p => p.category?._id === category._id || p.category === category._id).length} products
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              Edit
                            </button>
                      <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                          </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
            </div>
          </>
        )}

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
              </div>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                  Export Report
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500">
                  Generate Analytics
                </button>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold">PKR {totalRevenue.toLocaleString()}</p>
                    <p className="text-blue-100 text-sm mt-1">
                      {revenueGrowth > 0 ? `+${revenueGrowth}%` : '0%'} from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">₨</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold">{orders.length}</p>
                    <p className="text-green-100 text-sm mt-1">
                      {orderGrowth > 0 ? `+${orderGrowth}%` : '0%'} from last month
                    </p>
                  </div>
                  <FiShoppingCart className="h-12 w-12 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold">{products.length}</p>
                    <p className="text-purple-100 text-sm mt-1">
                      {productGrowth > 0 ? `+${productGrowth} new` : '0 new'} this week
                    </p>
                  </div>
                  <FiBox className="h-12 w-12 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Order Value</p>
                    <p className="text-3xl font-bold">PKR {averageOrderValue.toLocaleString()}</p>
                    <p className="text-orange-100 text-sm mt-1">
                      {conversionRate}% conversion rate
                    </p>
                  </div>
                  <FiList className="h-12 w-12 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Order Status Cards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {pendingOrders}
                </p>
              </div>
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">!</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Processing</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {processingOrders}
                </p>
              </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">⚙</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Shipped</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                  {shippedOrders}
                </p>
              </div>
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🚚</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Delivered</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {deliveredOrders}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">Cancelled</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {cancelledOrders}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                   onClick={() => {
                     setEditProductId(null);
                     setNewProduct({
                       name: "",
                       price: "",
                       stock: "",
                       category: "",
                       description: "",
                       images: [],
                     });
                     setActiveTab("add-product");
                   }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
                    <p className="text-blue-100 text-sm">Create and manage your inventory</p>
                  </div>
                  <FiBox className="h-12 w-12 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center text-blue-100 text-sm">
                  <span>Quick Add</span>
                  <span className="ml-auto">→</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                   onClick={() => setActiveTab("categories")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Manage Categories</h3>
                    <p className="text-green-100 text-sm">Organize your product catalog</p>
                  </div>
                  <FiList className="h-12 w-12 text-green-200" />
                </div>
                <div className="mt-4 flex items-center text-green-100 text-sm">
                  <span>Organize</span>
                  <span className="ml-auto">→</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                   onClick={() => setActiveTab("orders")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">View Orders</h3>
                    <p className="text-purple-100 text-sm">Track and manage customer orders</p>
                  </div>
                  <FiShoppingCart className="h-12 w-12 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center text-purple-100 text-sm">
                  <span>Track Orders</span>
                  <span className="ml-auto">→</span>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Recent Orders
              </h2>
              
              {ordersError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {ordersError}
                  <button 
                    onClick={fetchOrders}
                    className="ml-2 text-red-600 underline hover:text-red-800"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {ordersError ? "No orders to display" : "No orders found"}
                </div>
              ) : (
                <table className="min-w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{order._id}</td>
                        <td className="py-3 px-4">
                          {order.user?.name ||
                            order.shippingAddress?.fullName ||
                            "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          PKR {(order.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase() : 'Pending'}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={updatingOrderId === order._id}
                            className={`border rounded px-2 py-1 ${
                              updatingOrderId === order._id 
                                ? 'bg-gray-200 cursor-not-allowed' 
                                : 'bg-gray-50'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {updatingOrderId === order._id && (
                            <span className="ml-2 text-xs text-blue-600">Updating...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Products Management */}
        {activeTab === "products" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="border px-4 py-2 rounded-md"
                />
                <select className="border px-4 py-2 rounded-md">
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              <button
                onClick={() => {
                  setEditProductId(null);
                  setNewProduct({
                    name: "",
                    price: "",
                    stock: "",
                    category: "",
                    description: "",
                    images: [],
                  });
                  setActiveTab("add-product");
                }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 flex items-center gap-2"
              >
                  <FiBox className="h-4 w-4" />
                Add Product
              </button>
              </div>
            </div>

            {/* Product Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                  <FiBox className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.filter(p => p.stock > 0).length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.filter(p => p.stock === 0).length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                  <FiList className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                </tr>
              </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                              {/* Support both imageUrl and images fields */}
                              {(() => {
                                // Prefer imageUrl if present
                                if (product.imageUrl) {
                                  if (Array.isArray(product.imageUrl)) {
                                    const url = product.imageUrl[0];
                                    if (url) return <img src={url} alt={product.name} className="h-full w-full object-cover" />;
                                  } else if (typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
                                    return <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />;
                                  }
                                }
                                // Fallback to images array (old data)
                                if (product.images && product.images.length > 0) {
                                  const imgObj = product.images[0];
                                  // Support both {img_url: ...} and direct string
                                  const url = imgObj.img_url || imgObj;
                                  if (url) return <img src={url} alt={product.name} className="h-full w-full object-cover" />;
                                }
                                // No image
                                return <FiBox className="h-6 w-6 text-gray-400" />;
                              })()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          PKR {product.price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 10 ? 'In Stock' :
                             product.stock > 0 ? 'Low Stock' :
                             'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                      <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                          </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
            </div>
          </>
        )}

        {/* Orders Management */}
        {activeTab === "orders" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Order Management</h2>
              <div className="flex gap-4">
                <select className="border px-4 py-2 rounded-md">
                  <option value="">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500">
                  Export Orders
                </button>
              </div>
            </div>

            {/* Order Stats Cards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                  <FiShoppingCart className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pendingOrders}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">!</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {processingOrders}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">⚙</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {deliveredOrders}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      PKR {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">₨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-600">Loading orders...</p>
                        </td>
                      </tr>
                    ) : ordersError ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center">
                          <div className="text-red-600 mb-2">{ordersError}</div>
                          <button 
                            onClick={fetchOrders}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            Retry
                          </button>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id?.slice(-8) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {(order.user?.name || order.shippingAddress?.fullName || 'N/A').charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.user?.name || order.shippingAddress?.fullName || 'Guest User'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.user?.email || order.shippingAddress?.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.orderItems?.length || 0} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            PKR {(order.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <select
                              value={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase() : 'Pending'}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              disabled={updatingOrderId === order._id}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                updatingOrderId === order._id 
                                  ? 'bg-gray-200 cursor-not-allowed' 
                                  : (order.status && order.status.toLowerCase()) === 'delivered' ? 'bg-green-100 text-green-800' :
                                  (order.status && order.status.toLowerCase()) === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  (order.status && order.status.toLowerCase()) === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  (order.status && order.status.toLowerCase()) === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            {updatingOrderId === order._id && (
                              <span className="ml-2 text-xs text-blue-600">Updating...</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Add / Edit Product */}
        {activeTab === "add-product" && (
          <div className="max-w-4xl mx-auto">
            {/* Modern Card Container */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <FiBox className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {editProductId ? "Edit Product" : "Add New Product"}
                      </h2>
                      <p className="text-amber-100 text-sm">
                        {editProductId ? "Update product information" : "Create a new furniture product"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("products");
                      setEditProductId(null);
                      setNewProduct({
                        name: "",
                        price: "",
                        stock: "",
                        category: "",
                        description: "",
                        images: [],
                      });
                    }}
                    className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  {/* Product Images Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            images: Array.from(e.target.files),
                          })
                        }
                        className="hidden"
                        id="product-images"
                      />
                      <label htmlFor="product-images" className="cursor-pointer">
                        <div className="space-y-2">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-amber-600 hover:text-amber-500">Click to upload</span> or drag and drop
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                        </div>
                      </label>
                    </div>
                    {newProduct.images && newProduct.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newProduct.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = newProduct.images.filter((_, i) => i !== index);
                                setNewProduct({ ...newProduct, images: newImages });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                        min="0"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Category *
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Product Description
                    </label>
                    <textarea
                      placeholder="Describe the product features, materials, dimensions, etc."
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  {(productMsg || productError) && (
                    <div className="w-full text-center mb-2">
                      {productMsg && (
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-xs shadow">{productMsg}</span>
                      )}
                      {productError && (
                        <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded text-xs shadow ml-2">{productError}</span>
                      )}
                    </div>
                  )}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("products");
                        setEditProductId(null);
                        setNewProduct({
                          name: "",
                          price: "",
                          stock: "",
                          category: "",
                          description: "",
                          images: [],
                        });
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      {editProductId ? "Update Product" : "Create Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => {
              setEditProductId(null);
              setNewProduct({
                name: "",
                price: "",
                stock: "",
                category: "",
                description: "",
                images: [],
              });
              setActiveTab("add-product");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            title="Add New Product"
          >
            <FiBox className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            title="Manage Categories"
          >
            <FiList className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
