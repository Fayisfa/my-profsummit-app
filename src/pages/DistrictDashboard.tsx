import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../utils/types';
import { getRegisteredData } from '../api';

interface DistrictDashboardProps {
  user: User;
  onLogout: () => void;
}

const DistrictDashboard: React.FC<DistrictDashboardProps> = ({ user, onLogout }) => {
  const [allRegisteredData, setAllRegisteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getRegisteredData();
        console.log("API response:", data);

        // The API now returns a clean array, so we can set it directly.
        if (Array.isArray(data)) {
          setAllRegisteredData(data);
        } else {
          setAllRegisteredData([]);
        }
      } catch (error) {
        console.error("Error loading registered data:", error);
        setAllRegisteredData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter the data to show only records matching the logged-in district user's name.
  // This uses useMemo for efficiency, so the filter only re-runs when the data changes.
  const filteredData = useMemo(() => {
    if (!user || !user.name) return [];
    // Assuming the API provides a 'college_district' field for each student record.
    return allRegisteredData.filter(row => row.college_district === user.name);
  }, [allRegisteredData, user.name]);


  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 bg-white rounded-2xl shadow-xl text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-slate-500">
            Registered Student Data
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {isLoading ? (
            <p className="text-center text-slate-500">Loading data...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-slate-500">No data found for your district.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {/* Use the new, simple property names for the headers */}
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Campus</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="border-b">
                      {/* --- THIS IS THE FIX --- */}
                      {/* Access the data using the new, clean property names */}
                      <td className="p-3">{row.name}</td>
                      <td className="p-3">{row.email}</td>
                      <td className="p-3">{row.college}</td>
                      <td className="p-3">{row.mobile}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-8 px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DistrictDashboard;

