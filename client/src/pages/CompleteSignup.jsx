import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function CompleteSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const googleData = location.state?.googleData;

  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!googleData) {
    return <Navigate to="/sign-up" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const phoneRegex = /^[0-9+\s\-]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number (7–20 digits, may include +, spaces, hyphens).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...googleData, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not complete sign-up.");
        setLoading(false);
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.error("Complete sign-up error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 dark:from-slate-900 to-white dark:to-slate-950 flex justify-center items-center px-4">
      <div className="w-full max-w-md p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          One more step
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
          We need a contact number so buyers can reach you about your listings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={phone}
              placeholder="e.g. 0300 1234567 or +92 300 1234567"
              className="w-full px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 mt-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold rounded-lg hover:bg-slate-950 dark:hover:bg-slate-100 transition-all shadow-md hover:shadow-lg uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Finish sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
