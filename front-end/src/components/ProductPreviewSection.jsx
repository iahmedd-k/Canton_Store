import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Make sure this path is correct
import axios from "axios";

const ProductPreviewSection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
             await axios.get(`${API_URL}/products/`),
          await axios.get(`${API_URL}/categories/`)
        ]);
        setProducts(pRes.data.products || []);
        setCategories(cRes.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, []);

  // Show first 12 products (2 rows if 6 columns per row)
  const previewProducts = products.slice(0, 12);

  return (
    <section className="bg-gradient-to-br from-white to-amber-50 py-12 md:py-16 px-4 sm:px-6 lg:px-20">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Explore our hand-picked furniture catalog
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
        {previewProducts.map((product) => (
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

      {/* Button */}
      <div className="text-center mt-8 md:mt-12">
        
        <Link to="/products">
          <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            View All Products
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
