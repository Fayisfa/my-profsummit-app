import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { getAllRegisteredData, getGirlsRegistration } from '../api';
import { Users, Calendar, ChevronDown, TrendingUp, Globe, UserRound, PersonStanding } from 'lucide-react';
import { exportToExcel } from '../utils/export';

// Import all our specialized components
import StateFilterControls from '../components/StateFilterControls';
import type { ViewMode } from '../components/StateFilterControls';
import RegistrationTrend from '../components/RegistrationTrend';
import HeaderActions from '../components/HeaderActions';
import DistrictPerformanceChart from '../components/DistrictPerformanceChart';

// --- Reusable UI Components (No changes here) ---
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

            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
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
    const [girlsData, setGirlsData] = useState<RegistrationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('college');
    const [selectedDistrict, setSelectedDistrict] = useState('all');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [boysRegData, girlsRegData] = await Promise.all([
                getAllRegisteredData(),
                getGirlsRegistration()
            ]);

            if (Array.isArray(boysRegData)) setAllData(boysRegData);
            if (Array.isArray(girlsRegData)) setGirlsData(girlsRegData);

            setIsLoading(false);
        };
        loadData();
    }, []);

    // UPDATED: Destructure the new 'internationalCount' property from the hook
    const {
        summaryStats,
        districtsForFilter,
        sortedItems,
        performanceChartData,
        trendChartData,
        exportData,
        rankingTitle,
        internationalRegistrations,
        internationalCount, // NEW: Get the count for the new card
    } = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        
        // NEW: Calculate the total international count unconditionally at the top
        const totalInternationalCount = allData.filter(row => row.college_country && row.college_country.toLowerCase() !== 'india').length
                                       + girlsData.filter(row => row.college_country && row.college_country.toLowerCase() !== 'india').length;

        // --- International View Logic ---
        if (viewMode === 'international') {
            const internationalBoys = allData.filter(row => row.college_country && row.college_country.toLowerCase() !== 'india');
            const internationalGirls = girlsData.filter(row => row.college_country && row.college_country.toLowerCase() !== 'india');
            const internationalData = [...internationalBoys, ...internationalGirls];

            return {
                summaryStats: {
                    total: internationalData.length,
                    boysCount: internationalBoys.length,
                    girlsCount: internationalGirls.length,
                    today: internationalData.filter(s => s.updated_at && s.updated_at.startsWith(today)).length,
                },
                internationalRegistrations: internationalData.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
                districtsForFilter: [],
                sortedItems: [],
                performanceChartData: [],
                trendChartData: internationalData,
                exportData: internationalData,
                rankingTitle: 'International Registrations',
                internationalCount: totalInternationalCount, // UPDATED: Return the count
            };
        }

        // --- Domestic (State/District) View Logic ---
        const domesticBoys = allData.filter(row => !row.college_country || row.college_country.toLowerCase() === 'india');
        const domesticGirls = girlsData;
        
        const groupingKey = viewMode === 'state' ? 'college_state' : (viewMode === 'college' ? 'college_district' : 'native_district');
        
        const dataToProcess = selectedDistrict === 'all' || viewMode === 'state'
            ? domesticBoys
            : domesticBoys.filter(row => row[groupingKey] === selectedDistrict);

        const uniqueDistricts = [...new Set(domesticBoys.map(r => r.college_district).filter(Boolean))].sort();

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
                total: domesticBoys.length + domesticGirls.length + totalInternationalCount, // UPDATED: Include international count in total
                boysCount: domesticBoys.length,
                girlsCount: domesticGirls.length,
                today: domesticBoys.filter(s => s.updated_at && s.updated_at.startsWith(today)).length + domesticGirls.filter(s => s.updated_at && s.updated_at.startsWith(today)).length,
            },
            districtsForFilter: uniqueDistricts,
            sortedItems: sortedEntries,
            performanceChartData: performanceData,
            trendChartData: [...dataToProcess, ...domesticGirls],
            exportData: dataToProcess,
            rankingTitle: title,
            internationalRegistrations: [],
            internationalCount: totalInternationalCount, // UPDATED: Return the count
        };
    }, [allData, girlsData, viewMode, selectedDistrict]);

    const handleExport = () => {
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Registrations_${viewMode}_${date}`;
        exportToExcel(exportData, fileName);
    };

    if (isLoading) {
        // ... loading spinner JSX (no changes)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header section (no changes) */}
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
                {/* UPDATED: The grid can now accommodate 5 cards. When the Global card is hidden, the last card will just have an empty space next to it on large screens. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <SummaryCard title="Total Registrations" value={summaryStats.total} icon={Users} gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
                    <SummaryCard title="Boys Registrations" value={summaryStats.boysCount} icon={PersonStanding} gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
                    <SummaryCard title="Girls Registrations" value={summaryStats.girlsCount} icon={UserRound} gradient="bg-gradient-to-br from-pink-500 to-rose-600" />
                    
                    {/* NEW: Conditionally rendered card for Global count */}
                    {viewMode !== 'international' && (
                         <SummaryCard title="Global Registrations" value={internationalCount} icon={Globe} gradient="bg-gradient-to-br from-slate-600 to-slate-800" />
                    )}

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