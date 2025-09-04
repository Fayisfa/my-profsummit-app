import React, { useState, useEffect } from 'react';
import type { User, Campus, Event, Submission, View, SubmissionStatus } from './utils/types';
import { EVENTS } from './data/database'; // We only need static events now
import { getCampuses, getSubmissions, createOrUpdateSubmission, uploadFile, evaluateSubmission } from './api'; // Import our API functions
import { ArrowRightIcon, CalendarIcon, ChevronRightIcon, HomeIcon, InboxIcon, MenuIcon, TrophyIcon, UserGroupIcon } from './utils/Icons';
import Sidebar from './components/Sidebar';
import ModalWrapper from './modals/ModalWrapper';
import NewSubmissionModal from './modals/NewSubmissionModal';
import NotificationModal from './modals/NotificationModal';
import EventCard from './components/EventCard';
import StateDashboard from './pages/StateDashboard';
import { data } from 'react-router-dom';
import SubmissionOverview from './pages/SubmissionOverview';



// --- NEW ProgressCard COMPONENT ---
const ProgressCard: React.FC<{ submissions: Submission[]; totalEvents: number }> = ({ submissions, totalEvents }) => {
  const completedCount = submissions.length;
  const progressPercentage = totalEvents > 0 ? (completedCount / totalEvents) * 100 : 0;

  const getMotivationalMessage = () => {
    if (progressPercentage < 25) return "Let's get started! Every submission counts.";
    if (progressPercentage < 50) return "Great progress! Keep up the momentum.";
    if (progressPercentage < 75) return "You're doing amazing! Almost there.";
    if (progressPercentage < 100) return "Just a few more to go! Incredible effort.";
    return "Congratulations! All events completed!";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Your Progress</h2>
      <p className="text-sm text-slate-500 mb-4">{getMotivationalMessage()}</p>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-indigo-700">Events Completed</span>
        <span className="text-sm font-bold">{completedCount} / {totalEvents}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const DocumentViewer: React.FC = () => {
  // Replace this with the actual URL to your hosted PDF file
  const pdfUrl = "/assets/letter.pdf";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[80vh] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-slate-800">Document Viewer</h2>
      </div>
      <div className="flex-1 p-2">
        <iframe
          src={pdfUrl}
          title="Document Viewer"
          className="w-full h-full border-0 rounded-b-xl"
        />
      </div>
    </div>
  );
};

const Header: React.FC<{ activeView: View; onMenuClick: () => void; }> = ({ activeView, onMenuClick }) => (
  <header className="flex items-center justify-between h-16">
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600">
        <MenuIcon className="w-6 h-6" />
      </button>
      <span>Pages</span>
      <ChevronRightIcon className="w-4 h-4 text-slate-400" />
      <span className="font-semibold text-slate-700">{activeView}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <span>Operational</span>
      </div>
    </div>
  </header>
);

const OverviewCard: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="p-8 rounded-xl bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white shadow-lg">
    <p className="text-sm font-medium opacity-80 mb-1">CURRENT ROLE</p>
    <h2 className="text-4xl font-bold mb-6">{user?.role}</h2>
    <div className="bg-white/20 h-px mb-4"></div>
    <div className="flex justify-between items-center">
      <p className="font-medium">{user?.name}</p>
      {/* <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
        Manage Profile
      </button> */}
    </div>
  </div>
);

const Leaderboard: React.FC<{ campuses: Campus[] }> = ({ campuses }) => {
  const sortedCampuses = [...campuses].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Leaderboard</h2>
        <TrophyIcon className="w-6 h-6 text-amber-500" />
      </div>
      <div className="space-y-3">
        {sortedCampuses.map((campus, index) => (
          <div key={campus.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-800' :
                index === 1 ? 'bg-slate-200 text-slate-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                }`}>
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-slate-700">{campus.name}</p>
                <p className="text-xs text-slate-500">{campus.district} District</p>
              </div>
            </div>
            <span className="font-bold text-indigo-600">{campus.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};



const SubmissionModal: React.FC<{
  visible: boolean; onHide: () => void; submission: Submission | null; event: Event | null; campus: Campus | null;
  onEvaluate?: (submissionId: number, status: 'approved' | 'rejected', points: number, feedback: string) => void;
  mode: 'evaluate' | 'view';
}> = ({ visible, onHide, submission, event, campus, onEvaluate, mode }) => {
  const [points, setPoints] = React.useState<number>(0);
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    if (submission) {
      setPoints(submission.marks ?? 0);
      setFeedback(submission.feedback ?? '');
    }
  }, [submission]);

  if (!submission || !event || !campus) return null;

  const handleEvaluation = (status: 'approved' | 'rejected') => {
    if (!onEvaluate) return;
    let awardedPoints = 0;
    if (status === 'approved') {
      switch (event.gradingType) {
        case 'Fixed': awardedPoints = event.maxPoints; break;
        default: awardedPoints = Math.min(points, event.maxPoints); break;
      }
    }
    onEvaluate(submission.id, status, awardedPoints, feedback);
    onHide();
  };

  const getStatusColor = (status: SubmissionStatus) => ({
    'approved': 'bg-emerald-100 text-emerald-800',
    'rejected': 'bg-rose-100 text-rose-800',
    'pending': 'bg-amber-100 text-amber-800'
  }[status] || 'bg-slate-100 text-slate-800');

  return (
    <ModalWrapper visible={visible} onHide={onHide}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Submission {mode === 'evaluate' ? 'Review' : 'Details'}</h2>
          <button onClick={onHide} className="text-slate-400 hover:text-slate-600 text-2xl p-1" aria-label="Close modal"> × </button>
        </div>
        <p className="text-slate-500 mt-1">For event: <span className="font-semibold text-indigo-600">{event.title}</span></p>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Submission Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Campus</p>
              <p className="font-semibold text-slate-700">{campus.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Submitted By</p>
              <p className="font-semibold text-slate-700">{submission.submitted_by}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Status</p>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(submission.status)} font-medium`}>
                {submission.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Submitted On</p>
              <p className="font-semibold text-slate-700">{submission.created_at}</p>
            </div>
          </div>
        </div>

        {/* Submission Data */}
        <div>
          <h4 className="font-bold mb-3 text-slate-800 border-b pb-2">Submission Content</h4>
          <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-lg">
            {submission.data.link && <p><strong>Link:</strong> <a href={submission.data.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{submission.data.link}</a></p>}
            {submission.data.text && <p><strong>Report:</strong> <span className="text-slate-700 whitespace-pre-wrap">{submission.data.text}</span></p>}
            {submission.data.quantity && <p><strong>Quantity:</strong> <span className="font-semibold text-slate-800">{submission.data.quantity}</span></p>}
            {/* If there is an image URL, display it using an <img> tag */}
            {/* If there are image submissions */}
            {submission.data.images && submission.data.images.length > 0 && (
              <div>
                <p><strong>Image Submissions:</strong></p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {submission.data.images.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`User submission ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* If there are video submissions */}
            {submission.data.videos && submission.data.videos.length > 0 && (
              <div>
                <p><strong>Video Submissions:</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {submission.data.videos.map((url: string, index: number) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Video {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {submission.data && Object.keys(submission.data).length === 0 && <p className="text-slate-500">This was a simple participation event.</p>}
          </div>
        </div>

        {mode === 'evaluate' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-3 text-slate-800 border-b pb-2">Evaluation</h4>
              {event.gradingType === 'Fixed' || event.gradingType === 'Variable' ? (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800">Points are calculated automatically.</p>
                  <p className="text-sm text-blue-700">
                    {event.gradingType === 'Fixed'
                      ? `Approving will award a fixed ${event.maxPoints} points.`
                      : `Approving will award points based on quantity (e.g., ${submission.data.quantity} units).`
                    }
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-slate-700 mb-2">Award Points (Max: {event.maxPoints})</label>
                  <input
                    id="points"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Math.max(0, Math.min(event.maxPoints, Number(e.target.value))))}
                    max={event.maxPoints}
                    min="0"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    aria-describedby="points-helper"
                  />
                  <p id="points-helper" className="text-xs text-slate-500 mt-1">For {event.gradingType} grading, you set the points manually.</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-2"> Comments/Reason <span className="text-slate-500">(Required for Rejection)</span></label>
              <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>
        )}
      </div>
      {mode === 'evaluate' && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={() => handleEvaluation('rejected')} disabled={!feedback} className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 disabled:cursor-not-allowed"> Reject Submission </button>
          <button onClick={() => handleEvaluation('approved')} className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700"> Approve Submission </button>
        </div>
      )}
    </ModalWrapper>
  );
};


const EventSubmissionsModal: React.FC<{
  visible: boolean; onHide: () => void; event: Event | null; submissions: Submission[]; campuses: Campus[];
  onSelectSubmission: (submission: Submission, mode: 'evaluate' | 'view') => void;
}> = ({ visible, onHide, event, submissions, campuses, onSelectSubmission }) => {
  if (!visible || !event) return null;

  const eventSubmissions = submissions.filter(s => s.event_id === event.id).sort((a, b) => b.id - a.id);
  const getStatusColor = (status: SubmissionStatus) => ({
    'approved': 'bg-emerald-100 text-emerald-800', 'rejected': 'bg-rose-100 text-rose-800',
    'pending': 'bg-amber-100 text-amber-800'
  }[status] || 'bg-slate-100 text-slate-800');

  return (
    <ModalWrapper visible={visible} onHide={onHide} size="3xl">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-1">Submissions for: {event.title}</h2>
        <p className="text-slate-500">{eventSubmissions.length} total submissions found.</p>
      </div>
      <div className="p-6 space-y-3 overflow-y-auto">
        {eventSubmissions.length > 0 ? eventSubmissions.map(sub => (
          <div key={sub.id} className="border rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <p className="font-bold">{campuses.find(c => c.id === sub.campus_id)?.name}</p>
              <p className="text-sm text-slate-500">by {sub.submitted_by} on {sub.created_at}</p>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sub.status)}`}>{sub.status}</span>
              <button onClick={() => onSelectSubmission(sub, sub.status === 'pending' ? 'evaluate' : 'view')} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700">View / Edit</button>
            </div>
          </div>
        )) : <p className="text-center text-slate-500 py-8">No submissions have been made for this event yet.</p>}
      </div>
      <div className="p-4 bg-slate-50 border-t flex justify-end">
        <button onClick={onHide} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300">Close</button>
      </div>
    </ModalWrapper>
  );
};


// --- MAIN APP COMPONENT ---
interface AppProps {
  user: User;
  onLogout: () => void;
}
export default function App({ user, onLogout }: AppProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [activeView, setActiveView] = useState<View>('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'evaluate' | 'view'>('evaluate');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] = useState(false);
  const [isNewSubmissionModalVisible, setIsNewSubmissionModalVisible] = useState(false);
  const [isEventSubmissionsModalVisible, setIsEventSubmissionsModalVisible] = useState(false);

  const [notification, setNotification] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
    visible: false,
    type: 'success',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const loadData = async () => {
      const [campusData, submissionData] = await Promise.all([
        getCampuses(),
        getSubmissions()
      ]);
      console.log(submissionData[1].data.image)
      setCampuses(campusData);
      setSubmissions(submissionData);
    };

    loadData();
  }, []);

  // --- Handlers ---
  const handleEvaluation = async (submissionId: number, status: 'approved' | 'rejected', points: number, feedback: string) => {
    setIsLoading(true);

    // 1. Show the global loading overlay to prevent further actions.
    try {
      // 2. Call our new API function with all the necessary data.
      const result = await evaluateSubmission({
        id: submissionId,
        status: status,
        marks: points,
        feedback: feedback,
        evaluated_by: user.name, // Use the logged-in admin's name
      });

      // 3. Check the result from the backend.
      if (result.success) {
        // 4. If successful, refresh ALL data to get the latest submission statuses and campus points.
        const [campusData, submissionData] = await Promise.all([
          getCampuses(),
          getSubmissions()
        ]);
        setCampuses(campusData);
        setSubmissions(submissionData);

        // 5. Show a success message.
        setNotification({ visible: true, type: 'success', message: 'Evaluation saved successfully!' });
      } else {
        // If the API returned an error, show it.
        setNotification({ visible: true, type: 'error', message: `Evaluation failed: ${result.error}` });
      }
    } catch (error) {
      // Handle network or unexpected errors.
      setNotification({ visible: true, type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      // 6. ALWAYS hide the loader and the modal when the process is finished.
      setIsLoading(false);
      setIsSubmissionModalVisible(false);
    }
  };

  /**
   * Handles both creating a new submission and updating an existing one.
   * This function is passed down to the NewSubmissionModal.
   * @param submissionData - The core data for the submission (e.g., text, link, quantity).
   * @param file - An optional file object if the submission involves an upload.
   */
  const handleNewOrUpdateSubmission = async (
    submissionData: Partial<Submission>,
    files: File[] = []

  ) => {
    // Ensure an event is selected and the user is a campus user.
    if (!selectedEvent || !user.campusId) return;

    let finalSubmissionData = { ...submissionData };

    let uploadedKeys: string[] = [];

    // --- Step 1: Handle File Upload ---
    // If a file was provided with the form, upload it first.
    if (files.length > 0) {
      for (const file of files) {
        const uploadResult = await uploadFile(file);
        console.log("Upload result:", uploadResult);

        if (uploadResult.success) {
          uploadedKeys.push(uploadResult.key);
        } else {
          setNotification({
            visible: true,
            type: "error",
            message: `Upload failed: ${uploadResult.error}`,
          });
          return;
        }
      }
      console.log(uploadedKeys)
      if (finalSubmissionData.data) {
        if (selectedEvent.submissionType.includes("Image Upload")) {
          const prev = finalSubmissionData.data.images || [];
          finalSubmissionData.data.images = [...prev, ...uploadedKeys];
        } else if (selectedEvent.submissionType.includes("Video Upload")) {
          const prev = finalSubmissionData.data.videos || [];
          finalSubmissionData.data.videos = [...prev, ...uploadedKeys];
        }
      }

    }
    // --- Step 2: Prepare and Send Submission Data ---
    // Assemble the complete submission object to send to the backend.
    const submissionToUpsert = {
      event_id: selectedEvent.id,
      campus_id: user.campusId,
      submitted_by: user.name,
      items: finalSubmissionData.data, // The backend expects 'items' for the JSON data
      data: finalSubmissionData.data,
    };

    // Call the API to either create or update the submission record.
    const result = await createOrUpdateSubmission(submissionToUpsert);

    // --- Step 3: Update UI ---
    // If the submission was saved successfully...
    if (result.success) {
      // ...fetch the latest list of all submissions to ensure the UI is up-to-date.
      const newSubmissions = await getSubmissions();
      setSubmissions(newSubmissions);
      setNotification({ visible: true, type: 'success', message: result.message });
    } else {
      // If there was an error, show it to the user.
      setNotification({ visible: true, type: 'error', message: `Submission failed: ${result.error}` });

    }
  };

  const openSubmissionDetailModal = (submission: Submission, mode: 'evaluate' | 'view') => {
    setSelectedSubmission(submission);
    setModalMode(mode);
    setIsEventSubmissionsModalVisible(false);
    setIsSubmissionModalVisible(true);
  };


  /**
   * This function is triggered when a user clicks the action button on an EventCard.
   * It determines what should happen next based on the user's role.
   * @param event - The event object associated with the clicked card.
   */
  const handleEventAction = (event: Event) => {
    // Store the selected event in the state for other components to use.
    setSelectedEvent(event);

    if (user.role === 'State Admin') {
      // Admins should see a list of all submissions for that event.
      setIsEventSubmissionsModalVisible(true);
    } else if (user.role === 'Campus Unit User') {
      // For campus users, we first check if they have already submitted for this event.
      const existing = submissions.find(s => s.event_id === event.id && s.campus_id === String(user.campusId));

      // We store the found submission (or null if none exists) in the state.
      // This will be passed to the NewSubmissionModal to pre-fill the form for an update.
      setSelectedSubmission(existing || null);

      // Open the modal for creating or updating a submission.
      setIsNewSubmissionModalVisible(true);
    }
  };

  // --- Filtered Data ---
  const filteredSubmissions = React.useMemo(() => {
    if (user.role === 'State Admin') return submissions.filter(s => s.status === 'pending');
    return [];
  }, [user, submissions]);

  const campusSubmissions = React.useMemo(() => {
    if (user.role === 'Campus Unit User') {
      return submissions.filter(s => s.campus_id === String(user.campusId)).sort((a, b) => b.id - a.id);
    }
    return [];
  }, [user, submissions]);


  // --- DASHBOARDS & VIEWS ---
  const AdminDashboard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Pending Submissions</h2>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">{filteredSubmissions.length} pending</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 font-semibold text-slate-600">Event</th>
              <th className="text-left p-3 font-semibold text-slate-600">Campus</th>
              <th className="text-left p-3 font-semibold text-slate-600">Date</th>
              <th className="text-right p-3 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(sub => (
              <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-700">{EVENTS.find(e => e.id === sub.event_id)?.title}</td>
                <td className="p-3 text-slate-600">{campuses.find(c => c.id === sub.campus_id)?.name}</td>
                <td className="p-3 text-slate-500">{sub.created_at}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openSubmissionDetailModal(sub, 'evaluate')} className="bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-semibold rounded-md hover:bg-indigo-200">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CampusDashboard = () => (
    <div className="space-y-8">
      <ProgressCard submissions={campusSubmissions} totalEvents={EVENTS.length} />
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">My Submissions</h2>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">{campusSubmissions.length} total</span>
        </div>
        <div className="space-y-4">
          {campusSubmissions.map((submission) => (
            <div key={submission.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openSubmissionDetailModal(submission, 'view')}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{EVENTS.find(e => e.id === submission.event_id)?.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${{
                  'approved': 'bg-emerald-100 text-emerald-800',
                  'rejected': 'bg-rose-100 text-rose-800',
                  'pending': 'bg-amber-100 text-amber-800'
                }[submission.status] || 'bg-slate-100 text-slate-800'
                  }`}>{submission.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-slate-500">Submitted</p><p>{submission.created_at}</p></div>
                <div><p className="text-xs text-slate-500">Points</p><p className={`font-bold ${submission.marks ? 'text-indigo-600' : 'text-slate-500'}`}>{submission.marks ?? '–'}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'Events':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Available Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {EVENTS.map(event => <EventCard key={event.id} event={event} user={user} onAction={handleEventAction} submissions={submissions} />)}
            </div>
          </div>
        );
      case 'Submissions':
        return user.role === 'State Admin' ? <AdminDashboard /> : <CampusDashboard />;
      case 'Leaderboard':
        return <Leaderboard campuses={campuses} />;
      case 'Document':
        return <DocumentViewer />;
      case 'Submission Overview':
        return user.role === 'State Admin' ? <SubmissionOverview /> : null;
      case 'Registration Overview':
        // Only render this if the user is a State Admin
        return user.role === 'State Admin' ? <StateDashboard user={user} onLogout={function (): void {
          throw new Error('Function not implemented.');
        }} /> : null;
      case 'Overview':
      default:
        return (
          <>
            <OverviewCard user={user} />
            {user.role === 'State Admin' ? <AdminDashboard /> : <CampusDashboard />}
          </>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex relative">
      <Sidebar
        user={user}
        onLogout={onLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />


      <main className="flex-1 p-4 sm:p-8 overflow-y-auto lg:ml-64">
        <Header activeView={activeView} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="mt-6">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:flex-1 flex flex-col gap-8">
              {renderActiveView()}
            </div>
            {activeView === 'Overview' && (
              <div className="w-full xl:w-96 flex-col gap-8 hidden xl:flex">
                <Leaderboard campuses={campuses} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <SubmissionModal
        visible={isSubmissionModalVisible}
        onHide={() => setIsSubmissionModalVisible(false)}
        submission={selectedSubmission}
        event={selectedSubmission ? EVENTS.find(e => e.id === selectedSubmission.event_id) ?? null : null}
        campus={selectedSubmission ? campuses.find(c => c.id === selectedSubmission.campus_id) ?? null : null}
        onEvaluate={handleEvaluation}
        mode={modalMode}
      />
      <NewSubmissionModal
        visible={isNewSubmissionModalVisible}
        onHide={() => setIsNewSubmissionModalVisible(false)}
        event={selectedEvent}
        user={user}
        existingSubmission={selectedSubmission}
        onSubmit={handleNewOrUpdateSubmission}
      />
      <EventSubmissionsModal
        visible={isEventSubmissionsModalVisible}
        onHide={() => setIsEventSubmissionsModalVisible(false)}
        event={selectedEvent}
        submissions={submissions}
        campuses={campuses}
        onSelectSubmission={openSubmissionDetailModal}
      />
      <NotificationModal
        visible={notification.visible}
        onHide={() => setNotification({ ...notification, visible: false })}
        type={notification.type}
        message={notification.message}
      />
    </div>
  );
}
