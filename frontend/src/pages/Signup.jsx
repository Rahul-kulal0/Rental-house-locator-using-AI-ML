/*import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  return (
    <AuthLayout title="Create Account">
      <form className="space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg focus:ring-2 ring-blue-400"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:ring-2 ring-blue-400"
        />

        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Sign Up
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}*/
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Your Account">
      <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
        
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg animate-shake">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">👤 Full Name</label>
          <input 
            type="text"
            placeholder="Enter your full name" 
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">📧 Email Address</label>
          <input 
            type="email"
            placeholder="Enter your email" 
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">🔒 Password</label>
          <input 
            type="password" 
            placeholder="Create a strong password" 
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength="6"
          />
          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-all">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

