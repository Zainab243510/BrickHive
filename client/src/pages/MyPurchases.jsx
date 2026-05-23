import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaSpinner, FaShoppingBag } from "react-icons/fa";

export default function MyPurchases() {
  const token = useSelector((state) => state.user.token);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/payments/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Could not load purchases");
        } else {
          setPurchases(data);
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
          <FaShoppingBag /> My Purchases
        </h1>

        {loading && (
          <div className="flex justify-center text-3xl text-slate-500 animate-spin">
            <FaSpinner />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && purchases.length === 0 && (
          <p className="text-slate-600 dark:text-slate-300">
            You haven't purchased any properties yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {purchases.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow p-4 flex gap-4"
            >
              {p.listing?.imageUrls?.[0] && (
                <img
                  src={p.listing.imageUrls[0]}
                  alt={p.listing.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/listing/${p.listing?._id}`}
                  className="font-semibold text-slate-800 dark:text-slate-100 truncate block hover:underline"
                >
                  {p.listing?.name || "Listing"}
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {p.listing?.address}
                </p>
                <p className="mt-2 font-bold text-green-700 dark:text-green-400">
                  Rs. {p.amount.toLocaleString()}
                  {p.fee > 0 && (
                    <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                      (fee Rs. {p.fee.toLocaleString()})
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Order <span className="font-mono">{p.gatewayOrderId}</span>
                  {p.gatewayTxnId && (
                    <>
                      {" · "}Txn <span className="font-mono">{p.gatewayTxnId}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(p.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
