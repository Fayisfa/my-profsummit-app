// import React, { useState, useEffect, useMemo } from 'react';
// import type { User, RegistrationData } from '../utils/types';
// import { getAllRegisteredData } from '../api';
// import { Users, UserPlus, Calendar, Map, ChevronDown, TrendingUp } from 'lucide-react';
// import { exportToExcel } from '../utils/export';

// // Import all our specialized components
// import StateFilterControls from '../components/StateFilterControls';
// import type { ViewMode } from '../components/StateFilterControls';
// import RegistrationTrend from '../components/RegistrationTrend';
// import HeaderActions from '../components/HeaderActions';
// // ADD the new chart component import
// import DistrictPerformanceChart from '../components/DistrictPerformanceChart';

// // --- Reusable UI Components ---
// const SummaryCard: React.FC<{ title: string; value: number | string; icon: React.ElementType; gradient: string; }> = ({ title, value, icon: Icon, gradient }) => (
//     <div className={`${gradient} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}>
//         <div className="flex items-center justify-between">
//             <div>
//                 <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{value}</p>
//                 <p className="text-sm font-medium text-white/90">{title}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-2xl">
//                 <Icon className="w-7 h-7 text-white" />
//             </div>
//         </div>
//     </div>
// );

// const DistrictAccordionCard: React.FC<{
//     districtName: string;
//     registrations: RegistrationData[];
//     rank: number;
//     viewMode: ViewMode;
// }> = ({ districtName, registrations, rank, viewMode }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     // Find top 5 colleges within this district
//     const topColleges = useMemo(() => {
//         const grouped = registrations.reduce((acc, student) => {
//             const college = student.college || 'Unknown College';
//             if (!acc[college]) acc[college] = 0;
//             acc[college]++;
//             return acc;
//         }, {} as Record<string, number>);
 
//         return Object.entries(grouped)
//           .sort(([, a], [, b]) => b - a)
//           .slice(0, 100);

//     }, [registrations]);

//     return (
//         <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
//             <div className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group" onClick={() => setIsOpen(!isOpen)}>
//                 <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
//                     <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                         <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
//                     </div>
//                     <div className="min-w-0 flex-1">
//                         <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-cyan-600 transition-colors">{districtName}</h3>
//                         <p className="text-sm text-slate-500 mt-1">{registrations.length} Total Registrations</p>
//                     </div>
//                 </div>
//                 <ChevronDown className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
//             </div>
 
//             <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-\[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
//                 <div className="border-t border-slate-100 p-4 lg:p-6 bg-slate-50/50">
//                     <h4 className="font-semibold mb-3 text-slate-700">Top 5 Performing Colleges in {districtName}</h4>
//                     <ul className="space-y-2">
//                         {topColleges.map(([name, count]) => (
//                             <li key={name} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100">
//                                 <span className="text-slate-600">{name}</span>
//                                 <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">{count}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- MAIN STATE DASHBOARD COMPONENT ---

// interface StateDashboardProps {
//     user: User;
//     onLogout: () => void;
// }

// const StateDashboard: React.FC<StateDashboardProps> = ({ user, onLogout }) => {
//     const [allData, setAllData] = useState<RegistrationData[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [viewMode, setViewMode] = useState<ViewMode>('college');
//     const [selectedDistrict, setSelectedDistrict] = useState('all');

//     useEffect(() => {
//         const loadData = async () => {
//             setIsLoading(true);
//             const data = await getAllRegisteredData();
//             if (Array.isArray(data)) setAllData(data);
//             setIsLoading(false);
//         };
//         loadData();
//     }, []);

//     const {
//         summaryStats,
//         districtsForFilter,
//         sortedDistricts,
//         performanceChartData, // ADDED: Data for the bar chart
//         trendChartData,
//         exportData,
//     } = useMemo(() => {
//         const districtKey = viewMode === 'college' ? 'college_district' : 'native_district';
 
//         const dataToProcess = selectedDistrict === 'all'
//             ? allData
//             : allData.filter(row => row[districtKey] === selectedDistrict);

//         const today = new Date().toISOString().split('T')[0];
//         const cutoffDate = new Date("2025-01-01T00:00:00Z");
 
//         const stats = {
//             total: allData.length,
//             districtsActive: new Set(allData.map(r => r[districtKey]).filter(Boolean)).size,
//             new: allData.filter(s => new Date(s.updated_at) > cutoffDate).length,
//             today: allData.filter(s => s.updated_at.startsWith(today)).length,
//         };

//         const uniqueDistricts = [...new Set(allData.map(r => r[districtKey]).filter(Boolean))].sort();
 
//         const groupedByDistrict = allData.reduce((acc, reg) => {
//             const district = reg[districtKey];
//             if (district) {
//                 if (!acc[district]) acc[district] = [];
//                 acc[district].push(reg);
//             }
//             return acc;
//         }, {} as Record<string, RegistrationData[]>);

//         const sortedDistrictEntries = Object.entries(groupedByDistrict)
//             .sort(([, a], [, b]) => b.length - a.length);

//         // ADDED: Create data structured for the performance bar chart
//         const performanceData = sortedDistrictEntries.map(([name, registrations]) => ({
//             name,
//             count: registrations.length,
//         }));

//         return {
//             summaryStats: stats,
//             districtsForFilter: uniqueDistricts,
//             sortedDistricts: sortedDistrictEntries,
//             performanceChartData: performanceData, // Return the new data
//             trendChartData: dataToProcess,
//             exportData: dataToProcess,
//         };
//     }, [allData, viewMode, selectedDistrict]);

//     const handleExport = () => {
//         const date = new Date().toISOString().split('T')[0];
//         const fileName = `State\_Registrations\_${selectedDistrict}\_${date}`;
//         exportToExcel(exportData, fileName);
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-slate-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//                     <p className="text-slate-600 font-medium text-lg">Loading State Dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50">
//             <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                         <div>
//                             <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">State Registration Overview</h1>
//                             <p className="text-slate-500 mt-1">Welcome, <span className="font-semibold text-indigo-600">{user.name}</span></p>
//                         </div>
//                         <HeaderActions onExport={handleExport} onLogout={onLogout} />
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <SummaryCard title="Total Registrations" value={summaryStats.total} icon={Users} gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
//                     <SummaryCard title="Districts Active" value={summaryStats.districtsActive} icon={Map} gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
//                     <SummaryCard title="New Registrants" value={summaryStats.new} icon={UserPlus} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
//                     <SummaryCard title="Today's Registrations" value={summaryStats.today} icon={Calendar} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
//                 </div>

//                 <StateFilterControls
//                     viewMode={viewMode}
//                     setViewMode={setViewMode}
//                     districts={districtsForFilter}
//                     selectedDistrict={selectedDistrict}
//                     setSelectedDistrict={setSelectedDistrict}
//                 />
 
//                 <div className="my-8">
//                     <RegistrationTrend data={trendChartData} />
//                 </div>

//                 {/* UPDATED: Changed the two-column grid to a single column flow */}
//                 <div className="space-y-8">
//                     {/* Performance Chart now appears first */}
//                     <DistrictPerformanceChart districtData={performanceChartData} />
 
//                     {/* Accordion List appears below the chart */}
//                     <div>
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                             <div>
//                                 <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
//                                     <TrendingUp className="w-6 h-6 text-indigo-600" />
//                                     District Rankings & Details
//                                 </h2>
//                                 <p className="text-slate-500 text-sm mt-1">
//                                     Showing {sortedDistricts.length} districts, ranked by total registrations.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="space-y-4 lg:space-y-6">
//                             {sortedDistricts.map(([districtName, registrations], index) => (
//                                 <DistrictAccordionCard
//                                     key={districtName}
//                                     districtName={districtName}
//                                     registrations={registrations}
//                                     rank={index + 1}
//                                     viewMode={viewMode}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StateDashboard;



import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { getAllRegisteredData } from '../api';
import { Users, UserPlus, Calendar, Map, ChevronDown, TrendingUp, Globe } from 'lucide-react';
import { exportToExcel } from '../utils/export';

// Import all our specialized components
import StateFilterControls from '../components/StateFilterControls';
import type { ViewMode } from '../components/StateFilterControls';
import RegistrationTrend from '../components/RegistrationTrend';
import HeaderActions from '../components/HeaderActions';
import DistrictPerformanceChart from '../components/DistrictPerformanceChart';

// --- Reusable UI Components ---
const SummaryCard: React.FC<{ title: string; value: number | string; icon: React.ElementType; gradient: string; }> = ({ title, value, icon: Icon, gradient }) => (
    <div className={`${gradient} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{value}</p>
                <p className="text-sm font-medium text-white/90">{title}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
                <Icon className="w-7 h-7 text-white" />
            </div>
        </div>
    </div>
);

// RENAMED: from DistrictAccordionCard to RankingAccordionCard to be more generic
const RankingAccordionCard: React.FC<{
    groupName: string;
    registrations: RegistrationData[];
    rank: number;
}> = ({ groupName, registrations, rank }) => {
    const [isOpen, setIsOpen] = useState(false);

    const topColleges = useMemo(() => {
        const grouped = registrations.reduce((acc, student) => {
            const college = student.college || 'Unknown College';
            if (!acc[college]) acc[college] = 0;
            acc[college]++;
            return acc;
        }, {} as Record<string, number>);
 
        return Object.entries(grouped)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 100);

    }, [registrations]);

    return (
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-cyan-600 transition-colors">{groupName}</h3>
                        <p className="text-sm text-slate-500 mt-1">{registrations.length} Total Registrations</p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
 
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-\[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
                <div className="border-t border-slate-100 p-4 lg:p-6 bg-slate-50/50">
                    <h4 className="font-semibold mb-3 text-slate-700">Top Performing Colleges in {groupName}</h4>
                    <ul className="space-y-2">
                        {topColleges.map(([name, count]) => (
                            <li key={name} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100">
                                <span className="text-slate-600">{name}</span>
                                <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


// --- MAIN STATE DASHBOARD COMPONENT ---

interface StateDashboardProps {
    user: User;
    onLogout: () => void;
}

const StateDashboard: React.FC<StateDashboardProps> = ({ user, onLogout }) => {
    const [allData, setAllData] = useState<RegistrationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // UPDATED: Default view is 'college'
    const [viewMode, setViewMode] = useState<ViewMode>('college');
    const [selectedDistrict, setSelectedDistrict] = useState('all');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await getAllRegisteredData();
            if (Array.isArray(data)) setAllData(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // UPDATED: The entire useMemo hook is refactored for clarity and new features
    const {
        summaryStats,
        districtsForFilter,
        sortedItems,
        performanceChartData,
        trendChartData,
        exportData,
        rankingTitle,
        internationalRegistrations,
    } = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const cutoffDate = new Date("2025-01-01T00:00:00Z");

        // --- International View Logic ---
        if (viewMode === 'international') {
            const internationalData = allData.filter(row => row.college_country && row.college_country.toLowerCase() !== 'india');
            return {
                summaryStats: {
                    total: internationalData.length,
                    activeGroups: new Set(internationalData.map(r => r.college_country).filter(Boolean)).size,
                    activeGroupsTitle: 'Countries Active',
                    new: internationalData.filter(s => new Date(s.updated_at) > cutoffDate).length,
                    today: internationalData.filter(s => s.updated_at.startsWith(today)).length,
                },
                internationalRegistrations: internationalData, // Data for the international table
                districtsForFilter: [],
                sortedItems: [],
                performanceChartData: [],
                trendChartData: internationalData,
                exportData: internationalData,
                rankingTitle: 'International Registrations',
            };
        }

        // --- Domestic (State/District) View Logic ---
        const domesticData = allData.filter(row => !row.college_country || row.college_country.toLowerCase() === 'india');
 
        const groupingKey = viewMode === 'state' ? 'college_state' : (viewMode === 'college' ? 'college_district' : 'native_district');
 
        const dataToProcess = selectedDistrict === 'all' || viewMode === 'state'
            ? domesticData
            : domesticData.filter(row => row[groupingKey] === selectedDistrict);

        const uniqueDistricts = [...new Set(domesticData.map(r => r.college_district).filter(Boolean))].sort();

        const groupedData = dataToProcess.reduce((acc, reg) => {
            const key = reg[groupingKey];
            if (key) {
                if (!acc[key]) acc[key] = [];
                acc[key].push(reg);
            }
            return acc;
        }, {} as Record<string, RegistrationData[]>);

        const sortedEntries = Object.entries(groupedData).sort(([, a], [, b]) => b.length - a.length);

        const performanceData = sortedEntries.map(([name, registrations]) => ({
            name,
            count: registrations.length,
        }));
 
        let title = 'District Rankings & Details';
        if (viewMode === 'state') title = 'State Rankings & Details';
        if (viewMode === 'native') title = 'District Rankings & Details (Native)';

        return {
            summaryStats: {
                total: domesticData.length,
                activeGroups: new Set(domesticData.map(r => r[groupingKey]).filter(Boolean)).size,
                activeGroupsTitle: viewMode === 'state' ? 'States Active' : 'Districts Active',
                new: domesticData.filter(s => new Date(s.updated_at) > cutoffDate).length,
                today: domesticData.filter(s => s.updated_at.startsWith(today)).length,
            },
            districtsForFilter: uniqueDistricts,
            sortedItems: sortedEntries,
            performanceChartData: performanceData,
            trendChartData: dataToProcess,
            exportData: dataToProcess,
            rankingTitle: title,
            internationalRegistrations: [],
        };
    }, [allData, viewMode, selectedDistrict]);

    const handleExport = () => {
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Registrations\_${viewMode}\_${date}`;
        exportToExcel(exportData, fileName);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-600 font-medium text-lg">Loading State Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">State Registration Overview</h1>
                            <p className="text-slate-500 mt-1">Welcome, <span className="font-semibold text-indigo-600">{user.name}</span></p>
                        </div>
                        <HeaderActions onExport={handleExport} onLogout={onLogout} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SummaryCard title="Total Registrations" value={summaryStats.total} icon={Users} gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
                    {/* UPDATED: Summary card is now dynamic */}
                    <SummaryCard title={summaryStats.activeGroupsTitle} value={summaryStats.activeGroups} icon={viewMode === 'international' ? Globe : Map} gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
                    <SummaryCard title="New Registrants" value={summaryStats.new} icon={UserPlus} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
                    <SummaryCard title="Today's Registrations" value={summaryStats.today} icon={Calendar} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
                </div>

                <StateFilterControls
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    districts={districtsForFilter}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                />
 
                <div className="my-8">
                    <RegistrationTrend data={trendChartData} />
                </div>

                {/* UPDATED: Conditionally render based on viewMode */}
                {viewMode === 'international' ? (
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">{rankingTitle}</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">College</th>
                                        <th className="p-3">Country</th>
                                        <th className="p-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {internationalRegistrations.map(reg => (
                                        <tr key={reg.id} className="border-b border-slate-100">
                                            <td className="p-3 font-medium">{reg.name}</td>
                                            <td className="p-3 text-slate-600">{reg.college}</td>
                                            <td className="p-3 text-slate-600">{reg.college_country}</td>
                                            <td className="p-3 text-slate-500">{new Date(reg.updated_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <DistrictPerformanceChart districtData={performanceChartData} />
 
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                                        {rankingTitle}
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Showing {sortedItems.length} groups, ranked by total registrations.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 lg:space-y-6">
                                {/* UPDATED: Using RankingAccordionCard with dynamic props */}
                                {sortedItems.map(([groupName, registrations], index) => (
                                    <RankingAccordionCard
                                        key={groupName}
                                        groupName={groupName}
                                        registrations={registrations}
                                        rank={index + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StateDashboard;

