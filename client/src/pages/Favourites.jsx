import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../redux/user/favoriteSlice";
import axios from "axios";
import ListingItem from "../components/ListingItem";
import { toast } from "react-hot-toast";

function Favourites() {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites.items);
  const token = useSelector((state) => state.user.token);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (favoriteIds.length === 0) return;

    const fetchListings = async () => {
      setLoadingListings(true);
      setError(null);

      try {
        const res = await axios.get("http://localhost:3000/api/listings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredFavorites = res.data.filter((listing) =>
          favoriteIds.includes(listing._id)
        );

        setFavoriteListings(filteredFavorites);
      } catch (err) {
        setError("Failed to load listings.");
        toast.error("Failed to load listings.");
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, [favoriteIds, token]);

  return (
    <div className="min-h-[92vh] mx-auto px-4 py-8 bg-gradient-to-br from-white dark:from-slate-950 to-slate-100 dark:to-slate-900">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-8">
        Your Favorite Listings
      </h2>

      {loadingListings && (
        <div className="flex justify-center items-center mb-8">
          <div
            className="w-16 h-16 border-4 border-t-4 border-slate-900 dark:border-white border-dotted rounded-full animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>
      )}

      {error && (
        <div className="text-center text-lg text-red-500 mb-8">{error}</div>
      )}
      {!loadingListings && !error && favoriteListings.length === 0 && (
        <div className="text-center text-lg text-slate-700 dark:text-slate-200 mb-8">
          No favorite listings at the moment.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favoriteListings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

export default Favourites;
