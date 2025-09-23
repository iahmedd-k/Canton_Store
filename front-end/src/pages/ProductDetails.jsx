import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { useParams, useLocation, Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft, FiShare2, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw, FiUser, FiMessageCircle, FiBox } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const [categories, setCategories] = useState([]);

  
  // Fetch categories for category name resolution
  useEffect(() => {
    const fetchCategories = async () => {
      try {
    const res = await axios.get(`${API_URL}/categories/`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewError, setReviewError] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!product);
  const [selectedImage, setSelectedImage] = useState(0);
  // Normalize imageUrl or images to array for display (backward compatible)
  const productImages = (() => {
    if (!product) return [];
    // Prefer imageUrl if present
    if (product.imageUrl) {
      if (Array.isArray(product.imageUrl)) return product.imageUrl.filter(Boolean);
      if (typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') return [product.imageUrl];
    }
    // Fallback to images array (old data)
    if (Array.isArray(product.images)) return product.images.filter(Boolean);
    return [];
  })();
  // Debug: log productImages and product image fields
  useEffect(() => {
    console.log('ProductDetails debug:', {
      id: product?._id,
      name: product?.name,
      imageUrl: product?.imageUrl,
      images: product?.images,
      productImages
    });
  }, [product, productImages]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "", email: "" });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { addToCart } = useCart();

  const { data: fetchedProduct, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', id],
    enabled: !product,
    queryFn: async () => {
  const res = await axios.get(`${API_URL}/products/${id}`);
      return res.data.product || res.data;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (fetchedProduct && !product) setProduct(fetchedProduct);
    setLoading(!product && loadingProduct);
  }, [fetchedProduct, loadingProduct, product]);

  useEffect(() => {
    if (product) {
      // Fetch related products
      const fetchRelatedProducts = async () => {
        try {
          const res = await axios.get(`${API_URL}/products/`);
          const related = res.data.products
            .filter(p => p._id !== product._id && 
              (p.category?._id === product.category?._id || p.category === product.category))
            .slice(0, 4);
          setRelatedProducts(related);
        } catch (err) {
          console.error("Error fetching related products:", err);
        }
      };

      // Fetch reviews from backend
      const fetchReviews = async () => {
        try {
          const res = await axios.get(`${API_URL}/products/${product._id}/reviews`);
          setReviews(res.data.reviews || []);
        } catch (err) {
          console.error("Error fetching reviews:", err);
          // Fallback to empty array if no reviews exist
          setReviews([]);
        }
      };

      fetchRelatedProducts();
      fetchReviews();
    }
  }, [product]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `PKR ${price.toLocaleString()}`;
    }
    return price;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewMsg("");
    setReviewError("");
    if (newReview.name && newReview.comment) {
      try {
        const reviewData = {
          ...newReview,
          productId: product._id
        };
  const res = await axios.post(`${API_URL}/products/${product._id}/reviews`, reviewData);
        setReviews([res.data.review, ...reviews]);
        setNewReview({ rating: 5, comment: "", name: "", email: "" });
        setReviewMsg("Review submitted successfully!");
        setTimeout(() => {
          setReviewMsg("");
          setShowReviewForm(false);
        }, 1500);
      } catch (err) {
        console.error("Error submitting review:", err);
        setReviewError(err.response?.data?.message || "Failed to submit review. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 overflow-x-auto">
            <Link to="/" className="hover:text-amber-600 whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-amber-600 whitespace-nowrap">Products</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
              {productImages.length > 0 ? (
                <img
                  src={productImages[selectedImage]?.img_url || productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-100">
                  <FiBox className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Image Navigation */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                        index === selectedImage ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 md:top-4 md:right-4 bg-white p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FiHeart className={`h-5 w-5 md:h-6 md:w-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {productImages.map((imgObj, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                      index === selectedImage ? 'border-amber-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={imgObj?.img_url || imgObj}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-16 md:h-20 object-cover"
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-xs md:text-sm font-medium text-amber-600 bg-amber-50 px-2 md:px-3 py-1 rounded-full">
                  {(() => {
                    const cat = product.category;
                    if (typeof cat === 'object' && cat !== null) {
                      return cat.name || 'Uncategorized';
                    }
                    if (typeof cat === 'string' && cat.trim() !== '') {
                      const found = categories.find(c => c._id === cat);
                      if (found?.name) return found.name;
                      return 'Category';
                    }
                    return 'Uncategorized';
                  })()}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FiShare2 className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    // Calculate average rating from reviews, default to 5 if no reviews
                    const averageRating = reviews && reviews.length > 0 
                      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                      : 5; // Default 5 stars for products without reviews
                    
                    return (
                      <FiStar
                        key={i}
                        className={`h-4 w-4 md:h-5 md:w-5 ${
                          i < Math.round(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-sm md:text-base text-gray-600">
                  ({reviews && reviews.length > 0 
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                    : '5.0'
                  } rating)
                </span>
                <span className="text-gray-400 hidden md:inline">•</span>
                <span className="text-sm md:text-base text-gray-600">{reviews.length} reviews</span>
              </div>

              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {formatPrice(product.price)}
              </div>
              
              {product.stock > 0 && (
                <p className="text-green-600 font-medium text-sm md:text-base">
                  ✓ {product.stock} in stock
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-red-600 font-medium text-sm md:text-base">
                  ✗ Out of stock
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center text-sm md:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl"
                >
                  <FiShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Add to Cart</span>
                </button>
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 font-medium">Successfully added {quantity} item(s) to cart!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiTruck className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Free Shipping</p>
                  <p className="text-xs md:text-sm text-gray-600">On orders over PKR 5,000</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiShield className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Secure Payment</p>
                  <p className="text-xs md:text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiRefreshCw className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Easy Returns</p>
                  <p className="text-xs md:text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 md:mt-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Customer Reviews</h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 flex items-center space-x-2 text-sm md:text-base"
              >
                <FiMessageCircle className="h-4 w-4" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                      <input
                        type="email"
                        value={newReview.email}
                        onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="text-2xl"
                        >
                          <FiStar className={`h-6 w-6 ${
                            star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    {(reviewMsg || reviewError) && (
                      <div className="w-full text-center mt-2">
                        {reviewMsg && (
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm shadow">{reviewMsg}</span>
                        )}
                        {reviewError && (
                          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded text-sm shadow ml-2">{reviewError}</span>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-semibold text-gray-900">{review.name}</h5>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Related Products</h3>
              <p className="text-gray-600 text-sm md:text-base">You might also like these products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  state={{ product: relatedProduct }}
                  className="group"
                >
                  <ProductCard product={relatedProduct} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;