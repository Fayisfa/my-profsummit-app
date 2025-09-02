// src/components/RegistrationTrend.tsx
import React, { useState } from 'react';
import type { RegistrationData } from '../utils/types';
import TimeSeriesChart from './TimeSeriesChart';
import { useRegistrationData, type TimeFilter } from '../hooks/useRegistrationData';

interface RegistrationTrendProps {
  data: RegistrationData[];
}

const RegistrationTrend: React.FC<RegistrationTrendProps> = ({ data }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const { labels, dataPoints } = useRegistrationData(data, timeFilter);

  const chartData = {
    labels,
    datasets: [{
      label: 'Registrations',
      data: dataPoints,
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };
  
  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Registration Trend</h2>
          <p className="text-sm text-slate-500">New registrations over time.</p>
        </div>
        {/* Responsive filter controls */}
        <div className="flex-shrink-0 bg-slate-100 p-1 rounded-full self-start sm:self-center">
          {timeFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeFilter(key)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                timeFilter === key ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <TimeSeriesChart chartData={chartData} />
    </div>
  );
};

export default RegistrationTrend;