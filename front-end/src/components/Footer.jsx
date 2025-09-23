import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
  <footer className="bg-gray-900 text-gray-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-2 rounded-lg shadow-md">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">Canton</h2>
                <p className="text-sm text-amber-400">Furniture Store</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Crafting beautiful living spaces with premium furniture and elegant
              home decor. Transform your house into a home with our curated collection
              of quality furniture pieces.
            </p>
            <div className="flex gap-4 text-xl text-gray-400">
              <FaFacebookF className="hover:text-amber-500 cursor-pointer transition-colors duration-200" />
              <FaInstagram className="hover:text-amber-500 cursor-pointer transition-colors duration-200" />
              <FaTwitter className="hover:text-amber-500 cursor-pointer transition-colors duration-200" />
              <FaPinterestP className="hover:text-amber-500 cursor-pointer transition-colors duration-200" />
            </div>
          </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to='/home' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Home</Link></li>
            <li><Link to='/products' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Furniture Collection</Link></li>
            <li><Link to='/about' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">About Us</Link></li>
            <li><Link to='/contact' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Contact</Link></li>
            <li><Link to='/cart' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Furniture Categories</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to='/products?category=Living Room' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">House Interior</Link></li>
            <li><Link to='/products?category=Bedroom' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Office Interior</Link></li>
            <li><Link to='/products?category=Dining' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Shops Interior</Link></li>
            <li><Link to='/products?category=Outdoor' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Outdoor</Link></li>
            <li><Link to='/products?category=Storage' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Storage</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 mt-0.5">📍</span>
              <span>Shop 1 i8 Markaz, Islamabad, Pakistan</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-amber-400">📞</span>
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-amber-400">📧</span>
              <span>info@cantonfurniture.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-amber-400">🕒</span>
              <span>Mon-Sat: 9AM-8PM</span>
            </li>
            <li><Link to='/contact' className="hover:text-amber-400 cursor-pointer transition-colors duration-200">Help Center</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 lg:mt-12 border-t border-gray-700 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Canton Furniture Store. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-amber-400 transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-400 transition-colors duration-200">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-amber-400 transition-colors duration-200">Shipping Info</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Arrow */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-amber-600 to-amber-800 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 border-2 border-amber-300"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
    </footer>
  );
};

export default Footer;
