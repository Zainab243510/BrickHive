import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteAsync,
  removeFavoriteAsync,
} from "../redux/user/favoriteSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListingItem({ listing }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const token = useSelector((state) => state.user.token);
  const [isFavoritedLocal, setIsFavoritedLocal] = useState(false);

  useEffect(() => {
    if (listing?._id) {
      const isFavorited = favorites.includes(listing._id);
      setIsFavoritedLocal(isFavorited);
    }
  }, [favorites, listing?._id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();

    const previousState = isFavoritedLocal;
    setIsFavoritedLocal(!previousState);

    try {
      if (previousState) {
        await dispatch(
          removeFavoriteAsync({ listingId: listing._id })
        ).unwrap();
        toast("Removed from favorites", {
          icon: "💔",
          style: {
            background: "#fee2e2",
            color: "#b91c1c",
          },
        });
      } else {
        await dispatch(addFavoriteAsync({ listingId: listing._id })).unwrap();
        toast("Added to favorites", {
          icon: "❤️",
          style: {
            background: "#dcfce7",
            color: "#166534",
          },
        });
      }
    } catch (err) {
      setIsFavoritedLocal(previousState); // Revert on error
      console.error("Favorite toggle failed:", err);
      toast.error("Failed to update favorite. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full h-full overflow-hidden group relative">
      <Link to={`/listing/${listing._id}`}>
        <div className="relative">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="h-[220px] w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {listing.offer && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              OFFER
            </span>
          )}
          {listing.status && listing.status !== "available" && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="bg-red-600 text-white text-lg font-extrabold uppercase tracking-wider px-4 py-1 rounded shadow-lg">
                {listing.status === "rented" ? "Rented" : "Sold"}
              </span>
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3">
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate">
            {listing.name}
          </p>

          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 text-sm">
            <MdLocationOn className="w-5 h-5" />
            <p className="truncate text-slate-600 dark:text-slate-300">{listing.address}</p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {listing.description}
          </p>

          <div className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-2">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === "rent" && (
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {" "}
                / month
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
            <span>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </span>
            <span>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleFavoriteToggle}
          className="text-red-600 text-2xl bg-white/90 dark:bg-slate-800/90 rounded-full p-2 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
        >
          {isFavoritedLocal ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
}
