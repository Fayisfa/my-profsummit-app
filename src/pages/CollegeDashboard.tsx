'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { getRegisteredData, getAllRegisteredData } from '../api';
import { Users, Building, ChevronDown, TrendingUp, Home, Map } from 'lucide-react';
import { exportToExcel } from '../utils/export';
import HeaderActions from '../components/HeaderActions';
import FilterControls from '../components/FilterControls';

//=================================================================
//  REUSABLE SUB-COMPONENTS
//=================================================================

const SummaryCard: React.FC<{ title: string; value: number | string; icon: React.ElementType; gradient: string; }> = ({ title, value, icon: Icon, gradient }) => (
  <div className={`${gradient} p-6 rounded-3xl shadow-xl`}>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-white/90">{title}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-2xl">
        <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
      </div>
    </div>
  </div>
);

const CollegeAccordionCard: React.FC<{ collegeName: string; students: RegistrationData[]; rank: number; }> = ({ collegeName, students, rank }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      <div className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">#{rank}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 text-lg truncate">{collegeName}</h3>
            <p className="text-sm text-slate-500 mt-1">{students.length} Total Registrations</p>
          </div>
        </div>
        <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
        <div className="border-t p-4 lg:p-6 bg-slate-50/50">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-600 border-b">
              <tr>
                <th className="p-2 font-semibold">#</th>
                <th className="p-2 font-semibold">Name</th>
                <th className="p-2 font-semibold hidden lg:table-cell">Phone</th>
                <th className="p-2 font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b border-slate-100">
                  <td className="p-2 text-slate-500">{index + 1}</td>
                  <td className="p-2 font-medium">
                    <div>{student.name}</div>
                    <div className="lg:hidden text-xs text-slate-500">{student.mobile}</div>
                  </td>
                  <td className="p-2 text-slate-600 hidden lg:table-cell">{student.mobile}</td>
                  <td className="p-2 text-slate-600">{new Date(student.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

//=================================================================
//  MAIN COLLEGE DASHBOARD COMPONENT
//=================================================================

interface CollegeDashboardProps {
  user: User;
  onLogout: () => void;
}

const CollegeDashboard: React.FC<CollegeDashboardProps> = ({ user, onLogout }) => {
  const [allData, setAllData] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'college' | 'native'>('college');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const isStateAdmin = user.role === 'State Admin';
  const [dateRange, setDateRange] = useState<'all' | 'today'>('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = isStateAdmin ? await getAllRegisteredData() : await getRegisteredData(user.name);
      if (Array.isArray(data)) setAllData(data);
      setIsLoading(false);
    };
    loadData();
  }, [user, isStateAdmin]);

  const { summaryStats, sortedColleges, districtsForFilter, finalFilteredData } = useMemo(() => {
    const districtKey = viewMode === 'college' ? 'college_district' : 'native_district';
    let dataToProcess: RegistrationData[] = [];

    if (isStateAdmin) {
      dataToProcess = selectedDistrict === 'all'
        ? allData
        : allData.filter(student => student[districtKey] === selectedDistrict);
    } else {
      dataToProcess = allData.filter(student => student[districtKey] === user.name);
    }

    const groupedByCollege = dataToProcess.reduce((acc, student) => {
      const college = student.college || 'Unknown College';
      if (!acc[college]) acc[college] = [];
      acc[college].push(student);
      return acc;
    }, {} as Record<string, RegistrationData[]>);

    const sortedCollegeEntries = Object.entries(groupedByCollege)
      .sort(([, a], [, b]) => b.length - a.length);

    const allDistricts = isStateAdmin
      ? [...new Set(allData.map(row => row[districtKey]).filter(Boolean))].sort()
      : [];

    const stats = {
      totalRegistrations: dataToProcess.length,
      activeColleges: sortedCollegeEntries.length,
    };

    return {
      summaryStats: stats,
      sortedColleges: sortedCollegeEntries,
      districtsForFilter: allDistricts,
      finalFilteredData: dataToProcess,
    };
  }, [allData, viewMode, isStateAdmin, selectedDistrict, user.name]);

  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0];
    const fileName = `Colleges_${isStateAdmin ? 'State' : user.name}_${viewMode}_${date}`;
    exportToExcel(finalFilteredData, fileName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white/90 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                {isStateAdmin ? 'Statewide College Overview' : 'College Overview'}
              </h1>
              <p className="text-slate-500 mt-1">
                {isStateAdmin ? 'Viewing all registrations' : `For ${user.name} District`}
              </p>
            </div>
            <HeaderActions onExport={handleExport} onLogout={onLogout} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <SummaryCard title="Total Registrations (in view)" value={summaryStats.totalRegistrations} icon={Users} gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
          <SummaryCard title="Active Colleges (in view)" value={summaryStats.activeColleges} icon={Building} gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
        </div>

        <FilterControls
  viewMode={viewMode}
  setViewMode={setViewMode}
  dateRange={dateRange}           // <-- Add this prop
  setDateRange={setDateRange}       // <-- Add this prop
  isStateAdmin={isStateAdmin}
  districts={districtsForFilter}
  selectedDistrict={selectedDistrict}
  setSelectedDistrict={setSelectedDistrict}
/>

        {sortedColleges.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center mt-8">
            <h3 className="text-2xl font-bold text-slate-700">No College Data Found</h3>
             <p className="text-slate-500 mt-2">No registrations with college information were found for your current filters.</p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Colleges Ranked by Registrations
              </h2>
            </div>
            <div className="space-y-4 lg:space-y-6">
              {sortedColleges.map(([collegeName, students], index) => (
                <CollegeAccordionCard key={collegeName} collegeName={collegeName} students={students} rank={index + 1} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CollegeDashboard;