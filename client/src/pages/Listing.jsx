import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Correct import
import { Autoplay } from "swiper/modules"; // Correct import
import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  addFavoriteAsync,
  removeFavoriteAsync,
  fetchFavorites
} from "../redux/user/favoriteSlice";
import toast from 'react-hot-toast';




import {
  FaBed,
  FaBath,
  FaCouch,
  FaCar,
  FaMapMarkerAlt,
  FaTag,
  FaShoppingCart,
} from "react-icons/fa";

import "swiper/css/navigation";
import "swiper/css";

function Listing() {
  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalImage, setModalImage] = useState(null); // State to store the clicked image
  const [buying, setBuying] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser.token;
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();
  const isFavorite = favorites.includes(params.listingId);
  const [isFavoriteLocal, setIsFavoriteLocal] = useState(isFavorite);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavorites(token));
    }
  }, [currentUser, dispatch]);

  if (!currentUser) {
    alert("Please sign in to favorite listings.");
    return;
  }

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listings/get/${params.listingId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setListing(data);

        if (data.userRef) {
          try {
            const ownerRes = await fetch(`/api/user/${data.userRef}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (ownerRes.ok) {
              setOwner(await ownerRes.json());
            }
          } catch (ownerErr) {
            console.error("Error fetching owner:", ownerErr);
          }
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const openModal = (url) => {
    setModalImage(url);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      toast.error("Please sign in to buy this listing.");
      return;
    }
    try {
      setBuying(true);
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId: params.listingId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.message || "Could not start payment");
        setBuying(false);
        return;
      }

      // Redirect the buyer to Stripe's hosted Checkout page.
      window.location.href = data.url;
    } catch (err) {
      console.error("Buy now failed:", err);
      toast.error("Could not start payment. Please try again.");
      setBuying(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
       toast.error("Please Sign In to Add Lisitngs to Your Favourties.");
      return;
    }

    const previousState = isFavoriteLocal;
    setIsFavoriteLocal(!previousState); // Optimistic UI update

    try {
      if (previousState) {
        await dispatch(removeFavoriteAsync({ listingId: params.listingId })).unwrap();
         toast("Removed from favorites", {
        icon: "💔",
        style: {
          background: "#fee2e2",
          color: "#b91c1c",
        },
      });
      } else {
        await dispatch(addFavoriteAsync({ listingId: params.listingId })).unwrap();
         toast("Added to favorites", {
        icon: "❤️",
        style: {
          background: "#dcfce7",
          color: "#166534",
        },
      });
      }
    } catch (err) {
      setIsFavoriteLocal(previousState); // Revert on error
      console.error("Failed to update favorite:", err);
      toast.error("Failed to update favorite. Please try again.");
    }
  };

  return (
    <>
      <ScrollToTop />
      <main className="w-full min-h-screen flex flex-col items-center bg-white dark:bg-slate-950">
        {loading && (
          <div className="flex justify-center my-7 text-4xl text-slate-900 dark:text-white animate-spin">
            <FaSpinner />
          </div>
        )}
        {error && (
          <p className="text-2xl text-center text-red-500">
            Something went wrong
          </p>
        )}

        {listing && !loading && !error && (
          <div className="relative w-full max-w-[80vw] mx-auto mb-10 overflow-visible">
            <div className="relative w-full h-[500px]">
              <Swiper
                navigation={true}
                slidesPerView={1.4}
                spaceBetween={20}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                modules={[Navigation, Autoplay]}
                className="w-full h-full"
              >
                {listing.imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full flex justify-center items-center transition-transform duration-300 ease-in-out">
                      <img
                        src={url}
                        alt={`Slide ${index}`}
                        className="h-full w-full object-cover rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => openModal(url)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-6 z-20   text-2xl bg-white rounded-full p-2 shadow-md border border-white  hover:scale-110 transition-transform cursor-pointer"
            >
              {isFavoriteLocal ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-red-500" />
              )}
            </button>

            <div className="mt-10 px-6 max-w-5xl mx-auto">
              <div className="mb-6 flex flex-wrap items-center gap-10">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm">
                  {listing.name}
                </h1>

                <div className="flex items-center gap-2">
                  <FaTag className="text-green-600 text-xl drop-shadow" />

                  {listing.offer ? (
                    <>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-base px-2 py-1 rounded line-through shadow-inner">
                        ${listing.regularPrice.toLocaleString()}
                      </span>
                      <span className="text-green-700 font-extrabold text-2xl ">
                        ${listing.discountPrice.toLocaleString()}
                      </span>
                      {listing.type === "rent" && (
                        <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                          /month
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-green-700 font-extrabold text-2xl  ">
                        ${listing.regularPrice.toLocaleString()}
                      </span>
                      {listing.type === "rent" && (
                        <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                          /month
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <span className="flex w-50 rounded-md items-center mt-3 mb-6 px-5 text-center gap-2 text-slate-600 dark:text-slate-300 text-md drop-shadow-sm shadow-md">
                <FaMapMarkerAlt className="text-slate-900 dark:text-white text-xl" />
                {listing.address}
              </span>

              <div className="flex flex-wrap gap-4 mt-4">
                <span className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-2 rounded-md font-semibold shadow-md transition transform duration-200">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </span>
                {listing.offer && (
                  <span className="bg-green-600 text-white px-8 py-2 rounded-md font-semibold shadow-md  transition transform duration-200">
                    Save ${listing.regularPrice - listing.discountPrice} OFF
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-700 dark:text-slate-200 text-center mt-8">
                <div className="flex flex-col items-center p-4  rounded-lg shadow-md  transition duration-300 transform">
                  <FaBed className="text-3xl text-slate-900 dark:text-white mb-2 drop-shadow-sm" />
                  <p className="text-xl font-bold">{listing.bedrooms}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Bedrooms</p>
                </div>
                <div className="flex flex-col items-center p-4  rounded-lg shadow-md  transition duration-300 transform">
                  <FaBath className="text-3xl text-slate-900 dark:text-white mb-2 drop-shadow-sm" />
                  <p className="text-xl font-bold">{listing.bathrooms}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Bathrooms</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg shadow-md  transition duration-300 transform">
                  <FaCouch className="text-3xl text-slate-900 dark:text-white mb-2 drop-shadow-sm" />
                  <p className="text-xl font-bold">
                    {listing.furnished ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Furnished</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg shadow-md  transition duration-300 transform">
                  <FaCar className="text-3xl text-slate-900 dark:text-white mb-2 drop-shadow-sm" />
                  <p className="text-xl font-bold">
                    {listing.parking ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Parking</p>
                </div>
              </div>

              <div className="mt-10  mb-8 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3 drop-shadow-sm">
                  Description
                </h2>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed tracking-wide">
                  {listing.description}
                </p>
              </div>
            </div>

            {listing.status && listing.status !== "available" && (
              <div className="mx-6 max-w-5xl md:mx-auto mt-4 px-4 py-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 font-semibold text-center">
                This property has been {listing.status === "rented" ? "rented out" : "sold"}.
              </div>
            )}

            {currentUser && listing.userRef !== currentUser._id && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 px-6 max-w-5xl mx-auto">
                <button
                  type="button"
                  disabled
                  className="flex-1 bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-md text-center cursor-not-allowed opacity-90"
                >
                  Contact - {owner?.phone || "…"}
                </button>

                {listing.status === "available" && (
                  <button
                    onClick={handleBuyNow}
                    disabled={buying}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-300"
                  >
                    <FaShoppingCart />
                    {buying
                      ? "Redirecting…"
                      : `Buy Now — Rs. ${(listing.offer
                          ? listing.discountPrice
                          : listing.regularPrice
                        ).toLocaleString()}`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {modalImage && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-90 flex justify-center items-center z-30 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div className="relative max-w-5xl">
              <img
                src={modalImage}
                alt="Full-size"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button
                className="absolute top-3 w-10 right-3 px-2 py-1  text-white rounded-full shadow-2xl bg-red-600 bg-opacity-50 hover:bg-opacity-70
                hover:text-white transition duration-300 ease-in-out transform hover:scale-120  text-center"
                onClick={closeModal}
              >
                <span className="font-bold text-2xl">&times;</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Listing;
