import { useState, useRef, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.jsx";
import { useFilters } from "../context/FiltersContext.jsx";

const Navbar = ({ onMenuClick }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { searchTerm: globalSearch, setSearchTerm: setGlobalSearch } = useFilters() || { searchTerm: '', setSearchTerm: () => {} };
  const [searchTerm, setSearchTerm] = useState(globalSearch || "");
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const { isLoggedIn, isAdmin, logout } = useAuth() || { isLoggedIn: false, isAdmin: false, logout: () => {} };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    setGlobalSearch(term);
    navigate(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-amber-700 group-hover:text-amber-800 transition-colors">
                Canton
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">Furniture Store</p>
            </div>
          </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
          <Link to="/home" className="hover:text-amber-600 transition-colors duration-200 font-semibold">Home</Link>
          <Link to="/products" className="hover:text-amber-600 transition-colors duration-200 font-semibold">Furniture</Link>
          <Link to="/about" className="hover:text-amber-600 transition-colors duration-200 font-semibold">About Us</Link>
          <Link to="/contact" className="hover:text-amber-600 transition-colors duration-200 font-semibold">Contact</Link>
        </nav>

        {/* Icons Section */}
        <div className="flex items-center gap-3 lg:gap-5 text-gray-600 text-xl relative">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-amber-600 hover:bg-gray-100 transition-colors"
          >
            <FiSearch className="h-5 w-5" />
          </button>

          {/* Search Bar - Desktop */}
          <div className="relative hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </form>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 lg:hidden z-50">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search furniture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  autoFocus
                />
              </form>
            </div>
          )}

 {/* Cart Icon with Badge */}
          <div className="relative">
            <Link to="/cart">
              <FiShoppingCart className="cursor-pointer hover:text-blue-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>


          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <FiUser
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-5 w-5 cursor-pointer hover:text-amber-600 transition-colors"
              />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg py-2 text-sm z-50 border border-gray-200">
                {isLoggedIn && isAdmin ? (
                  <>
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="block w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      View Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : isLoggedIn ? (
                  <>
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/login");
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      Login
                    </button>
                    
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </header>
  );
};

export default Navbar;
