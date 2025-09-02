import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DistrictPerformanceChartProps {
  districtData: { name: string; count: number }[];
}

const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({ districtData }) => {
  const chartOptions = {
    // THIS IS THE KEY CHANGE: 'x' makes the chart vertical
    indexAxis: 'x' as const, 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#334155',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      y: { // Y-axis now represents the count
        grid: { color: '#f1f5f9' },
        ticks: { color: '#64748b' },
        title: {
          display: true,
          text: 'Number of Registrations',
          color: '#475569'
        }
      },
      x: { // X-axis now represents the district names
        grid: { display: false },
        ticks: { 
          color: '#64748b',
          // Auto-rotate labels on smaller screens to prevent overlap
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const chartData = {
    labels: districtData.map(d => d.name),
    datasets: [
      {
        label: 'Registrations',
        data: districtData.map(d => d.count),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 border border-slate-100">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            District Performance
        </h2>
        <div className="relative h-96 w-full">
            <Bar options={chartOptions} data={chartData} />
        </div>
    </div>
  );
};

export default DistrictPerformanceChart;

