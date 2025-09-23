import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiGrid, FiShoppingBag, FiUser, FiSettings, FiLogOut, FiChevronRight } from "react-icons/fi";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const Sidebar = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories/`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: FiHome },
    { name: "All Products", href: "/products", icon: FiGrid },
    { name: "Cart", href: "/cart", icon: FiShoppingBag },
    { name: "Profile", href: "/profile", icon: FiUser },
  ];

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Mobile Only */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-2 rounded-lg shadow-md">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Canton</h2>
                <p className="text-xs text-amber-600">Furniture Store</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Categories Section */}
          <div className="px-4 py-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-1">
              <Link
                to="/products"
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname === "/products" && !location.search
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>All Categories</span>
                <FiChevronRight className="h-4 w-4" />
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors ${
                    location.search.includes(category._id)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{category.name}</span>
                  <FiChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Section */}
          {isLoggedIn && (
            <div className="px-4 py-6 border-t border-gray-200">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <FiSettings className="h-5 w-5 mr-3" />
                Admin Dashboard
              </Link>
            </div>
          )}

          {/* Logout */}
          {isLoggedIn && (
            <div className="px-4 py-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
