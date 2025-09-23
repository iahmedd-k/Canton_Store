import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL; 
import { useFilters } from "../context/FiltersContext.jsx";
import { useQuery } from "@tanstack/react-query";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { selectedCategory, setSelectedCategory, searchTerm, setSearchTerm } = useFilters() || { selectedCategory: '', setSelectedCategory: () => {}, searchTerm: '', setSearchTerm: () => {} };
  const [loading, setLoading] = useState(true);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
  const res = await axios.get(`${API_URL}/products/`);
  return res.data.products || [];
    },
    staleTime: 1000 * 60,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
  const res = await axios.get(`${API_URL}/categories/`);
  return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
      // Debug: log product imageUrl values
      console.log('Fetched products:', productsData.map(p => ({ name: p.name, imageUrl: p.imageUrl })));
    }
    if (categoriesData) setCategories(categoriesData);
    setLoading(productsLoading || categoriesLoading);
  }, [productsData, categoriesData, productsLoading, categoriesLoading]);

  // Handle search from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
                           (typeof product.category === "object" 
                             ? product.category._id === selectedCategory
                             : product.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section className="px-6 lg:px-20 py-20 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Our Product Collection
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium furniture and home decor
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md md:max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 md:px-6 py-3 pl-10 md:pl-12 pr-4 bg-gray-50 text-gray-900 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm md:text-base"
                />
                <svg 
                  className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Mobile Category Filter */}
          <div className="lg:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                    !selectedCategory
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                      selectedCategory === category._id
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Categories */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    !selectedCategory
                      ? "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category._id
                        ? "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 md:mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory && ` in ${categories.find(c => c._id === selectedCategory)?.name}`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    state={{ product }}
                    className="group"
                  >
                    <ProductCard product={product} categories={categories} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <div className="text-gray-400 text-4xl md:text-6xl mb-4">🔍</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm md:text-base">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;