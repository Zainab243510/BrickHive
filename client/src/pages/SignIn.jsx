import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  noError,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser, isLoading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(noError());
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill in all fields."));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      dispatch(signInFailure("Please enter a valid email address."));
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || "Authentication failed."));
        return;
      }

      dispatch(signInSuccess(data));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      dispatch(signInFailure("An error occurred. Please try again."));
      console.error("SignIn Error:", err);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-white dark:from-slate-950 to-slate-100 dark:to-slate-900 flex justify-center items-center px-4">
      <div className="w-full max-w-md p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl animate-fade-in-down">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            disabled={isLoading}
            type="submit"
            className="w-full py-3 mt-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold rounded-lg hover:bg-slate-950 dark:hover:bg-slate-100 transition-all shadow-md hover:shadow-lg uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
          <OAuth />

          <p className="text-center text-sm text-slate-700 dark:text-slate-200 mt-4 font-semibold">
            Don’t have an account?
            <Link
              to="/sign-up"
              className="text-slate-900 dark:text-white hover:underline ml-1 font-bold"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
