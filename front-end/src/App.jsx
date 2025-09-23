import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Signup = lazy(() => import('./pages/Signup'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import AdminDashboard from './pages/Dashboard';
import CartPage from './pages/Cart';
import Profile from './pages/Profile';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext.jsx';
import CheckOut from './pages/CheckOut';
import Confirmation from './pages/Confirmation';

function App() {
  const { isLoggedIn } = useAuth() || { isLoggedIn: false };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar - Only on mobile */}
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
          
          {/* Main Content */}
          <div className="flex flex-col min-h-screen">
            <Navbar onMenuClick={handleMenuClick} />
            <main className="flex-1">
              <Suspense fallback={<div className="py-12 text-center text-gray-600">Loading...</div>}>
              <Routes>
                {/* Always redirect root to /home */}
                <Route path='/' element={<Navigate to="/home" />} />
                <Route path='/login' element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />

                <Route path='/home' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/about' element={<About />} />
                <Route path='/products' element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path='/dashboard' element={<AdminDashboard />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path='/checkout' element={<CheckOut />} />
                <Route path='/confirmation' element={<Confirmation />} />
                <Route path="/logout" element={<Login />} />
              </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </div>
      </CartProvider>
    </>
  );
}

export default App;
