import React, { useState, useEffect, useMemo } from "react";
import { getPastYearRegisteredData } from "../api";
import type { RegistrationData } from "../utils/types";
import { Users, MapPin, Download, Hash } from "lucide-react";
import * as XLSX from "xlsx";

// --- Reusable Card Component ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({
  title,
  value,
  icon: Icon,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transition hover:shadow-xl hover:-translate-y-1 duration-300">
    <div className="flex items-center">
      <div className="bg-indigo-100 p-3 rounded-xl mr-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>
    </div>
  </div>
);

const RetentionAnalysis: React.FC = () => {
  const [allMembers, setAllMembers] = useState<RegistrationData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const pastData = await getPastYearRegisteredData();
      setAllMembers(pastData || []);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Extract unique districts
  const districts = useMemo(() => {
    const unique = Array.from(new Set(allMembers.map((m) => m.college_district))).sort();
    return ["All", ...unique];
  }, [allMembers]);

  // Filtered by district
  const filteredMembers = useMemo(() => {
    if (selectedDistrict === "All") return allMembers;
    return allMembers.filter((m) => m.college_district === selectedDistrict);
  }, [allMembers, selectedDistrict]);

  const handleExport = () => {
    const formattedData = filteredMembers.map((row, index) => ({
      "#": index + 1,
      Name: row.name,
      Mobile: row.mobile,
      Email: row.email,
      College: row.college,
      District: row.college_district,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    XLSX.writeFile(
      workbook,
      `Members_${selectedDistrict}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading Member Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Member Directory (Last Year)
          </h1>
          <p className="text-slate-500 mt-1">Filter and explore members district-wise.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredMembers.length === 0}
          className="px-4 py-2 flex items-center gap-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Members Last Year" value={allMembers.length} icon={Users} />
        <StatCard title="Selected District" value={selectedDistrict} icon={MapPin} />
        <StatCard title="Members in Selection" value={filteredMembers.length} icon={Users} />
      </div>

      {/* District Filter */}
      <div className="mb-6">
        <label className="block text-slate-700 font-medium mb-2">Filter by District</label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-4 py-2 w-full sm:w-auto rounded-lg border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Members in {selectedDistrict} ({filteredMembers.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 w-12 text-center">
                  <Hash className="w-4 h-4 text-slate-600 mx-auto" />
                </th>
                <th className="p-3">Name</th>
                <th className="p-3 hidden sm:table-cell">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3 hidden md:table-cell">College</th>
                <th className="p-3">District</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((user, index) => (
                  <tr
                    key={user.id || user.email}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 text-center font-semibold text-slate-600">
                      {index + 1}
                    </td>
                    <td className="p-3 font-medium text-slate-700">{user.name}</td>
                    <td className="p-3 text-slate-600 hidden sm:table-cell">{user.email}</td>
                    <td className="p-3 text-slate-600">{user.mobile}</td>
                    <td className="p-3 text-slate-600 hidden md:table-cell">{user.college}</td>
                    <td className="p-3 text-slate-600">{user.college_district}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No members found in this district.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RetentionAnalysis;
