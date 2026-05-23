import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (!orderId || !token) return;
    // Best-effort: tell the backend the user bailed so the order isn't left pending.
    fetch(`/api/payments/cancel/${orderId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }, [orderId, token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Payment cancelled
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          You cancelled the payment before it completed. No charge has been made.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-md font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
