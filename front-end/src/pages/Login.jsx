import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");
  setLoading(true);

  try {
    // basic validation
    if (!email || !password || (!isLogin && !fullName)) {
      setErrorMsg("All fields are required");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/users/login" : "/users/signup";
    const payload = isLogin
      ? { email, password }
      : { name: fullName, email, password };

    // <-- debug: show what we send
    console.log("Auth payload:", payload);

    const res = await axios.post(`${API_URL}${endpoint}`, payload);

    // <-- debug: show server response
    console.log("Auth response status:", res.status);
    console.log("Auth response data:", res.data);

    // Try multiple common places for token & user id
    const token =
      res.data?.token ??
      res.data?.accessToken ??
      res.data?.access_token ??
      res.data?.data?.token;

    // Backend returns user as { id, email, role }
    const userId =
      res.data?.user?.id ??
      res.data?.user?._id ??
      res.data?.userId ??
      res.data?.id ??
      res.data?._id ??
      res.data?.data?.user?._id;

    // If we got both token and userId, proceed
    if (token && userId) {
      auth?.login?.(token, userId);
      setSuccessMsg(isLogin ? "Login successful!" : "Signup successful!");
      navigate("/home");
      return;
    }

    // Require a token for navigation to avoid redirecting without auth
    if (!token) {
      setErrorMsg("Authentication succeeded but no token returned.");
      return;
    }

    // fallback — show server-provided message if present, otherwise show raw response for debugging
    const serverMsg = res.data?.message;
    setErrorMsg(serverMsg || `Unexpected server response: ${JSON.stringify(res.data).slice(0,300)}`);
  } catch (err) {
    console.error("Auth error:", err);
    // show server error message if available
    setErrorMsg(err.response?.data?.message || err.message || "Authentication failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    // ⚠️ your same JSX design kept as-is
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white py-8 md:py-16 px-4 sm:px-6">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left Image Section (unchanged) */}
        <div className="hidden md:block relative">
          <img
            src="https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg"
            alt="Furniture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome to Canton</h3>
            <p className="text-amber-100">Premium Furniture Store</p>
          </div>
        </div>

        {/* Right Form Section (unchanged UI, logic cleaned) */}
        <div className="p-6 md:p-8 lg:p-10">
          <div className="text-center md:text-left mb-6 md:mb-8">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-2 rounded-lg shadow-md">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Canton</h1>
                <p className="text-xs text-amber-600">Furniture Store</p>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin
                ? "Login to explore luxury furniture & interiors"
                : "Sign up to start your journey with premium designs"}
            </p>
          </div>

          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3 md:py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>

            {(successMsg || errorMsg) && (
              <div className="w-full text-center mt-2">
                {successMsg && (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm shadow">{successMsg}</span>
                )}
                {errorMsg && (
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded text-sm shadow ml-2">{errorMsg}</span>
                )}
              </div>
            )}

            <p className="text-sm text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 font-medium ml-1 hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );

}
export default AuthPage;
