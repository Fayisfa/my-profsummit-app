import React, { useState, useEffect, useMemo } from 'react';
import { getCampuses, getSubmissions } from '../api';
import { EVENTS } from '../data/database';
import type { Campus, Submission } from '../utils/types';
import { ChevronDown } from 'lucide-react';
import SubmissionMatrix from '../components/SubmissionMatrix';

// Define the structure for our aggregated stats
interface DistrictStats {
    totalSubmissions: number;
    totalCampuses: number;
    participatingCampuses: number;
    eventCounts: Record<number, number>; // Storing counts by event_id
}

// A reusable card for each district
const DistrictAccordionCard: React.FC<{ districtName: string; stats: DistrictStats }> = ({ districtName, stats }) => {
    const [isOpen, setIsOpen] = useState(false);
    const participationRate =
        stats.totalCampuses > 0
            ? (stats.participatingCampuses / stats.totalCampuses) * 100
            : 0;

    return (
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div
                className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-800 truncate">
                        {districtName}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {stats.totalSubmissions} total submissions from{' '}
                        {stats.participatingCampuses} of {stats.totalCampuses} campuses.
                    </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                        <p className="font-bold text-indigo-600">
                            {participationRate.toFixed(0)}%
                        </p>
                        <p className="text-xs text-slate-500">Participation</p>
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-slate-100 p-4 lg:p-6 bg-slate-50/50">
                    <h4 className="font-semibold mb-3 text-slate-700">
                        Event Breakdown for {districtName}
                    </h4>
                    <ul className="space-y-2">
                        {Object.entries(stats.eventCounts)
                            .sort(([, a], [, b]) => b - a)
                            .map(([eventId, count]) => {
                                const event = EVENTS.find((e) => e.id === Number(eventId));
                                return (
                                    <li
                                        key={eventId}
                                        className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100"
                                    >
                                        <span className="text-slate-600">
                                            {event ? event.title : `Event ID: ${eventId}`}
                                        </span>
                                        <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                                            {count}
                                        </span>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Main component for the overview page
const SubmissionOverview: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Add state for the view toggle
    const [viewMode, setViewMode] = useState<'summary' | 'matrix'>('matrix');

    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            const [campusData, submissionData] = await Promise.all([
                getCampuses(),
                getSubmissions(),
            ]);
            setCampuses(campusData);
            setSubmissions(submissionData);
            setIsLoading(false);
        };
        loadAllData();
    }, []);

    // 3. Update the useMemo hook
    const { districtStats, sortedDistricts, matrixData, allDistricts } =
        useMemo(() => {
            if (campuses.length === 0 || submissions.length === 0) {
                return { districtStats: {}, sortedDistricts: [], matrixData: {}, allDistricts: [] };
            }

            const campusIdToDistrictMap = new Map<string, string>();
            campuses.forEach((campus) => {
                campusIdToDistrictMap.set(String(campus.id), campus.district);
            });

            // --- Existing logic for districtStats ---
            const stats = submissions.reduce((acc, submission) => {
                const district = campusIdToDistrictMap.get(String(submission.campus_id));
                if (!district) return acc;

                if (!acc[district]) {
                    acc[district] = {
                        totalSubmissions: 0,
                        totalCampuses: 0,
                        participatingCampuses: 0,
                        eventCounts: {},
                        _participatingCampusSet: new Set(),
                    };
                }

                acc[district].totalSubmissions++;
                acc[district]._participatingCampusSet.add(submission.campus_id);
                acc[district].eventCounts[submission.event_id] =
                    (acc[district].eventCounts[submission.event_id] || 0) + 1;

                return acc;
            }, {} as Record<string, any>);

            const campusCountsByDistrict = campuses.reduce((acc, campus) => {
                acc[campus.district] = (acc[campus.district] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            Object.keys(stats).forEach((district) => {
                stats[district].totalCampuses = campusCountsByDistrict[district] || 0;
                stats[district].participatingCampuses =
                    stats[district]._participatingCampusSet.size;
                delete stats[district]._participatingCampusSet;
            });

            // --- NEW: Matrix data ---
            const matrix = submissions.reduce((acc, submission) => {
                const district = campusIdToDistrictMap.get(String(submission.campus_id));
                if (!district) return acc;

                if (!acc[district]) {
                    acc[district] = {};
                }
                acc[district][submission.event_id] =
                    (acc[district][submission.event_id] || 0) + 1;

                return acc;
            }, {} as Record<string, Record<number, number>>);

            const allDistrictNames = [...new Set(campuses.map((c) => c.district))].sort();

            return {
                districtStats: stats,
                sortedDistricts: Object.entries(stats).sort(
                    ([, a], [, b]) => b.totalSubmissions - a.totalSubmissions
                ),
                matrixData: matrix,
                allDistricts: allDistrictNames,
            };
        }, [campuses, submissions]);

    if (isLoading) {
        return <div className="text-center p-10">Loading Overview...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">

                {/* <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Submission Overview
                        </h1>
                        <p className="text-slate-500">
                            A high-level summary of submissions across all districts.
                        </p>
                    </div>

                    <div className="flex bg-slate-200 p-1 rounded-xl max-w-sm w-full sm:w-auto">
                        <button
                            onClick={() => setViewMode('summary')}
                            className={`w-1/2 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${viewMode === 'summary'
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-slate-500'
                                }`}
                        >
                            Summary View
                        </button>
                        <button
                            onClick={() => setViewMode('matrix')}
                            className={`w-1/2 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${viewMode === 'matrix'
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-slate-500'
                                }`}
                        >
                            Matrix View
                        </button>
                    </div>
                </div> */}

                {/* 5. Conditionally render the correct view */}
                {viewMode === 'summary' ? (
                    <div className="space-y-4">
                        {sortedDistricts.map(([districtName, stats]) => (
                            <DistrictAccordionCard
                                key={districtName}
                                districtName={districtName}
                                stats={stats}
                            />
                        ))}
                    </div>
                ) : (
                    <SubmissionMatrix matrixData={matrixData} districts={allDistricts} />
                )}
            </div>
        </div>
    );
};

export default SubmissionOverview;
