import React, { useState, useEffect, useMemo } from 'react';
import type { User, RegistrationData } from '../utils/types';
import { getPastYearRegisteredData } from '../api';
import { Users, Download, Hash } from 'lucide-react';
import HeaderActions from '../components/HeaderActions'; // Reuse the header actions
import * as XLSX from 'xlsx';

// --- MAIN COMPONENT ---
interface PastYearDistrictViewProps {
    user: User;
    onLogout: () => void;
}

const PastYearDistrictView: React.FC<PastYearDistrictViewProps> = ({ user, onLogout }) => {
    const [pastMembers, setPastMembers] = useState<RegistrationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        if (!user?.name) return;
        setIsLoading(true);
        const allPastData = await getPastYearRegisteredData();
        
        if (Array.isArray(allPastData)) {
            // --- NEW LOGIC START ---
            // 1. Determine the base district name for filtering.
            let filterDistrictName = user.name;
            if (user.name === 'Kozhikode South' || user.name === 'Kozhikode North') {
                filterDistrictName = 'Kozhikode';
            }
            // Add other similar mappings here if needed, e.g., for Ernakulam East/West.
            // --- NEW LOGIC END ---

            const districtMembers = allPastData.filter(
                // 2. Use the new variable for filtering instead of user.name directly.
                m => m.college_district === filterDistrictName || m.native_district === filterDistrictName
            );
            setPastMembers(districtMembers);
        }
        setIsLoading(false);
    };
    fetchData();
}, [user]);

    const handleExport = () => {
        const formattedData = pastMembers.map((row, index) => ({
            '#': index + 1,
            'Name': row.name,
            'Mobile': row.mobile,
            'Email': row.email,
            'College': row.college,
            'College District': row.college_district,
            'Native District': row.native_district
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Past Year Members');
        XLSX.writeFile(workbook, `PastMembers_${user.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-600 font-medium text-lg">Loading Past Year Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* --- Header --- */}
            <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0  shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                                Past Year Member Directory
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Viewing historical data for <span className="font-semibold text-indigo-600">{user.name} District</span>
                            </p>
                        </div>
                        <HeaderActions onExport={handleExport} onLogout={onLogout} />
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4">
                        Members from Last Year ({pastMembers.length})
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 w-12 text-center"><Hash className="w-4 h-4 text-slate-600 mx-auto" /></th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Mobile</th>
                                    <th className="p-3 hidden md:table-cell">College</th>
                                    {/* <th className="p-3">District (College/Native)</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {pastMembers.map((member, index) => (
                                    <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-3 text-center text-slate-500">{index + 1}</td>
                                        <td className="p-3 font-medium text-slate-800">{member.name}</td>
                                        <td className="p-3 text-slate-600">{member.mobile}</td>
                                        <td className="p-3 text-slate-600 hidden md:table-cell">{member.college}</td>
                                        {/* <td className="p-3 text-slate-600">
                                            <div>College: {member.college_district}</div>
                                            <div className='text-xs'>Native: {member.native_district}</div>
                                        </td> */}
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

export default PastYearDistrictView;