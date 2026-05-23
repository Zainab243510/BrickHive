import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function TopListings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchTopListings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/listings/top", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const topListings = res.data.topListings || res.data;
        setData(topListings);
      } catch (err) {
        console.error("Failed to fetch top listings:", err);
      }
      setLoading(false);
    };

    fetchTopListings();
  }, [token]);

  const gradientColors = isDark
    ? [
        "rgba(248, 250, 252, 0.95)",
        "rgba(226, 232, 240, 0.85)",
        "rgba(203, 213, 225, 0.8)",
        "rgba(148, 163, 184, 0.75)",
        "rgba(100, 116, 139, 0.7)",
        "rgba(71, 85, 105, 0.6)",
      ]
    : [
        "rgba(15, 23, 42, 0.95)",
        "rgba(30, 41, 59, 0.85)",
        "rgba(51, 65, 85, 0.8)",
        "rgba(71, 85, 105, 0.75)",
        "rgba(100, 116, 139, 0.7)",
        "rgba(148, 163, 184, 0.6)",
      ];
  const tickColor = isDark ? '#cbd5e1' : '#1e293b';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipBg = isDark ? '#f8fafc' : '#0f172a';
  const tooltipTitle = isDark ? '#0f172a' : '#ffffff';
  const tooltipBody = isDark ? '#334155' : '#cbd5e1';
  const labelColor = isDark ? '#0f172a' : '#ffffff';

  const chartData = {
    labels: data.map((item) =>
      item.name.length > 12 ? item.name.slice(0, 12) + "..." : item.name
    ),
    datasets: [
      {
        label: "Views",
        data: data.map((item) => item.views),
        backgroundColor: gradientColors.slice(0, data.length),
        borderRadius: 10,
        barThickness: 35,
        borderSkipped: false,
        hoverBackgroundColor: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.95)",
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutCubic",
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: tickColor },
        grid: { color: gridColor, borderDash: [4, 4] },
      },
      y: {
        ticks: {
          color: tickColor,
          font: { size: 14, weight: "bold" },
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        padding: 10,
        cornerRadius: 6,
      },
      datalabels: {
        color: labelColor,
        font: {
          weight: 'bold',
          size: 12,
        },
        align: 'center',
        anchor: 'center',
      },
    },
    onClick: (e) => {
      const chart = e.chart; // Get the chart instance
      const elements = chart.getElementsAtEventForMode(e.native, "nearest", {
        intersect: true,
      }, false);

      if (elements && elements.length > 0) {
        const index = elements[0].index; 
        const clickedListing = data[index];
        if (clickedListing) {
          navigate(`/listing/${clickedListing._id}`);
        }
      }
    },
  };

  return (
    <motion.div
      className="w-full sm:max-w-md md:w-3xl lg:max-w-4xl px-4 sm:px-6 md:px-8 py-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mx-auto mt-5 border border-slate-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
        Top Viewed Listings
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-slate-900 dark:border-white border-dashed rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-slate-500 dark:text-slate-400 text-lg mt-6">
          No top listings found.
        </div>
      ) : (
        <div className="relative h-96 sm:h-60 md:h-[28rem] lg:h-[22rem]">
          <Bar
            data={chartData}
            options={{ ...chartOptions, maintainAspectRatio: false }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default TopListings;
