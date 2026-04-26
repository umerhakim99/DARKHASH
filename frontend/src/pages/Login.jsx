import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, LockKeyhole } from "lucide-react";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(form);

      if (data.user?.is_staff) {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16 md:py-24 animate-fade-up">
      <div className="mb-8 text-center">
        <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs">
          Welcome Back
        </p>

        <h1 className="font-luxury text-5xl mt-3">Login</h1>

        <p className="text-gray-400 mt-3">
          Access your orders, wishlist, and saved delivery details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-panel p-6 md:p-7 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <label className="block">
          <span className="block text-sm text-gray-300 mb-2 font-medium">
            Email Address
          </span>

          <div className="relative">
            <span className="field-icon-box">
              <Mail size={17} strokeWidth={2.2} />
            </span>

            <input
              className="input-dark input-with-icon w-full"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="block text-sm text-gray-300 mb-2 font-medium">
            Password
          </span>

          <div className="relative">
            <span className="field-icon-box">
              <LockKeyhole size={17} strokeWidth={2.2} />
            </span>

            <input
              className="input-dark input-with-icon w-full"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
        </label>

        <button className="btn-gold w-full py-3 rounded-xl">
          Login
        </button>

        <p className="text-sm text-gray-400 text-center">
          No account?{" "} <h6></h6>
          <Link to="/register" className="text-[#D4AF37] hover:text-[#f5d879]">
          Create one
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Login;