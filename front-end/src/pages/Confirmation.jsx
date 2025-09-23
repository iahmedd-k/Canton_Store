import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome, FiUser } from "react-icons/fi";

const Confirmation = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/profile");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <FiCheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase! Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <p className="text-gray-700">You'll receive an order confirmation email shortly</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <p className="text-gray-700">We'll prepare your order for shipping</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <p className="text-gray-700">You'll get tracking information once shipped</p>
              </div>
            </div>
          </div>

          {/* Guest Account Prompt */}
          {!isLoggedIn && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl mb-8">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">Create an account to track your order</h3>
              <p className="text-yellow-700 mb-4">Save your details for next time and easily track your order status.</p>
              <Link
                to="/signup"
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FiUser className="h-5 w-5" />
              <span>View My Orders</span>
            </Link>
            <Link
              to="/products"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <FiShoppingBag className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
            <Link
              to="/"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <FiHome className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
          </div>

          {/* Auto Redirect Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Redirecting to your profile in <span className="font-semibold text-blue-600">{countdown}</span> seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;