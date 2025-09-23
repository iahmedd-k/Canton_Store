import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, increment, decrement, remove, getTotal } = useCart();

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-800">
          Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-gray-400 text-4xl md:text-6xl mb-4">🛒</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm md:text-base mb-6">Add some items to get started</p>
            <Link to="/products">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-medium">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-lg rounded-xl p-4 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0].img_url : 'https://via.placeholder.com/120x120?text=No+Image'}
                      alt={item.name}
                      className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/120x120?text=No+Image';
                      }}
                    />
                    <div className="flex-1 w-full">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Price: PKR {item.price.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => decrement(item._id)}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 border border-gray-200 rounded-lg min-w-[40px] text-center text-sm md:text-base font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increment(item._id)}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="font-semibold text-amber-600 text-sm md:text-base">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <button
                            onClick={() => remove(item._id)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 h-fit">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-700">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>PKR {getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-base md:text-lg">
                <span>Total</span>
                <span className="text-amber-600">
                  PKR {getTotal().toLocaleString()}
                </span>
              </div>
              <Link to="/checkout">
                <button className="mt-6 w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 md:py-4 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;