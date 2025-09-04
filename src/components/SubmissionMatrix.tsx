// import React, { useState } from 'react';
// import { ChevronDown, Grid3X3, MapPin } from 'lucide-react';
// import type { Event } from '../utils/types';
// import { EVENTS } from '../data/database';

// interface SubmissionMatrixProps {
//   matrixData: Record<string, Record<number, number>>;
//   districts: string[];
// }

// const SubmissionMatrix: React.FC<SubmissionMatrixProps> = ({ matrixData, districts }) => {
//   // Ensure we have all Kerala districts
//   const keralDistricts = [
//     'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 
//     'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 
//     'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
//   ];

//   // Combine provided districts with Kerala districts (remove duplicates)
//   const allDistricts = [...new Set([...districts, ...keralDistricts])];
  
//   const allEvents = EVENTS; // Use the static list of all events for columns

//   const [viewMode, setViewMode] = useState('all');
//   const [selectedDistrict, setSelectedDistrict] = useState(allDistricts[0] || 'Ernakulam');
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const getStatusColor = (count: number) => {
//     if (count >= 20) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//     if (count >= 10) return 'bg-amber-100 text-amber-800 border-amber-200';
//     return 'bg-red-100 text-red-800 border-red-200';
//   };

//   const getStatusBadge = (count: number) => {
//     if (count >= 20) return 'High';
//     if (count >= 10) return 'Medium';
//     return 'Low';
//   };

//   return (
//     <div className="bg-gradient-to-br p-6 lg:p-8">
//       {/* Header Section */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
//         {/* <div>
//           <h2 className="text-2xl font-bold text-slate-800 mb-2">Submissions Matrix</h2>
//           <p className="text-slate-600 text-sm">Track submissions across districts and events</p>
//         </div> */}
        
//         {/* Toggle Controls */}
//         <div className="flex items-center space-x-3">
//           <div className="bg-white rounded-xl p-1 shadow-md border border-slate-200 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <button
//               onClick={() => setViewMode('all')}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
//                 viewMode === 'all'
//                   ? 'bg-blue-500 text-white shadow-md'
//                   : 'text-slate-600 hover:bg-slate-100'
//               }`}
//             >
//               <Grid3X3 size={16} />
//               <span>View All</span>
//             </button>
//             <button
//               onClick={() => setViewMode('district')}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
//                 viewMode === 'district'
//                   ? 'bg-blue-500 text-white shadow-md'
//                   : 'text-slate-600 hover:bg-slate-100'
//               }`}
//             >
//               <MapPin size={16} />
//               <span>District View</span>
//             </button>
//           </div>

//           {/* District Selector */}
//           {viewMode === 'district' && (
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
//               >
//                 <span>{selectedDistrict}</span>
//                 <ChevronDown size={16} className={`transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
//               </button>
              
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
//                   {allDistricts.map(district => (
//                     <button
//                       key={district}
//                       onClick={() => {
//                         setSelectedDistrict(district);
//                         setDropdownOpen(false);
//                       }}
//                       className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors duration-150 ${
//                         selectedDistrict === district ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
//                       } first:rounded-t-xl last:rounded-b-xl`}
//                     >
//                       {district}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
//         {viewMode === 'all' ? (
//           // All Districts View
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm border-collapse">
//               <thead className="bg-gradient-to-r from-slate-100 to-slate-50 sticky top-0">
//                 <tr>
//                   <th className="p-4 font-semibold text-left text-slate-700 border-b border-slate-200">
//                     District
//                   </th>
//                   {allEvents.map(event => (
//                     <th key={event.id} className="p-4 font-semibold text-center text-slate-700 border-b border-slate-200 w-28">
//                       <div className="flex flex-col items-center space-y-1">
//                         <span>{event.title}</span>
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {allDistricts.map((district, index) => (
//                   <tr key={district} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-blue-50/50 transition-colors duration-200`}>
//                     <td className="p-4 font-medium text-slate-800 border-b border-slate-100">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                         <span>{district}</span>
//                       </div>
//                     </td>
//                     {allEvents.map(event => {
//                       const count = matrixData[district]?.[event.id] || 0;
//                       return (
//                         <td key={event.id} className="p-4 text-center border-b border-slate-100">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(count)}`}>
//                             {count}
//                           </span>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           // Single District View
//           <div className="p-6">
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-slate-800 mb-2">{selectedDistrict} District</h3>
//               <p className="text-slate-600 text-sm">Event submissions overview</p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {allEvents.map(event => {
//                 const count = matrixData[selectedDistrict]?.[event.id] || 0;
//                 return (
//                   <div key={event.id} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="font-semibold text-slate-800">{event.title}</h4>
//                       <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(count)}`}>
//                         {getStatusBadge(count)}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className={`text-2xl font-bold ${count >= 20 ? 'text-emerald-600' : count >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
//                         {count}
//                       </div>
//                       <div className="text-sm text-slate-500">submissions</div>
//                     </div>
//                     <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
//                       <div 
//                         className={`h-full transition-all duration-300 ${count >= 20 ? 'bg-emerald-400' : count >= 10 ? 'bg-amber-400' : 'bg-red-400'}`}
//                         style={{ width: `${Math.min((count / 40) * 100, 100)}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubmissionMatrix;
import React, { useState, useMemo } from 'react';
import { ChevronDown, Grid3X3, MapPin } from 'lucide-react';
import type { Event } from '../utils/types';
import { EVENTS } from '../data/database';

interface SubmissionMatrixProps {
  matrixData: Record<string, Record<number, number>>;
  districts: string[];
}

const keralDistricts = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode South', 'Kozhikode North', 'Malappuram West', 'Malappuram East', 'Palakkad',
  'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

const SubmissionMatrix: React.FC<SubmissionMatrixProps> = ({ matrixData, districts }) => {
  // Merge district lists & dedupe
  const allDistricts = useMemo(() => [...new Set([...(districts || []), ...keralDistricts])], [districts]);

  const allEvents: Event[] = EVENTS;

  const [viewMode, setViewMode] = useState<'all' | 'district'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(allDistricts[0] || 'Ernakulam');
  // dropdownOpen: false | 'district' | 'events'
  const [dropdownOpen, setDropdownOpen] = useState<false | 'district' | 'events'>(false);

  // --- New: search/filter for large tables
  const [search, setSearch] = useState('');
  const visibleDistricts = useMemo(() => {
    if (!search.trim()) return allDistricts;
    return allDistricts.filter(d => d.toLowerCase().includes(search.trim().toLowerCase()));
  }, [search, allDistricts]);

  // Events selection state
  const [selectedEvents, setSelectedEvents] = useState<number[]>(allEvents.map(e => e.id));

  const toggleEvent = (id: number) => {
    setSelectedEvents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllEvents = () => setSelectedEvents(allEvents.map(e => e.id));
  const clearAllEvents = () => setSelectedEvents([]);

  // --- New: compute maximum to scale heat/progress
  const maxCount = useMemo(() => {
    let m = 0;
    for (const d of Object.values(matrixData || {})) {
      for (const v of Object.values(d || {})) {
        if (v > m) m = v;
      }
    }
    return Math.max(m, 1);
  }, [matrixData]);

  // convert count -> HSL background (green->amber->red)
  const getHeatBg = (count: number) => {
    if (!count) return 'transparent';
    const ratio = Math.min(count / maxCount, 1);
    // hue 0 (red) -> 120 (green)
    const hue = Math.round(ratio * 120);
    const lightness = Math.round(92 - ratio * 35); // lighter for small ratios
    return `hsl(${hue}, 75%, ${lightness}%)`;
  };

  const getTextColor = (count: number) => {
    if (!count) return 'text-slate-500';
    const ratio = Math.min(count / maxCount, 1);
    return ratio > 0.5 ? 'text-slate-900' : 'text-slate-800';
  };

  const getBadgeColors = (count: number) => {
    if (count >= 20) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (count >= 10) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (count > 0) return 'bg-sky-100 text-sky-800 border-sky-200';
    return 'bg-transparent text-slate-400 border-transparent';
  };

  // filtered events (what's shown in table / district cards)
  const visibleEvents = useMemo(
    () => allEvents.filter(e => selectedEvents.includes(e.id)),
    [allEvents, selectedEvents]
  );

  // UX: if nothing selected, show message instead of empty table
  const noEventsSelected = selectedEvents.length === 0;

  return (
    <div className="bg-gradient-to-br p-6 lg:p-8">
      {/* Header + controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Submission Matrix</h2>
          <p className="text-slate-600 text-sm">Track submissions across districts and events.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="bg-white rounded-xl p-1 shadow-md border border-slate-200 flex items-center">
            <button
              onClick={() => { setViewMode('all'); setDropdownOpen(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${viewMode === 'all' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Grid3X3 size={16} />
              <span>View All</span>
            </button>

            <button
              onClick={() => { setViewMode('district'); setDropdownOpen(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${viewMode === 'district' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MapPin size={16} />
              <span>District View</span>
            </button>
          </div>

          {/* District selector (only visible in district view) */}
          {viewMode === 'district' && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(dropdownOpen === 'district' ? false : 'district')}
                className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                aria-expanded={dropdownOpen === 'district'}
                aria-haspopup="listbox"
              >
                <span>{selectedDistrict}</span>
                <ChevronDown size={16} className={`transform transition-transform duration-200 ${dropdownOpen === 'district' ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen === 'district' && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                  {allDistricts.map(district => (
                    <button
                      key={district}
                      onClick={() => { setSelectedDistrict(district); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors duration-150 ${selectedDistrict === district ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'} first:rounded-t-xl last:rounded-b-xl`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Event filter dropdown (always visible) */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === 'events' ? false : 'events')}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
              aria-expanded={dropdownOpen === 'events'}
              aria-haspopup="menu"
            >
              <span>Filter Events</span>
              <ChevronDown size={16} className={`transform transition-transform duration-200 ${dropdownOpen === 'events' ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen === 'events' && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-72 overflow-y-auto p-2">
                {/* Select / Clear row */}
                <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-slate-100">
                  <div className="text-sm text-slate-600">Events</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAllEvents}
                      className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      Select all
                    </button>
                    <button
                      onClick={clearAllEvents}
                      className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {allEvents.map(event => (
                    <label
                      key={event.id}
                      className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => toggleEvent(event.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700">{event.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search + table container */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search districts..."
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
            aria-label="Search districts"
          />
          <div className="text-sm text-slate-500">Showing {visibleDistricts.length} districts</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        {noEventsSelected ? (
          <div className="p-6 text-center text-slate-500">
            No events selected. Use <strong>Filter Events</strong> to choose which events to display.
          </div>
        ) : viewMode === 'all' ? (
          <div className="overflow-x-auto relative">
            <table className="min-w-[900px] w-full text-sm border-collapse table-fixed">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 sticky top-0">
                <tr>
                  <th className="p-4 font-semibold text-left text-slate-700 border-b border-slate-200 sticky left-0 z-40 bg-white w-56">
                    District
                  </th>

                  {visibleEvents.map(event => (
                    <th key={event.id} className="p-3 font-semibold text-center text-slate-700 border-b border-slate-200 w-36">
                      <div className="flex flex-col items-center space-y-1 px-1">
                        <span className="whitespace-normal break-words text-xs">{event.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleDistricts.map((district, index) => (
                  <tr
                    key={district}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-blue-50/30 transition-colors duration-150`}
                  >
                    <td className="p-4 font-medium text-slate-800 border-b border-slate-100 sticky left-0 z-30 bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="truncate">{district}</span>
                      </div>
                    </td>

                    {visibleEvents.map(event => {
                      const count = matrixData?.[district]?.[event.id] || 0;
                      const bg = getHeatBg(count);
                      const pct = Math.round(Math.min(100, (count / maxCount) * 100));
                      return (
                        <td key={event.id} className="p-3 text-center border-b border-slate-100 align-middle">
                          <div className="mx-auto w-24">
                            {count === 0 ? (
                              <div className="text-xs text-slate-400">—</div>
                            ) : (
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border`}
                                style={{ backgroundColor: bg, borderColor: 'rgba(0,0,0,0.06)' }}
                                title={`${count} submissions`}
                              >
                                <span className={getTextColor(count)}>{count}</span>
                              </div>
                            )}

                            {/* tiny progress bar */}
                            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: count === 0 ? 'transparent' : `hsl(${Math.round((Math.min(count, maxCount) / maxCount) * 120)}, 75%, 50%)`
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // District view cards
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{selectedDistrict} District</h3>
              <p className="text-slate-600 text-sm">Event submissions overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleEvents.map(event => {
                const count = matrixData[selectedDistrict]?.[event.id] || 0;
                return (
                  <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">{event.title}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getBadgeColors(count)}`}>
                        {count > 0 ? (count >= 20 ? 'High' : count >= 10 ? 'Medium' : 'Low') : 'No data'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl font-bold ${count >= 20 ? 'text-emerald-600' : count >= 10 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {count}
                      </div>
                      <div className="text-sm text-slate-500">submissions</div>
                    </div>

                    <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${Math.min((count / 40) * 100, 100)}%`, backgroundColor: count === 0 ? 'transparent' : (count >= 20 ? 'hsl(120,75%,50%)' : count >= 10 ? 'hsl(45,85%,50%)' : 'hsl(200,80%,45%)') }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionMatrix;
