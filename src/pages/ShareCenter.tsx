'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { shareToWhatsApp } from '../utils/whatsapp';
import { getAllRegisteredData } from '../api';
import { Building, Home, Map, ChevronDown, Copy, Share2, TrendingUp, Filter, Eye, Calendar } from 'lucide-react';

const ShareCenter: React.FC<{ user: User }> = ({ user }) => {
  // --- State for data and loading ---
  const [allData, setAllData] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State for all filters ---
  const [reportType, setReportType] = useState<'college' | 'division'>('college');
  const [topN, setTopN] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'college' | 'native'>('college');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [dateRange, setDateRange] = useState<'all' | 'today'>('all');
  const [copySuccess, setCopySuccess] = useState('');

  const isStateAdmin = user.role === 'State Admin';

  // --- Data Fetching ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getAllRegisteredData();
      if (Array.isArray(data)) {
        setAllData(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // --- Data Processing ---
  const { reportText, districtsForFilter } = useMemo(() => {
    let dataToProcess = allData;

    // 1. Apply date range filter
    if (dateRange === 'today') {
      const todayString = new Date().toISOString().split('T')[0];
      dataToProcess = dataToProcess.filter(student => student.updated_at.startsWith(todayString));
    }
    
    // 2. Apply role-based and district filters
    const districtKey = viewMode === 'college' ? 'college_district' : 'native_district';
    if (isStateAdmin) {
      if (selectedDistrict !== 'all') {
        dataToProcess = dataToProcess.filter(student => student[districtKey] === selectedDistrict);
      }
    } else {
      dataToProcess = dataToProcess.filter(student => student[districtKey] === user.name);
    }

    // 3. Group the data by the selected report type
    const groupKey = reportType === 'college' ? 'college' : (viewMode === 'college' ? 'college_division' : 'native_division');
    const groupedData = dataToProcess
  .filter(student => student[groupKey]) // 1. Filter out entries with no division/college name
  .reduce((acc, student) => {
    const key = student[groupKey]; // 2. No fallback is needed now
    if (!acc[key]) acc[key] = 0;
    acc[key]++;
    return acc;
  }, {} as Record<string, number>);

    // 4. Sort and slice the data based on the Top N filter
    let sorted = Object.entries(groupedData).sort(([, a], [, b]) => b - a);
    if (topN !== 0) {
      sorted = sorted.slice(0, topN);
    }
    
    // 5. Generate the text for WhatsApp
    let title = `🏆 *ProfSummit Registration Summary* 🏆\n`;
    title += `Top ${topN === 0 ? '' : topN} ${reportType === 'college' ? 'Colleges' : 'Divisions'} (${dateRange === 'today' ? 'Today' : 'All Time'})\n`;
    if(isStateAdmin && selectedDistrict !== 'all') {
      title += `_District: ${selectedDistrict}_\n`;
    }
    title += `_View Mode: ${viewMode === 'college' ? 'College' : 'Native'}_\n\n`;

    let body = sorted.map(([name, count], index) => `${index + 1}. ${name} - *${count}*`).join('\n');
    if (sorted.length === 0) {
      body = '_No registrations match the current filters._';
    }
    
    const footer = `\n\nTotal Registrations in View: *${dataToProcess.length}*\n_Generated: ${new Date().toLocaleString()}_`;
    
    const districts = isStateAdmin ? [...new Set(allData.map(row => viewMode === 'college' ? row.college_district : row.native_district).filter(Boolean))].sort() : [];

    return {
      reportText: title + body + footer,
      districtsForFilter: districts,
    };
  }, [allData, reportType, topN, viewMode, selectedDistrict, user, isStateAdmin, dateRange]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-slate-600 font-medium">Loading Report Generator...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6 text-indigo-600" />
          Report Generator
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><TrendingUp className="w-4 h-4 text-slate-400" /> Report Type</h3>
            <div className="relative">
              <select value={reportType} onChange={(e) => setReportType(e.target.value as 'college' | 'division')} className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 bg-white appearance-none">
                <option value="college">College-wise</option>
                <option value="division">Division-wise</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"># Select Count</h3>
            <div className="relative">
              <select value={topN} onChange={(e) => setTopN(Number(e.target.value))} className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 bg-white appearance-none">
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={0}>All</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Calendar className="w-4 h-4 text-slate-400" /> Date Range</h3>
            <div className="relative">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value as 'all' | 'today')} className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 bg-white appearance-none">
                <option value="all">All Time</option>
                <option value="today">Today</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
             <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Eye className="w-4 h-4 text-slate-400" /> View Mode</h3>
            <div className="relative">
              <select value={viewMode} onChange={(e) => setViewMode(e.target.value as 'college' | 'native')} className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 bg-white appearance-none">
                <option value="college">College</option>
                <option value="native">Native</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {isStateAdmin && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Map className="w-4 h-4 text-slate-400" /> District</h3>
              <div className="relative">
                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 bg-white appearance-none">
                  <option value="all">All Districts</option>
                  {districtsForFilter.map((dist) => <option key={dist} value={dist}>{dist}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4">
          <Share2 className="w-6 h-6 text-emerald-600" />
          Shareable Summary
        </h2>
        <pre className="bg-slate-100 p-4 rounded-xl text-sm text-slate-700 whitespace-pre-wrap font-sans overflow-x-auto">
          {reportText}
        </pre>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => shareToWhatsApp(reportText)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg hover:opacity-90"
          >
            <Share2 size={16}/> Share to WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-xl hover:bg-indigo-200"
          >
            <Copy size={16}/> {copySuccess || 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCenter;