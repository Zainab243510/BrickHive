import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link ,useNavigate} from "react-router-dom";
import { set } from "mongoose";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(null);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setError("Please fill in all fields.");
      return;
    }

    if(formData.username.length < 3) {
      setError("Username must be at least 3 characters long.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^[0-9+\s\-]{7,20}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number (7–20 digits, may include +, spaces, hyphens).");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try{
      setLoading(true);
      
      console.log(formData);  

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
  setError("Something went wrong. Please try again.");
  console.error("Signup Error:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 dark:from-slate-900 to-white dark:to-slate-950 flex justify-center items-center px-4">
      <div className="w-full max-w-md p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl animate-fade-in-down">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. z_jalali"
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-1"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 0300 1234567 or +92 300 1234567"
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-10 rounded-lg bg-white/80 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center -mt-2">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 mt-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold rounded-lg hover:bg-slate-950 dark:hover:bg-slate-100 transition-all shadow-md hover:shadow-lg uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <OAuth/>
          <p className="text-center gap-2 text-sm text-slate-700 dark:text-slate-200 mt-4 font-semibold">
            Already have an account?
            <Link
              to={"/sign-in"}
              className="text-slate-900 dark:text-white hover:underline ml-1 font-bold "
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
