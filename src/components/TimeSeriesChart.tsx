// src/components/TimeSeriesChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TimeSeriesChartProps {
  chartData: {
    labels: string[];
    datasets: any[];
  };
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ chartData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#fff',
        titleColor: '#334155',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', stepSize: 1 } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
    },
  };

  return (
    <div className="h-72 w-full">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default TimeSeriesChart;