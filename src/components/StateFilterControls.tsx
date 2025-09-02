import React from 'react';
import { Building, Home } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';

export type ViewMode = 'college' | 'native';

interface StateFilterControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  districts: string[];
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
}

const StateFilterControls: React.FC<StateFilterControlsProps> = ({
  viewMode,
  setViewMode,
  districts,
  selectedDistrict,
  setSelectedDistrict,
}) => (
  <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
      {/* View Mode Toggle */}
      <div className="lg:col-span-2">
        <p className="text-sm font-semibold text-slate-700 mb-3">Analyze By:</p>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('college')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${
              viewMode === 'college'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            College District
          </button>
          <button
            onClick={() => setViewMode('native')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${
              viewMode === 'native'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            Native District
          </button>
        </div>
      </div>

      {/* District Filter */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">Filter by District:</p>
        <SearchableDropdown
          options={districts}
          selected={selectedDistrict}
          onSelect={setSelectedDistrict}
        />
      </div>
    </div>
  </div>
);

export default StateFilterControls;
