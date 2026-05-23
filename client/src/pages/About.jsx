import { FaHome, FaShieldAlt, FaMobileAlt, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-4 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200">
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Brick Hive</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Your trusted digital companion for finding, listing, and managing real estate properties seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-10 max-w-6xl mx-auto">
        <div className="bg-transparent rounded-2xl shadow-2xl border border-white p-6 text-center">
          <FaHome className="text-4xl text-slate-900 dark:text-white mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
          <p>We ensure that every property is legitimate, safe, and up-to-date.</p>
        </div>
        <div className="bg-transparent rounded-2xl shadow-2xl border border-white  p-6 text-center">
          <FaShieldAlt className="text-4xl text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
          <p>Trust and safety are our top priorities for every buyer and seller.</p>
        </div>
        <div className="bg-transparent rounded-2xl shadow-2xl border border-white  p-6 text-center">
          <FaMobileAlt className="text-4xl text-purple-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
          <p>Search and manage listings anytime, anywhere on your smartphone.</p>
        </div>
        <div className="bg-transparent rounded-2xl shadow-2xl border border-white p-6 text-center">
          <FaClock className="text-4xl text-slate-900 dark:text-white mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
          <p>Stay ahead with instant alerts and property status changes.</p>
        </div>
      </div>

      <div className="bg-transparent rounded-2xl shadow-2xl border border-white  bg-opacity-70  mx-4 lg:mx-auto max-w-4xl px-6 py-10 mt-10">
        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
        <p className="mb-6">
          To revolutionize the real estate experience with a platform that’s transparent, accessible, and efficient.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p>
          To empower individuals with innovative tools and trusted listings that simplify decision-making and connect them with their perfect property.
        </p>
      </div>

      <div className="text-center mt-16 mb-10">
        <h3 className="text-2xl font-semibold mb-4">Start Your Property Journey Today</h3>
        <button onClick={() => navigate("/")} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-full shadow hover:bg-slate-950 dark:hover:bg-slate-100 transition duration-300">
          Browse Listings 
        </button>
      </div>
    </div>
  );
}