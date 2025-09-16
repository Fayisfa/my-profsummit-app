import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../utils/types';
import { getRegisteredData } from '../api';
import { Users, UserPlus, Calendar, Home, Building, ChevronDown, Search, Filter, Download, TrendingUp, Award } from 'lucide-react';
import type { RegistrationData } from '../utils/types';
import { exportToExcel } from '../utils/export';
import RegistrationTrend from '../components/RegistrationTrend';
import HeaderActions from '../components/HeaderActions';
import MobileNavBar from '../components/MobileNavBar';
import MobileHeader from '../components/MobileHeader';



// Enhanced Summary Card with gradients and animations
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

// Enhanced College Accordion with better mobile design
const CollegeAccordionCard: React.FC<{
  collegeName: string;
  students: RegistrationData[];
  viewMode: 'college' | 'native';
  rank: number;
}> = ({ collegeName, students, viewMode, rank }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cutoffDate = new Date("2025-01-01T00:00:00Z");

  const newRegistrants = students.filter(
    s => new Date(s.created_at) > cutoffDate
  ).length;

  const returningMembers = students.length - newRegistrants;


  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      {/* Enhanced Header */}
      <div
        className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          {/* Rank Badge */}
          <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm lg:text-base">#{rank}</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-indigo-600 transition-colors">
              {collegeName}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-slate-500 mt-1">
              <span className="font-medium">{students.length} Total Registrations</span>
              <div className="hidden sm:flex items-center gap-4">
                <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                  {newRegistrants} New
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                  {returningMembers} Returning
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile stats and chevron */}
        <div className="flex items-center gap-3">
          <div className="sm:hidden flex flex-col gap-1">
            <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
              {newRegistrants} New
            </span>
            <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
              {returningMembers} Ret.
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-400 transition-transform duration-300 group-hover:text-slate-600 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </div>
      </div>

      {/* Enhanced Expandable Content */}
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
        <div className="border-t border-slate-100 p-4 lg:p-6 bg-gradient-to-r from-slate-50/50 to-slate-100/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

<thead className="text-left text-slate-600 border-b border-slate-200">
  <tr>
    <th className="p-2 font-semibold w-8">#</th>

    {/* ▼ MODIFIED: Header text now changes based on screen size ▼ */}
    <th className="p-2 font-semibold">
      <span className="lg:hidden">Student</span>
      <span className="hidden lg:inline">Name</span>
    </th>

    {/* <th className="p-2 font-semibold">Division</th> */}
    <th className="p-2 font-semibold hidden lg:table-cell">Phone</th>
    <th className="p-2 font-semibold">Registered</th>
  </tr>
</thead>


              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="border-b border-slate-100 hover:bg-white/80 transition-colors">
                    <td className="p-2 text-slate-500 font-medium">{index + 1}</td>

                    {/* ▼ MODIFIED: Name and Mobile are now stacked on mobile screens ▼ */}
                    <td className="p-2 font-medium">
                      <div className="text-slate-800">{student.name}</div>
                      <div className="lg:hidden text-sm text-slate-500 font-normal">{student.mobile}</div>
                    </td>

                    {/* <td className="p-2 text-slate-600">
                      <span className="inline-block px-3 py-1 bg-slate-100 ...">
                        {viewMode === 'college' ? student.college_division : student.native_division}
                      </span>
                    </td> */}

                    {/* ▼ NO CHANGE NEEDED HERE: This column now correctly handles the desktop view ▼ */}
                    <td className="p-2 text-slate-600 hidden lg:table-cell">{student.mobile}</td>

                    <td className="p-2 text-slate-600">{new Date(student.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Filter Section
const FilterSection: React.FC<{
  viewMode: 'college' | 'native';
  setViewMode: (mode: 'college' | 'native') => void;
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  divisions: string[];
}> = ({ viewMode, setViewMode, selectedDivision, setSelectedDivision, divisions }) => (
  <div className="bg-white rounded-3xl shadow-lg p-4 lg:p-6 mb-8 border border-slate-100">
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">
      {/* View Mode Toggle */}
      <div className="flex-shrink-0">
        <p className="text-sm font-semibold text-slate-700 mb-3 lg:mb-0 lg:mr-4">View Mode:</p>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('college')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 lg:flex-initial justify-center ${viewMode === 'college'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
              }`}
          >
            <Building className="w-4 h-4" />
            College District
          </button>
          <button
            onClick={() => setViewMode('native')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-1 lg:flex-initial justify-center ${viewMode === 'native'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
              }`}
          >
            <Home className="w-4 h-4" />
            Native District
          </button>
        </div>
      </div>

      {/* Division Filter */}
      <div className="flex-1 lg:max-w-xs">
        <p className="text-sm font-semibold text-slate-700 mb-3">Filter by Division:</p>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={selectedDivision}
            onChange={e => setSelectedDivision(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all shadow-sm hover:shadow-md"
          >
            <option value="all">All Divisions</option>
            {divisions.map(div => <option key={div} value={div}>{div}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---
interface DistrictDashboardProps {
  user: User;
  onLogout: () => void;
}

const DistrictDashboard: React.FC<DistrictDashboardProps> = ({ user, onLogout }) => {
  const [allData, setAllData] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for our filters
  const [viewMode, setViewMode] = useState<'college' | 'native'>('college');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      if (!user || !user.name) return;
      setIsLoading(true);
      const data = await getRegisteredData(user.name);
      if (Array.isArray(data)) {
        setAllData(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  // This is where all the magic happens. We use `useMemo` so that these complex
  // calculations only re-run when the data or filters change, not on every render.
  const {
    summaryStats,
    divisions,
    sortedColleges,
    finalFilteredData // <-- Add this
  } = useMemo(() => {
    // 1. Primary Filter: Based on the "College" vs "Native" toggle
    const baseFilteredData = allData.filter(row => {
      const districtField = viewMode === 'college' ? row.college_district : row.native_district;
      return districtField === user.name;
    });

    // 2. Secondary Filter: Based on the selected division
    const finalFilteredData = selectedDivision === 'all'
      ? baseFilteredData
      : baseFilteredData.filter(row => {
        const divisionField = viewMode === 'college' ? row.college_division : row.native_division;
        return divisionField === selectedDivision;
      });

    // 3. Calculate Summary Statistics from the filtered data
    const today = new Date().toISOString().split('T')[0];
    const cutoffDate = new Date("2025-01-01T00:00:00Z");

    const stats = {
      total: finalFilteredData.length,
      new: finalFilteredData.filter(s => new Date(s.created_at) > cutoffDate).length,
      returning: finalFilteredData.filter(s => new Date(s.created_at) <= cutoffDate).length,
      today: finalFilteredData.filter(s => s.updated_at.startsWith(today)).length,
    };




    // 4. Get a unique list of divisions for the dropdown filter
    const uniqueDivisions = [...new Set(baseFilteredData.map(row => viewMode === 'college' ? row.college_division : row.native_division).filter(Boolean))];

    // 5. Group the filtered data by college for the accordion view
    const groupedByCollege = finalFilteredData.reduce((acc, student) => {
      const college = student.college || 'Unknown College';
      if (!acc[college]) {
        acc[college] = [];
      }
      acc[college].push(student);
      return acc;
    }, {} as Record<string, RegistrationData[]>);

    // 6. Sort colleges by registration count for ranking
    const sortedCollegeEntries = Object.entries(groupedByCollege)
      .sort(([, a], [, b]) => b.length - a.length);

    return {
      summaryStats: stats,
      divisions: uniqueDivisions,
      sortedColleges: sortedCollegeEntries,
      finalFilteredData: finalFilteredData // <-- Add this
    };

  }, [allData, viewMode, selectedDivision, user.name]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium text-lg">Loading your dashboard...</p>
          <p className="text-slate-400 text-sm mt-2">Fetching registration data</p>
        </div>
      </div>
    );
  }

  // Add this function inside the DistrictDashboard component
  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `ProfSummit_Registrations_${user.name}_${date}`;
    // We pass the final filtered data to the export function
    exportToExcel(finalFilteredData, fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24 lg:pb-0">

      {/* ▼ WRAP the existing header to ONLY show on desktop screens ('lg' and up) ▼ */}
      <div className="hidden lg:block bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-600 bg-clip-text text-transparent">
                Registration Dashboard
              </h1>
              <p className="text-slate-500 mt-1 text-sm lg:text-base">
                Managing registrations for <span className="font-semibold text-indigo-600">{user.name} District</span>
              </p>
            </div>
            <HeaderActions onExport={handleExport} onLogout={onLogout} />
          </div>
        </div>
      </div>

      {/* ▼ ADD a simplified header for mobile screens (hidden on 'lg' and up) ▼ */}
      <MobileHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <SummaryCard
            title="Total Registrations"
            value={summaryStats.total}
            icon={Users}
            gradient="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600"
          />
          <SummaryCard
            title="New Registrants"
            value={summaryStats.new}
            icon={UserPlus}
            gradient="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600"
          />
          <SummaryCard
            title="Returning Members"
            value={summaryStats.returning}
            icon={Award}
            gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600"
          />
          <SummaryCard
            title="Today's Registrations"
            value={summaryStats.today}
            icon={Calendar}
            gradient="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600"
          />
        </div>

        <div className="my-8">
          <RegistrationTrend data={finalFilteredData} />
        </div>

        {/* Enhanced Filter Section */}
        <FilterSection
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          divisions={divisions}
        />

        {/* Results Section */}
        {Object.keys(sortedColleges).length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-100">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No Data Found</h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              No registration data matches your current filters. Try adjusting your search criteria or check back later for new registrations.
            </p>
          </div>
        ) : (
          <div>
            {/* Enhanced Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Colleges Ranked by Registrations
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Showing <span className="font-semibold text-indigo-600">{sortedColleges.length}</span> colleges with{' '}
                  <span className="font-semibold text-indigo-600">{summaryStats.total}</span> total registrations
                </p>
              </div>
            </div>

            {/* Enhanced College Cards */}
            <div className="space-y-4 lg:space-y-6">
              {sortedColleges.map(([collegeName, students], index) => (
                <CollegeAccordionCard
                  key={collegeName}
                  collegeName={collegeName}
                  students={students}
                  viewMode={viewMode}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <MobileNavBar onExport={handleExport} onLogout={onLogout} />
    </div>
  );
};

export default DistrictDashboard;



