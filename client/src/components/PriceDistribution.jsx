import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FaKey, FaDollarSign } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function PriceDistribution({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const categorizePrice = (price, type) => {
    if (type === 'rent') {
      if (price < 500) return '<500';
      if (price < 1000) return '500–999';
      if (price < 1500) return '1000–1499';
      return '1500+';
    } else {
      if (price < 50000) return '<50k';
      if (price < 100000) return '50k–99k';
      if (price < 200000) return '100k–199k';
      return '200k+';
    }
  };

  const rentCounts = { '<500': 0, '500–999': 0, '1000–1499': 0, '1500+': 0 };
  const sellCounts = { '<50k': 0, '50k–99k': 0, '100k–199k': 0, '200k+': 0 };

  data.forEach(d => {
    const type = d.type;
    const range = categorizePrice(d.price, type);
    if (type === 'rent') {
      rentCounts[range] += d.rent || 0;
    } else {
      sellCounts[range] += d.sell || 0;
    }
  });

  const rentColors = isDark
    ? ['#475569', '#64748b', '#94a3b8', '#cbd5e1']
    : ['#cbd5e1', '#94a3b8', '#475569', '#0f172a'];
  const sellColors = isDark
    ? ['#334155', '#64748b', '#cbd5e1', '#f8fafc']
    : ['#e2e8f0', '#64748b', '#334155', '#0f172a'];
  const borderColor = isDark ? '#0f172a' : '#ffffff';
  const labelColor = isDark ? '#cbd5e1' : '#1e293b';
  const tooltipBg = isDark ? 'rgba(248, 250, 252, 0.95)' : 'rgba(15, 23, 42, 0.9)';
  const tooltipText = isDark ? '#0f172a' : '#ffffff';

  const generateChartData = (counts, colors) => ({
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: colors,
        borderColor: borderColor,
        borderWidth: 1,
        hoverOffset: 20,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: labelColor,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} listings`;
          },
        },
      },
      datalabels: {
        color: isDark ? '#0f172a' : '#ffffff',
        font: {
          size: 10,
          weight: 'bold',
        },
        formatter: (value) => (value > 0 ? value : ''),
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const rentData = generateChartData(rentCounts, rentColors);
  const sellData = generateChartData(sellCounts, sellColors);
  const totalRent = Object.values(rentCounts).reduce((acc, val) => acc + val, 0);
  const totalSell = Object.values(sellCounts).reduce((acc, val) => acc + val, 0);

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10 ">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] duration-200">
        <h2 className="text-xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <FaKey className="text-slate-500 dark:text-slate-400" /> Rent Price Ranges
        </h2>
        <p className="text-sm text-center mb-4 text-slate-700 dark:text-slate-300">
          Total Rent Listings: <span className="font-semibold">{totalRent}</span>
        </p>
        {totalRent > 0 ? (
          <Doughnut data={rentData} options={chartOptions} />
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">No rent listings available</p>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] duration-200">
        <h2 className="text-xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <FaDollarSign className="text-slate-500 dark:text-slate-400" /> Sell Price Ranges
        </h2>
        <p className="text-sm text-center mb-4 text-slate-700 dark:text-slate-300">
          Total Sell Listings: <span className="font-semibold">{totalSell}</span>
        </p>
        {totalSell > 0 ? (
          <Doughnut data={sellData} options={chartOptions} />
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">No sell listings available</p>
        )}
      </div>
    </div>
  );
}

export default PriceDistribution;
