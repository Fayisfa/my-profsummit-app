// src/pages/RscDashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { getGlobalRegisteredData } from '../api';
import { Users, UserPlus, Globe, Award, TrendingUp, ChevronDown, PieChart, BarChart, Ticket, Briefcase, BookOpen } from 'lucide-react';
import { exportToExcel } from '../utils/export';
import RegistrationTrend from '../components/RegistrationTrend';
import HeaderActions from '../components/HeaderActions';
import MobileNavBar from '../components/MobileNavBar';
import MobileHeader from '../components/MobileHeader';
import {
  PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// --- Reusable UI Components ---

const SummaryCard: React.FC<{ title: string; value: number | string; icon: React.ElementType; gradient: string; }> = ({ title, value, icon: Icon, gradient }) => (
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

const CountryAccordionCard: React.FC<{ countryName: string; registrants: RegistrationData[]; rank: number; }> = ({ countryName, registrants, rank }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      <div className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-indigo-600 transition-colors">{countryName}</h3>
            <span className="font-medium text-slate-500 text-sm">{registrants.length} Total Registrations</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* --- MODIFIED SECTION --- */}
      {isOpen && (
        <div className="border-t border-slate-100 p-4 bg-slate-50/50 overflow-x-auto">
          <h4 className="text-md font-semibold text-slate-800 mb-4 px-2">
            Showing Top 10 Registrants from {countryName}
          </h4>
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="font-semibold p-2 w-8">#</th>
                <th className="font-semibold p-2">Name</th>
                <th className="font-semibold p-2 hidden md:table-cell">Mobile</th>
                <th className="font-semibold p-2 hidden lg:table-cell">Email</th>
                <th className="font-semibold p-2">College</th>
              </tr>
            </thead>
            <tbody>
              {registrants.slice(0, 10).map((registrant, index) => (
                <tr key={registrant.id} className="border-b border-slate-200 last:border-0 hover:bg-white">
                  <td className="p-2 text-slate-500">{index + 1}</td>
                  <td className="p-2 font-medium text-slate-800">{registrant.name}</td>
                  <td className="p-2 text-slate-600 hidden md:table-cell">{registrant.mobile}</td>
                  <td className="p-2 text-slate-600 hidden lg:table-cell truncate">{registrant.email}</td>
                  <td className="p-2 text-slate-600">{registrant.college || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {registrants.length > 10 && <p className="text-center text-xs text-slate-500 mt-4">...and {registrants.length - 10} more.</p>}
        </div>
      )}
    </div>
  );
};

const AttendanceModePieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const COLORS = ['#6366F1', '#10B981', '#F59E0B']; // Indigo (Offline), Emerald (Online), Amber (TBD)
    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><Ticket className="w-5 h-5 text-indigo-600"/>Attendance Mode</h3>
            <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} registrants`}/>
                    <Legend />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

const ReferralSourcesBarChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><BarChart className="w-5 h-5 text-indigo-600"/>Top Referral Sources</h3>
        <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} interval={0}/>
                <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}}/>
                <Bar dataKey="value" fill="#6366F1" background={{ fill: '#f1f5f9' }} barSize={20} />
            </RechartsBarChart>
        </ResponsiveContainer>
    </div>
);

const TopItemsList: React.FC<{ title: string; items: { name: string; value: number }[]; icon: React.ElementType; }> = ({ title, items, icon: Icon }) => (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><Icon className="w-5 h-5 text-indigo-600"/>{title}</h3>
        {items.length > 0 ? (
            <ul className="space-y-3">
                {items.map(item => (
                    <li key={item.name} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 truncate pr-4">{item.name}</span>
                        <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">{item.value}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data for this category.</p>
        )}
    </div>
);


// --- MAIN RSC DASHBOARD COMPONENT ---
interface RscDashboardProps {
  user: User | null;
  onLogout: () => void;
}

const RscDashboard: React.FC<RscDashboardProps> = ({ user, onLogout }) => {
  const [allData, setAllData] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'student' | 'professional'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getGlobalRegisteredData();
      if (Array.isArray(data)) setAllData(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const {
    summaryStats,
    attendanceModeData,
    referralSourcesData,
    topProfessions,
    topCourses,
    uniqueCountries,
    sortedCountries,
    finalFilteredData
  } = useMemo(() => {
    // Apply filters sequentially
    const typeFilteredData = filterType === 'all' ? allData : allData.filter(p => p.type === filterType);
    const finalFilteredData = selectedCountry === 'all' ? typeFilteredData : typeFilteredData.filter(p => (p.college_country || 'Unknown') === selectedCountry);

    // Calculate global stats from all data, ignoring filters
    const stats = {
      total: allData.length,
      students: allData.filter(p => p.type === 'student').length,
      professionals: allData.filter(p => p.type === 'professional').length,
      countries: [...new Set(allData.map(p => p.college_country).filter(Boolean))].length,
    };

    // Calculate dynamic charts and lists based on filtered data
    const attendanceData = finalFilteredData.reduce((acc, p) => {
        const mode = p.attend_type ? p.attend_type.charAt(0).toUpperCase() + p.attend_type.slice(1) : 'TBD';
        acc[mode] = (acc[mode] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const attendanceChartData = Object.entries(attendanceData).map(([name, value]) => ({ name, value }));
    
    const referralData = finalFilteredData.reduce((acc, p) => {
        const source = p.heard_from || 'Unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const referralChartData = Object.entries(referralData).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));

    const getTopItems = (data: RegistrationData[], key: 'profession' | 'course', type: 'professional' | 'student') => {
        const filtered = data.filter(p => p.type === type && p[key]);
        const counts = filtered.reduce((acc, p) => {
            const item = p[key]!;
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({name, value}));
    };

    const countries = [...new Set(typeFilteredData.map(p => p.college_country || 'Unknown').filter(Boolean))];
    const groupedByCountry = finalFilteredData.reduce((acc, p) => {
      const country = p.college_country || 'Unknown';
      if (!acc[country]) acc[country] = [];
      acc[country].push(p);
      return acc;
    }, {} as Record<string, RegistrationData[]>);
    const sortedCountryEntries = Object.entries(groupedByCountry).sort(([, a], [, b]) => b.length - a.length);

    return {
      summaryStats: stats,
      attendanceModeData: attendanceChartData,
      referralSourcesData: referralChartData,
      topProfessions: getTopItems(finalFilteredData, 'profession', 'professional'),
      topCourses: getTopItems(finalFilteredData, 'course', 'student'),
      uniqueCountries: countries,
      sortedCountries: sortedCountryEntries,
      finalFilteredData: finalFilteredData
    };
  }, [allData, filterType, selectedCountry]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium text-lg">Loading Global Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0];
    exportToExcel(finalFilteredData, `ProfSummit_Global_Registrations_${date}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
      <div className="hidden lg:block bg-white/90 backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">Global Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome, <span className="font-semibold text-indigo-600">{user?.name}</span></p>
            </div>
            <HeaderActions onExport={handleExport} onLogout={onLogout} />
          </div>
        </div>
      </div>
      <MobileHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* --- Top Row: Summary Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Registrations" value={summaryStats.total} icon={Users} gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
          <SummaryCard title="Students" value={summaryStats.students} icon={Award} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <SummaryCard title="Professionals" value={summaryStats.professionals} icon={UserPlus} gradient="bg-gradient-to-br from-blue-500 to-cyan-600" />
          <SummaryCard title="Countries Represented" value={summaryStats.countries} icon={Globe} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        </div>

        {/* --- Second Row: Registration Trend (Now at the top) --- */}
        <div className="mb-8">
            <RegistrationTrend data={finalFilteredData} />
        </div>

        {/* --- Third Row: Filter Controls --- */}
        <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Filter by Type:</p>
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        {(['all', 'student', 'professional'] as const).map(type => (
                            <button key={type} onClick={() => setFilterType(type)} className={`capitalize flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${filterType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'}`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Filter by Country:</p>
                    <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="w-full py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm appearance-none px-4">
                        <option value="all">All Countries</option>
                        {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
        </div>

        

        {/* --- Fifth Row: Dynamic Top Lists --- */}
        {filterType !== 'all' && (
            <div className="mb-8">
                <TopItemsList 
                    title={filterType === 'student' ? 'Top 5 Courses' : 'Top 5 Professions'}
                    items={filterType === 'student' ? topCourses : topProfessions}
                    icon={filterType === 'student' ? BookOpen : Briefcase}
                />
            </div>
        )}

        {/* --- Main Content: Ranked Countries --- */}
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-600" /> Countries by Registrations
          </h2>
          {sortedCountries.length > 0 ? (
            <div className="space-y-4 lg:space-y-6">
              {sortedCountries.map(([countryName, registrants], index) => (
                <CountryAccordionCard key={countryName} countryName={countryName} registrants={registrants} rank={index + 1} />
              ))}
            </div>
          ) : ( <p className="text-slate-500 text-center py-8">No data matches the current filters.</p> )}
        </div>

        {/* --- Fourth Row: Detailed Charts (Now below filters) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
            <AttendanceModePieChart data={attendanceModeData} />
            <ReferralSourcesBarChart data={referralSourcesData} />
        </div>

      </main>
      <MobileNavBar onExport={handleExport} onLogout={onLogout} />
    </div>
  );
};

export default RscDashboard;