import React from "react";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaBell,
  FaHeart,
  FaChartBar,
  FaUser,
  FaSun,
  FaMoon,
  FaShoppingBag,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";


import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import socket from "../socket";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [unread, setUnread] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  });

  useEffect(() => {
    if (!currentUser) return;


    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("addUser", currentUser._id);

    socket.emit("join", currentUser._id);

    socket.on("newNotification", (notif) => {
      setUnread(true);
      setNotifications((prev) => [...prev, notif]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [currentUser]);

  const handleNotificationClick = () => {
    setUnread(false);
    navigate("/notifications");
  };

  const getNavItemClass = (path) => {
    return location.pathname === path
      ? "text-slate-900 dark:text-white"
      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white";
  };

  const ThemeToggle = ({ className = "" }) => (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${className}`}
    >
      {theme === "dark" ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative flex items-center justify-between p-3 max-w-8xl mx-auto">
        {/* Left Side: Logo */}
        <Link to="/">
          <h1 className="text-sm sm:text-2xl flex flex-wrap italic font-extrabold tracking-wide text-slate-900 dark:text-white">
            <span className="px-1">Brick</span>
            <span className="px-1">Hive</span>
          </h1>
        </Link>

        <ul className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 md:gap-15 text-sm font-semibold">
          <Link to="/">
            <li className={`flex flex-col items-center group transition ${getNavItemClass("/")}`}>
              <FaHome className="text-2xl" />
              <span className={`text-xs ${getNavItemClass("/")}`}>Home</span>
            </li>
          </Link>

          {/* <li
            onClick={handleNotificationClick}
            className={`flex flex-col items-center cursor-pointer group relative transition ${getNavItemClass("/notifications")}`}
          >
            <FaBell className="text-2xl" />
            <span className={`text-xs cursor-pointer ${getNavItemClass("/notifications")}`}>
              Notifications
            </span>
            {unread && (
              <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            )}
          </li>  */}

          <Link to="/favourites">
            <li className={`flex flex-col items-center group transition ${getNavItemClass("/favourites")}`}>
              <FaHeart className="text-2xl" />
              <span className={`text-xs ${getNavItemClass("/favourites")}`}>Favourites</span>
            </li>
          </Link>

          <Link to="/analytics">
            <li className={`flex flex-col items-center group transition ${getNavItemClass("/analytics")}`}>
              <FaChartBar className="text-2xl" />
              <span className={`text-xs ${getNavItemClass("/analytics")}`}>Analytics</span>
            </li>
          </Link>

          <Link to="/search">
            <li className={`flex flex-col items-center group transition ${getNavItemClass("/search")}`}>
              <FaSearch className="text-2xl" />
              <span className={`text-xs ${getNavItemClass("/search")}`}>Search</span>
            </li>
          </Link>

          {currentUser && (
            <Link to="/my-purchases">
              <li className={`flex flex-col items-center group transition ${getNavItemClass("/my-purchases")}`}>
                <FaShoppingBag className="text-2xl" />
                <span className={`text-xs ${getNavItemClass("/my-purchases")}`}>Purchases</span>
              </li>
            </Link>
          )}

          <Link to="/about">
            <li className={`flex flex-col items-center group transition ${getNavItemClass("/about")}`}>
              <FaInfoCircle className="text-2xl" />
              <span className={`text-xs ${getNavItemClass("/about")}`}>About</span>
            </li>
          </Link>

          <li className="flex items-center">
            <Link to="/profile">
              {currentUser ? (
                <motion.img
                  key={currentUser?.avatar || "default"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={
                    currentUser?.avatar
                      ? currentUser.avatar.startsWith("http")
                        ? currentUser.avatar
                        : `http://localhost:3000${currentUser.avatar}`
                      : "/default.png"
                  }
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                />
              ) : (
                <span className={`flex flex-col items-center group transition ${getNavItemClass("/profile")}`}>
                  <FaUser className="text-2xl" />
                  <span className={`text-xs ${getNavItemClass("/profile")}`}>Sign In</span>
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Right side: Theme toggle + mobile menu button */}
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-900 dark:text-white text-2xl sm:hidden focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed top-14 right-0 w-2/3 max-w-3xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800 shadow-xl py-6 space-y-6 z-40 rounded-l-lg">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaHome className="text-2xl" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Home</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaInfoCircle className="text-2xl" />
            <span className="text-sm text-slate-600 dark:text-slate-300">About</span>
          </Link>
          <Link
            to="/notifications"
            onClick={() => {
              handleNotificationClick();
              setIsMobileMenuOpen(false);
            }}
            className="flex flex-col items-center relative"
          >
            <FaBell className="text-2xl" />
            {unread && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            )}
            <span className="text-sm text-slate-600 dark:text-slate-300">Notifications</span>
          </Link>
          <Link
            to="/favourites"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaHeart className="text-2xl" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Favourites</span>
          </Link>
          <Link
            to="/analytics"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaChartBar className="text-2xl" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Analytics</span>
          </Link>
          <Link
            to="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaSearch className="text-2xl" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Search</span>
          </Link>
          {currentUser && (
            <Link
              to="/my-purchases"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex flex-col items-center"
            >
              <FaShoppingBag className="text-2xl" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Purchases</span>
            </Link>
          )}
          <Link
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaUser className="text-2xl" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {currentUser ? "Profile" : "Sign In"}
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
