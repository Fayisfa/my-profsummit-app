// import React from 'react';
// import { Building, Home } from 'lucide-react';
// import SearchableDropdown from './SearchableDropdown';

// export type ViewMode = 'college' | 'native';

// interface StateFilterControlsProps {
//   viewMode: ViewMode;
//   setViewMode: (mode: ViewMode) => void;
//   districts: string[];
//   selectedDistrict: string;
//   setSelectedDistrict: (district: string) => void;
// }

// const StateFilterControls: React.FC<StateFilterControlsProps> = ({
//   viewMode,
//   setViewMode,
//   districts,
//   selectedDistrict,
//   setSelectedDistrict,
// }) => (
//   <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
//       {/* View Mode Toggle */}
//       <div className="lg:col-span-2">
//         <p className="text-sm font-semibold text-slate-700 mb-3">Analyze By:</p>
//         <div className="flex bg-slate-100 p-1 rounded-2xl">
//           <button
//             onClick={() => setViewMode('college')}
//             className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${
//               viewMode === 'college'
//                 ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
//                 : 'text-slate-600 hover:bg-slate-200'
//             }`}
//           >
//             <Building className="w-4 h-4" />
//             College District
//           </button>
//           <button
//             onClick={() => setViewMode('native')}
//             className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${
//               viewMode === 'native'
//                 ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
//                 : 'text-slate-600 hover:bg-slate-200'
//             }`}
//           >
//             <Home className="w-4 h-4" />
//             Native District
//           </button>
//         </div>
//       </div>

//       {/* District Filter */}
//       <div>
//         <p className="text-sm font-semibold text-slate-700 mb-3">Filter by District:</p>
//         <SearchableDropdown
//           options={districts}
//           selected={selectedDistrict}
//           onSelect={setSelectedDistrict}
//         />
//       </div>
//     </div>
//   </div>
// );

// export default StateFilterControls;


import React from 'react';
import { Map, Users, Globe, Building } from 'lucide-react';

// Define the expanded view modes
export type ViewMode = 'college' | 'native' | 'state' | 'international';

interface StateFilterControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  districts: string[];
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
}

const viewOptions: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'college', label: 'College District', icon: Building },
  { id: 'native', label: 'Native District', icon: Map },
  { id: 'state', label: 'By State', icon: Users },
  { id: 'international', label: 'International', icon: Globe },
];

const StateFilterControls: React.FC<StateFilterControlsProps> = ({
  viewMode,
  setViewMode,
  districts,
  selectedDistrict,
  setSelectedDistrict
}) => {
  // Disable district filter for non-district views
  const isDistrictFilterDisabled = viewMode === 'state' || viewMode === 'international';

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-slate-200/80 space-y-4">
      {/* View Mode Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {viewOptions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              viewMode === id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* District Filter Dropdown */}
      <div>
        <label htmlFor="district-filter" className="block text-sm font-medium text-slate-600 mb-1">
          Filter by District
        </label>
        <select
          id="district-filter"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={isDistrictFilterDisabled}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-200 disabled:cursor-not-allowed"
        >
          <option value="all">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {isDistrictFilterDisabled && (
          <p className="text-xs text-slate-500 mt-1">District filter is not applicable for the current view.</p>
        )}
      </div>
    </div>
  );
};

export default StateFilterControls;
