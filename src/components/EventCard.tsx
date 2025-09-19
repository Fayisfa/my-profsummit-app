// EventCard.tsx
import React from 'react';
import type { Event, Submission, User } from '../utils/types';
import { CalendarIcon, ArrowRightIcon, CheckIcon } from '../utils/Icons';

interface EventCardProps {
    event: Event;
    user: User;
    onAction: (event: Event) => void;
    submissions: Submission[];
}

const EventCard: React.FC<EventCardProps> = ({ event, user, onAction, submissions }) => {
    const existingSubmission = user.campusId ? submissions.find(s => s.event_id === event.id && s.campus_id === String(user.campusId)) : null;

// In EventCard.tsx

const getActionLabel = () => {
    if (user.role === 'Campus Unit User') {
        // [MODIFIED] Prioritize the check for 'Variable' grading type.
        // If it's a variable event, the user can always submit another entry.
if (event.gradingType === 'Manual') {
  return 'Submit New Entry';
}

        // Original logic for all other event types
        if (existingSubmission) {
            if (existingSubmission.status === 'rejected') {
                return 'Edit & Resubmit';
            }
            return existingSubmission.status === 'pending' ? 'Update Entry' : 'View Entry';
        }
        return 'Submit Entry';
    }
    if (user.role.includes('Admin')) return 'View Submissions';
    return 'View Details';
};

    const getSubmissionTypeColor = (type: string) => ({
        'Media Upload': 'bg-purple-100 text-purple-800',
        'Quantitative Input': 'bg-blue-100 text-blue-800',
        'Text Submission': 'bg-green-100 text-green-800',
        'Simple Participation': 'bg-slate-100 text-slate-800',
        'Image Upload': 'bg-pink-100 text-pink-800',
        'Video Upload': 'bg-red-100 text-red-800',
    }[type] || 'bg-slate-100 text-slate-800');

    const getGradingTypeColor = (type: string) => ({
        'Fixed': 'bg-sky-100 text-sky-800',
        'Variable': 'bg-orange-100 text-orange-800',
        'Tiered': 'bg-fuchsia-100 text-fuchsia-800',
        'Discretion': 'bg-rose-100 text-rose-800'
    }[type] || 'bg-slate-100 text-slate-800');

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-slate-200">
            <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs font-bold">
                        {event.maxPoints} pts
                    </span>
                </div>
                <p className="text-slate-600 mb-4 text-sm">{event.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {event.submissionType.map(type => (
                        <span key={type} className={`px-2 py-1 text-xs rounded-full font-medium ${getSubmissionTypeColor(type)}`}>
                            {type}
                        </span>
                    ))}
                    {/* <span className={`px-2 py-1 text-xs rounded-full font-medium ${getGradingTypeColor(event.gradingType)}`}>
                        {event.gradingType}
                    </span> */}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100">
                    {/* <div className="flex items-center text-sm text-slate-500">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        Deadline: {event.deadline}
                    </div> */}
                    {/* {existingSubmission && (
                        <div className="flex items-center text-sm text-emerald-600 font-semibold mt-2 sm:mt-0">
                            <CheckIcon className="w-4 h-4 mr-1.5" />
                            Submitted
                        </div>
                    )} */}
                    <button
                        onClick={() => onAction(event)}
                        // Replace the className attribute with this new dynamic one
                        className={`
                                px-4 py-2 rounded-lg text-sm font-semibold text-white 
                                flex items-center gap-2 shadow-sm hover:shadow-md transition-colors
                                ${existingSubmission
                                ? 'bg-emerald-600 hover:bg-emerald-700' // Green if submitted
                                : 'bg-indigo-600 hover:bg-indigo-700'   // Indigo if not submitted
                            }
                        `}
                        aria-label={`${getActionLabel()} for ${event.title}`}
                    >
                        {getActionLabel()}
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;