// components/FilterControls.tsx

import React from 'react';
import { Building, Home, Map, ChevronDown } from 'lucide-react';

// Define props for the component
interface FilterControlsProps {
  viewMode: 'college' | 'native';
  setViewMode: (mode: 'college' | 'native') => void;
  isStateAdmin: boolean;
  districts: string[];
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  viewMode,
  setViewMode,
  isStateAdmin,
  districts,
  selectedDistrict,
  setSelectedDistrict,
}) => (
  <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
    <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
      
      {/* View Mode Toggle */}
      <div className="flex-shrink-0">
        <p className="text-sm font-semibold text-slate-700 mb-3">View Mode:</p>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('college')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${
              viewMode === 'college'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building className="w-4 h-4" /> College District
          </button>
          <button
            onClick={() => setViewMode('native')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${
              viewMode === 'native'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-4 h-4" /> Native District
          </button>
        </div>
      </div>

      {/* --- Conditional District Filter for State Admins --- */}
      {isStateAdmin && (
        <div className="flex-1 lg:max-w-xs">
          <p className="text-sm font-semibold text-slate-700 mb-3">Filter by District:</p>
          <div className="relative">
            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Districts</option>
              {districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default FilterControls;