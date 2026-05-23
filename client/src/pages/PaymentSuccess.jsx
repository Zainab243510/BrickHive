import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

// Stripe redirects the buyer here after Checkout. The webhook is what actually
// marks the order paid, so we poll our backend until status is final.
export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = useSelector((state) => state.user.token);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id");
      return;
    }

    let cancelled = false;
    let timer;

    const poll = async () => {
      attemptsRef.current += 1;
      try {
        const res = await fetch(`/api/payments/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.message || "Could not load order");
          return;
        }

        setPayment(data);
        // Stop polling once status is final, or after ~30s of waiting on IPN.
        if (data.status !== "pending" || attemptsRef.current >= 15) return;
        timer = setTimeout(poll, 2000);
      } catch (err) {
        if (!cancelled) setError("Network error");
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center">
        {error && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
          </>
        )}

        {!error && (!payment || payment.status === "pending") && (
          <>
            <FaSpinner className="text-amber-500 text-5xl mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Confirming your payment…
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We're waiting for Stripe to confirm the transaction. This usually
              takes a few seconds.
            </p>
          </>
        )}

        {payment && payment.status === "success" && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Payment successful
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              Order <span className="font-mono">{payment.gatewayOrderId}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-200 font-semibold mb-6">
              Rs. {payment.amount.toLocaleString()} paid for "
              {payment.listing?.name}"
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/my-purchases"
                className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-md font-semibold"
              >
                My Purchases
              </Link>
              <Link
                to="/"
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {payment && (payment.status === "failed" || payment.status === "cancelled") && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Payment {payment.status}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              No charge was completed. You can try again from the listing page.
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-md font-semibold"
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
