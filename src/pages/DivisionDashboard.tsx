// import React, { useState, useEffect, useMemo } from 'react';
// import type { User, RegistrationData } from '../utils/types';
// import { getAllRegisteredData } from '../api'; // We need all data for this view
// import { Users, Building, Home, ChevronDown, TrendingUp, BarChart3, Map } from 'lucide-react';
// import { exportToExcel } from '../utils/export';
// import HeaderActions from '../components/HeaderActions'; // Reusing existing component

// // --- Reusable UI Components ---

// const SummaryCard: React.FC<{
//     title: string;
//     value: number | string;
//     icon: React.ElementType;
//     gradient: string;
// }> = ({ title, value, icon: Icon, gradient }) => (
//     <div className={`${gradient} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden`}>
//         <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
//         <div className="relative z-10 flex items-center justify-between">
//             <div>
//                 <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{value}</p>
//                 <p className="text-sm font-medium text-white/90">{title}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
//                 <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
//             </div>
//         </div>
//     </div>
// );

// const ViewModeToggle: React.FC<{
//     viewMode: 'college' | 'native';
//     setViewMode: (mode: 'college' | 'native') => void;
// }> = ({ viewMode, setViewMode }) => (
//     <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
//         <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">
//             <div className="flex-shrink-0">
//                 <p className="text-sm font-semibold text-slate-700 mb-3 lg:mb-0 lg:mr-4">View Mode:</p>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl">
//                     <button
//                         onClick={() => setViewMode('college')}
//                         className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${viewMode === 'college'
//                                 ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
//                                 : 'text-slate-600 hover:bg-slate-200'
//                             }`}
//                     >
//                         <Building className="w-4 h-4" />
//                         College District
//                     </button>
//                     <button
//                         onClick={() => setViewMode('native')}
//                         className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${viewMode === 'native'
//                                 ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
//                                 : 'text-slate-600 hover:bg-slate-200'
//                             }`}
//                     >
//                         <Home className="w-4 h-4" />
//                         Native District
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
// );


// const DivisionAccordionCard: React.FC<{
//     divisionName: string;
//     students: RegistrationData[];
//     rank: number;
// }> = ({ divisionName, students, rank }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     // This useMemo calculates the college breakdown only when needed (i.e., when the component is rendered)
//     const topColleges = useMemo(() => {
//         const grouped = students.reduce((acc, student) => {
//             const college = student.college || 'Unknown College';
//             if (!acc[college]) acc[college] = 0;
//             acc[college]++;
//             return acc;
//         }, {} as Record<string, number>);

//         return Object.entries(grouped)
//             .sort(([, a], [, b]) => b - a); // Sort colleges by count

//     }, [students]);

//     return (
//         <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
//             {/* Header */}
//             <div
//                 className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
//                     <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                         <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
//                     </div>
//                     <div className="min-w-0 flex-1">
//                         <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-cyan-600 transition-colors">
//                             {divisionName}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">{students.length} Total Registrations</p>
//                     </div>
//                 </div>
//                 <ChevronDown className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
//             </div>

//             {/* Expandable Content */}
//             <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
//                 <div className="border-t border-slate-100 p-4 lg:p-6 bg-slate-50/50">
//                     <h4 className="font-semibold mb-4 text-slate-700">College Breakdown for {divisionName}</h4>
//                     {topColleges.length > 0 ? (
//                         <ul className="space-y-2">
//                             {topColleges.map(([name, count]) => (
//                                 <li key={name} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100">
//                                     <span className="text-slate-600">{name}</span>
//                                     <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">{count}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-slate-500 text-sm">No college data available for this division.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- MAIN DIVISION DASHBOARD COMPONENT ---

// interface DivisionDashboardProps {
//     user: User;
//     onLogout: () => void;
// }

// const DivisionDashboard: React.FC<DivisionDashboardProps> = ({ user, onLogout }) => {
//     const [allData, setAllData] = useState<RegistrationData[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [viewMode, setViewMode] = useState<'college' | 'native'>('college');

//     useEffect(() => {
//         const loadData = async () => {
//             setIsLoading(true);
//             const data = await getAllRegisteredData(); // Fetch all data
//             if (Array.isArray(data)) {
//                 setAllData(data);
//             }
//             setIsLoading(false);
//         };
//         loadData();
//     }, []);

//     const { summaryStats, sortedDivisions } = useMemo(() => {
//         // Determine which field to use for grouping based on the view mode
//         const divisionKey = viewMode === 'college' ? 'college_division' : 'native_division';

//         // Group all data by the selected division key
//         const groupedByDivision = allData.reduce((acc, student) => {
//             const division = student[divisionKey];
//             if (division) { // Only include students who have a value for this division
//                 if (!acc[division]) {
//                     acc[division] = [];
//                 }
//                 acc[division].push(student);
//             }
//             return acc;
//         }, {} as Record<string, RegistrationData[]>);

//         // Sort the divisions by the number of registrations in descending order
//         const sortedDivisionEntries = Object.entries(groupedByDivision)
//             .sort(([, a_students], [, b_students]) => b_students.length - a_students.length);

//         const stats = {
//             totalRegistrations: allData.length,
//             totalDivisions: sortedDivisionEntries.length,
//         };

//         return {
//             summaryStats: stats,
//             sortedDivisions: sortedDivisionEntries,
//         };
//     }, [allData, viewMode]);


//     const handleExport = () => {
//         const date = new
//             Date().toISOString().split('T')[0];
//         const fileName = `ProfSummit_Registrations_By_Division_${viewMode}_${date}`;
//         // Flatten the data for export
//         const dataToExport = sortedDivisions.flatMap(([divisionName, students]) =>
//             students.map(student => ({
//                 'Division': divisionName,
//                 'View Mode': viewMode,
//                 ...student // Spread all student properties
//             }))
//         );
//         exportToExcel(dataToExport, fileName);
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
//                 <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
//             {/* Header */}
//             <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
//                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                         <div>
//                             <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
//                                 Division Dashboard
//                             </h1>
//                             <p className="text-slate-500 mt-1 text-sm lg:text-base">
//                                 An overview of registrations grouped by division.
//                             </p>
//                         </div>
//                         <HeaderActions onExport={handleExport} onLogout={onLogout} />
//                     </div>
//                 </div>
//             </div>

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//                 {/* Summary Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
//                     <SummaryCard
//                         title="Total Registrations"
//                         value={summaryStats.totalRegistrations}
//                         icon={Users}
//                         gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
//                     />
//                     <SummaryCard
//                         title="Active Divisions"
//                         value={summaryStats.totalDivisions}
//                         icon={Map}
//                         gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
//                     />
//                 </div>

//                 {/* Filter Controls */}
//                 <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

//                 {/* Results */}
//                 {sortedDivisions.length === 0 ? (
//                     <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-100">
//                         <h3 className="text-2xl font-bold text-slate-700">No Division Data</h3>
//                         <p className="text-slate-500 mt-2">No registrations with division information were found.</p>
//                     </div>
//                 ) : (
//                     <div>
//                         <div className="mb-6">
//                             <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
//                                 <TrendingUp className="w-6 h-6 text-cyan-600" />
//                                 Divisions Ranked by Registrations
//                             </h2>
//                             <p className="text-slate-500 text-sm mt-1">
//                                 Showing <span className="font-semibold text-cyan-600">{sortedDivisions.length}</span> divisions based on{' '}
//                                 <span className="font-semibold text-cyan-600">{viewMode === 'college' ? 'College District' : 'Native District'}</span> view.
//                             </p>
//                         </div>
//                         <div className="space-y-4 lg:space-y-6">
//                             {sortedDivisions.map(([divisionName, students], index) => (
//                                 <DivisionAccordionCard
//                                     key={divisionName}
//                                     divisionName={divisionName}
//                                     students={students}
//                                     rank={index + 1}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default DivisionDashboard;

// import React, { useState, useEffect, useMemo } from 'react';
// import type { User, RegistrationData } from '../utils/types';
// import { getRegisteredData } from '../api';
// import { Users, Building, Home, ChevronDown, TrendingUp, Map } from 'lucide-react';
// import { exportToExcel } from '../utils/export';
// import HeaderActions from '../components/HeaderActions';

// // --- Reusable UI Components (No changes needed here) ---

// const SummaryCard: React.FC<{
//     title: string;
//     value: number | string;
//     icon: React.ElementType;
//     gradient: string;
// }> = ({ title, value, icon: Icon, gradient }) => (
//     <div className={`${gradient} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden`}>
//         <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
//         <div className="relative z-10 flex items-center justify-between">
//             <div>
//                 <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{value}</p>
//                 <p className="text-sm font-medium text-white/90">{title}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
//                 <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
//             </div>
//         </div>
//     </div>
// );

// const ViewModeToggle: React.FC<{
//     viewMode: 'college' | 'native';
//     setViewMode: (mode: 'college' | 'native') => void;
// }> = ({ viewMode, setViewMode }) => (
//     <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
//         <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">
//             <div className="flex-shrink-0">
//                 <p className="text-sm font-semibold text-slate-700 mb-3 lg:mb-0 lg:mr-4">View Mode:</p>
//                 <div className="flex bg-slate-100 p-1 rounded-2xl">
//                     <button
//                         onClick={() => setViewMode('college')}
//                         className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${viewMode === 'college'
//                                 ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
//                                 : 'text-slate-600 hover:bg-slate-200'
//                             }`}
//                     >
//                         <Building className="w-4 h-4" />
//                         College District
//                     </button>
//                     <button
//                         onClick={() => setViewMode('native')}
//                         className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 justify-center ${viewMode === 'native'
//                                 ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
//                                 : 'text-slate-600 hover:bg-slate-200'
//                             }`}
//                     >
//                         <Home className="w-4 h-4" />
//                         Native District
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const DivisionAccordionCard: React.FC<{
//     divisionName: string;
//     students: RegistrationData[];
//     rank: number;
// }> = ({ divisionName, students, rank }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     const topColleges = useMemo(() => {
//         const grouped = students.reduce((acc, student) => {
//             const college = student.college || 'Unknown College';
//             if (!acc[college]) acc[college] = 0;
//             acc[college]++;
//             return acc;
//         }, {} as Record<string, number>);

//         return Object.entries(grouped).sort(([, a], [, b]) => b - a);
//     }, [students]);

//     return (
//         <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
//             <div
//                 className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
//                     <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                         <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
//                     </div>
//                     <div className="min-w-0 flex-1">
//                         <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-cyan-600 transition-colors">
//                             {divisionName}
//                         </h3>
//                         <p className="text-sm text-slate-500 mt-1">{students.length} Total Registrations</p>
//                     </div>
//                 </div>
//                 <ChevronDown className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
//             </div>

//             <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
//                 <div className="border-t border-slate-100 p-4 lg:p-6 bg-slate-50/50">
//                     <h4 className="font-semibold mb-4 text-slate-700">College Breakdown for {divisionName}</h4>
//                     {topColleges.length > 0 ? (
//                         <ul className="space-y-2">
//                             {topColleges.map(([name, count]) => (
//                                 <li key={name} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100">
//                                     <span className="text-slate-600">{name}</span>
//                                     <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">{count}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-slate-500 text-sm">No college data available for this division.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- MAIN DIVISION DASHBOARD COMPONENT ---

// interface DivisionDashboardProps {
//     user: User;
//     onLogout: () => void;
// }

// const DivisionDashboard: React.FC<DivisionDashboardProps> = ({ user, onLogout }) => {
//     const [allData, setAllData] = useState<RegistrationData[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [viewMode, setViewMode] = useState<'college' | 'native'>('college');

//     useEffect(() => {
//         const loadData = async () => {
//             if (!user || !user.name) return;
//             setIsLoading(true);
//             const data = await getRegisteredData(user.name);
//             if (Array.isArray(data)) {
//                 setAllData(data);
//             }
//             setIsLoading(false);
//         };
//         loadData();
//     }, [user]);

//     // ▼ MODIFIED: Logic now pre-filters data based on viewMode before grouping
//     const { summaryStats, sortedDivisions } = useMemo(() => {
//         // 1. Define which district and division fields to use based on the view mode
//         const districtKey = viewMode === 'college' ? 'college_district' : 'native_district';
//         const divisionKey = viewMode === 'college' ? 'college_division' : 'native_division';

//         // 2. Filter the raw data to only include students whose relevant district matches the logged-in user
//         const filteredData = allData.filter(student => student[districtKey] === user.name);

//         // 3. Group the *newly filtered data* by division
//         const groupedByDivision = filteredData.reduce((acc, student) => {
//             const division = student[divisionKey];
//             if (division) {
//                 if (!acc[division]) {
//                     acc[division] = [];
//                 }
//                 acc[division].push(student);
//             }
//             return acc;
//         }, {} as Record<string, RegistrationData[]>);

//         // 4. Sort the resulting divisions by registration count
//         const sortedDivisionEntries = Object.entries(groupedByDivision)
//             .sort(([, a_students], [, b_students]) => b_students.length - a_students.length);

//         // 5. Calculate stats based on the correctly filtered data
//         const stats = {
//             totalRegistrations: filteredData.length,
//             totalDivisions: sortedDivisionEntries.length,
//         };

//         return {
//             summaryStats: stats,
//             sortedDivisions: sortedDivisionEntries,
//         };
//     }, [allData, viewMode, user.name]); // Add user.name to dependency array for correctness

//     const handleExport = () => {
//         const date = new Date().toISOString().split('T')[0];
//         const fileName = `Divisions_${user.name}_${viewMode}_${date}`;
//         const dataToExport = sortedDivisions.flatMap(([divisionName, students]) =>
//             students.map(student => ({
//                 'Division': divisionName,
//                 'View Mode': viewMode,
//                 ...student,
//             }))
//         );
//         exportToExcel(dataToExport, fileName);
//     };
    
//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
//                 <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
//             <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
//                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                         <div>
//                             <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
//                                 Division Overview
//                             </h1>
//                             <p className="text-slate-500 mt-1 text-sm lg:text-base">
//                                 Showing divisions for <span className="font-semibold text-cyan-600">{user.name} District</span>
//                             </p>
//                         </div>
//                         <HeaderActions onExport={handleExport} onLogout={onLogout} />
//                     </div>
//                 </div>
//             </div>

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
//                      {/* The summary cards now correctly reflect the filtered counts */}
//                     <SummaryCard
//                         title="Total Registrations"
//                         value={summaryStats.totalRegistrations}
//                         icon={Users}
//                         gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
//                     />
//                     <SummaryCard
//                         title="Active Divisions"
//                         value={summaryStats.totalDivisions}
//                         icon={Map}
//                         gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
//                     />
//                 </div>

//                 <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

//                 {sortedDivisions.length === 0 ? (
//                     <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-100">
//                         <h3 className="text-2xl font-bold text-slate-700">No Division Data Found</h3>
//                         <p className="text-slate-500 mt-2">No registrations with division information were found for your district in the selected view.</p>
//                     </div>
//                 ) : (
//                     <div>
//                         <div className="mb-6">
//                             <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
//                                 <TrendingUp className="w-6 h-6 text-cyan-600" />
//                                 Divisions Ranked by Registrations
//                             </h2>
//                             <p className="text-slate-500 text-sm mt-1">
//                                 Showing <span className="font-semibold text-cyan-600">{summaryStats.totalDivisions}</span> divisions with{' '}
//                                 <span className="font-semibold text-cyan-600">{summaryStats.totalRegistrations}</span> total registrations.
//                             </p>
//                         </div>
//                         <div className="space-y-4 lg:space-y-6">
//                             {sortedDivisions.map(([divisionName, students], index) => (
//                                 <DivisionAccordionCard
//                                     key={divisionName}
//                                     divisionName={divisionName}
//                                     students={students}
//                                     rank={index + 1}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default DivisionDashboard;

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { getRegisteredData, getAllRegisteredData } from '../api';
import { Users, Building, Home, ChevronDown, TrendingUp, Map } from 'lucide-react';
import { exportToExcel } from '../utils/export';
import HeaderActions from '../components/HeaderActions';

//=================================================================
//  1. REUSABLE SUB-COMPONENTS
//=================================================================

// --- Summary Card ---
const SummaryCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ElementType;
  gradient: string;
}> = ({ title, value, icon: Icon, gradient }) => (
  <div className={`${gradient} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden`}>
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-white/90">{title}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
        <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </div>
    </div>
  </div>
);

// --- Filter Controls ---
const FilterControls: React.FC<{
  viewMode: 'college' | 'native';
  setViewMode: (mode: 'college' | 'native') => void;
  isStateAdmin: boolean;
  districts: string[];
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
}> = ({ viewMode, setViewMode, isStateAdmin, districts, selectedDistrict, setSelectedDistrict }) => (
  <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
    <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
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

// --- Division Accordion Card ---
const DivisionAccordionCard: React.FC<{
  divisionName: string;
  students: RegistrationData[];
  rank: number;
}> = ({ divisionName, students, rank }) => {
  const [isOpen, setIsOpen] = useState(false);
  const topColleges = useMemo(() => {
    const grouped = students.reduce((acc, student) => {
      const college = student.college || 'Unknown College';
      if (!acc[college]) acc[college] = 0;
      acc[college]++;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).sort(([, a], [, b]) => b - a);
  }, [students]);

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      <div
        className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-cyan-600 transition-colors">
              {divisionName}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{students.length} Total Registrations</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
        <div className="border-t border-slate-100 p-4 lg:p-6 bg-slate-50/50">
          <h4 className="font-semibold mb-4 text-slate-700">College Breakdown for {divisionName}</h4>
          {topColleges.length > 0 ? (
            <ul className="space-y-2">
              {topColleges.map(([name, count]) => (
                <li key={name} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100">
                  <span className="text-slate-600">{name}</span>
                  <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">No college data available for this division.</p>
          )}
        </div>
      </div>
    </div>
  );
};

//=================================================================
//  2. MAIN DASHBOARD COMPONENT
//=================================================================

interface DivisionDashboardProps {
  user: User;
  onLogout: () => void;
}

const DivisionDashboard: React.FC<DivisionDashboardProps> = ({ user, onLogout }) => {
  const [allData, setAllData] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'college' | 'native'>('college');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const isStateAdmin = user.role === 'State Admin';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = isStateAdmin ? await getAllRegisteredData() : await getRegisteredData(user.name);
      if (Array.isArray(data)) {
        setAllData(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user, isStateAdmin]);

  const { summaryStats, sortedDivisions, districtsForFilter, finalFilteredData } = useMemo(() => {
    const districtKey = viewMode === 'college' ? 'college_district' : 'native_district';
    const divisionKey = viewMode === 'college' ? 'college_division' : 'native_division';

    let dataToProcess: RegistrationData[] = [];

    if (isStateAdmin) {
      dataToProcess = selectedDistrict === 'all'
        ? allData
        : allData.filter(student => student[districtKey] === selectedDistrict);
    } else {
      dataToProcess = allData.filter(student => student[districtKey] === user.name);
    }

    const groupedByDivision = dataToProcess.reduce((acc, student) => {
      const division = student[divisionKey];
      if (division) {
        if (!acc[division]) acc[division] = [];
        acc[division].push(student);
      }
      return acc;
    }, {} as Record<string, RegistrationData[]>);

    const sortedDivisionEntries = Object.entries(groupedByDivision)
      .sort(([, a_students], [, b_students]) => b_students.length - a_students.length);

    const allDistrictsForFilter = isStateAdmin
      ? [...new Set(allData.map(row => row[districtKey]).filter(Boolean))].sort()
      : [];

    const stats = {
      totalRegistrations: dataToProcess.length,
      totalDivisions: sortedDivisionEntries.length,
    };

    return {
      summaryStats: stats,
      sortedDivisions: sortedDivisionEntries,
      districtsForFilter: allDistrictsForFilter,
      finalFilteredData: dataToProcess,
    };
  }, [allData, viewMode, user.name, isStateAdmin, selectedDistrict]);

  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `Divisions_${isStateAdmin ? 'State' : user.name}_${viewMode}_${date}`;
    exportToExcel(finalFilteredData, fileName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
                {isStateAdmin ? 'Statewide Division Overview' : 'Division Overview'}
              </h1>
              <p className="text-slate-500 mt-1 text-sm lg:text-base">
                {isStateAdmin ? 'Viewing all registrations' : `Showing divisions for ${user.name} District`}
              </p>
            </div>
            <HeaderActions onExport={handleExport} onLogout={onLogout} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
          <SummaryCard
            title="Total Registrations (in view)"
            value={summaryStats.totalRegistrations}
            icon={Users}
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
          />
          <SummaryCard
            title="Active Divisions (in view)"
            value={summaryStats.totalDivisions}
            icon={Map}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
        </div>

        <FilterControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          isStateAdmin={isStateAdmin}
          districts={districtsForFilter}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
        />

        {sortedDivisions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-100 mt-8">
            <h3 className="text-2xl font-bold text-slate-700">No Division Data Found</h3>
            <p className="text-slate-500 mt-2">No registrations with division information were found for your current filters.</p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-cyan-600" />
                Divisions Ranked by Registrations
              </h2>
            </div>
            <div className="space-y-4 lg:space-y-6">
              {sortedDivisions.map(([divisionName, students], index) => (
                <DivisionAccordionCard
                  key={divisionName}
                  divisionName={divisionName}
                  students={students}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DivisionDashboard;