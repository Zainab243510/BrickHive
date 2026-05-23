import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTheme } from '../context/ThemeContext';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function AmenitiesChart({ listings }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  let carParking = 0, discount = 0, furnished = 0, rent = 0, sell = 0;

  listings.forEach((listing) => {
    if (listing.parking) carParking++;
    if (listing.offer) discount++;
    if (listing.furnished) furnished++;
    if (listing.type === 'rent') rent++;
    if (listing.type === 'sell') sell++;
  });

  const barColors = isDark
    ? ['#f8fafc', '#cbd5e1', '#94a3b8', '#64748b', '#475569']
    : ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];
  const tickColor = isDark ? '#cbd5e1' : '#334155';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipBg = isDark ? 'rgba(248, 250, 252, 0.95)' : 'rgba(15, 23, 42, 0.9)';
  const tooltipText = isDark ? '#0f172a' : '#ffffff';

  const barData = {
    labels: ['Car Parking', 'Discount Offers', 'Furnished', 'Rent', 'Sell'],
    datasets: [
      {
        label: 'Listing Features & Types',
        data: [carParking, discount, furnished, rent, sell],
        backgroundColor: barColors,
        borderRadius: 10,
        barThickness: 'flex',
        maxBarThickness: 50,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 12 },
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} listings`
        }
      },
      datalabels: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 2,
          color: tickColor,
          font: { size: 12, weight: '500' }
        },
        grid: { color: gridColor }
      },
      x: {
        ticks: {
          color: tickColor,
          font: { size: 14, weight: '600' }
        },
        grid: { display: false }
      }
    }
  };
  return (
    <div className="w-full sm:max-w-md md:w-3xl lg:max-w-4xl px-4 sm:px-6 md:px-8 py-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mx-auto mt-5 border border-slate-200 dark:border-slate-700">
      <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
        Amenities Overview
      </h2>

      <div className="relative h-94 sm:h-60 md:h-[28rem] lg:h-[22rem]">
        <Bar
          data={barData}
          options={{
            ...barOptions,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );

}

export default AmenitiesChart;
