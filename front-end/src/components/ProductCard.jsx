import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const ProductCard = ({ product, categories = [] }) => {
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  // Derive rating stats from backend-calculated fields when available
  const derivedReviewCount =
    Number.isFinite(product?.ratingsQuantity)
      ? product.ratingsQuantity
      : (product.reviews?.length || 0);

  const derivedAverageRating = (() => {
    if (Number.isFinite(product?.ratingsAverage) && product.ratingsAverage > 0) {
      return product.ratingsAverage;
    }
    if (product?.reviews && product.reviews.length > 0) {
      const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / product.reviews.length;
    }
    return 0;
  })();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `PKR ${price.toLocaleString()}`;
    }
    return price;
  };

  // Handle image loading with fallback
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  };

  return (
    <div className="relative">
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={(() => {
              // Prefer imageUrl if present
              if (product.imageUrl) {
                if (Array.isArray(product.imageUrl)) {
                  const url = product.imageUrl[0];
                  if (url) return url;
                } else if (typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
                  return product.imageUrl;
                }
              }
              // Fallback to images array (old data)
              if (product.images && product.images.length > 0) {
                const imgObj = product.images[0];
                // Support both {img_url: ...} and direct string
                const url = imgObj.img_url || imgObj;
                if (url) return url;
              }
              // No image
              return 'https://via.placeholder.com/300x300?text=No+Image';
            })()}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
          
          {/* Wishlist Button */}
          <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
            <FiHeart size={14} />
          </button>

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Low Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          <div className="mb-1">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {(() => {
                const categoryValue = product.category;
                // If populated object
                if (typeof categoryValue === 'object' && categoryValue !== null) {
                  return categoryValue.name || 'Uncategorized';
                }
                // If string id, try to resolve from provided categories list
                if (typeof categoryValue === 'string') {
                  const found = categories.find((c) => c._id === categoryValue);
                  if (found?.name) return found.name;
                  // Avoid showing raw id
                  return 'Uncategorized';
                }
                return 'Uncategorized';
              })()}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(derivedAverageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({derivedAverageRating > 0 ? derivedAverageRating.toFixed(1) : '0.0'}) • {derivedReviewCount} reviews
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-bounce">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Added to cart!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
