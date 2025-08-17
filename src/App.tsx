import React from 'react';

// --- MOCK ICONS ---
// In a real app, you'd use an icon library like Lucide or Heroicons.
// For this example, we'll use simple SVG components.
const HomeIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const CalendarIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
  </svg>
);

const TrophyIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 01-9-9.75V5.625a1.5 1.5 0 011.5-1.5h16.5a1.5 1.5 0 011.5 1.5v3.375c0 5.385-4.365 9.75-9.75 9.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75a9.75 9.75 0 00-9-9.75V5.625" />
  </svg>
);

const InboxIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.12-1.588H6.88a2.25 2.25 0 00-2.12 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>
);

const UserGroupIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.51.054 1.022.083 1.531.083m-1.531-.083a9.06 9.06 0 01-3.443-2.12 3 3 0 01-4.11-3.563M18 18.72v-5.25m-12 5.25v-5.25m0 0l-3-1.5m3 1.5l3 1.5m-3-1.5l-3-1.5m3 1.5l3 1.5M9 11.25l3-1.5 3 1.5m-6 0l3-1.5 3 1.5M9 11.25v-5.25m3 5.25v-5.25m3 5.25v-5.25M12 6.75l3-1.5 3 1.5m-6 0l3-1.5 3 1.5" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);


const ChevronRightIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
  </svg>
);

// --- TYPE DEFINITIONS ---
type UserRole = 'State Admin' | 'Campus Unit User';
type View = 'Overview' | 'Events' | 'Submissions' | 'Leaderboard';
type GradingType = 'Fixed' | 'Variable' | 'Tiered' | 'Discretion';
type SubmissionType = 'Media Upload' | 'Quantitative Input' | 'Text Submission' | 'Simple Participation' | 'Image Upload' | 'Video Upload';
type SubmissionStatus = 'Pending Review' | 'Approved' | 'Rejected';

interface User {
  id: number;
  name: string;
  role: UserRole;
  campusId?: number;
  district?: string;
}

interface Campus {
  id: number;
  name: string;
  district: string;
  points: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  submissionType: SubmissionType;
  gradingType: GradingType;
  maxPoints: number;
  deadline: string;
}

interface Submission {
  id: number;
  eventId: number;
  campusId: number;
  submittedBy: string;
  status: SubmissionStatus;
  submittedAt: string;
  data: {
    link?: string;
    file?: string;
    quantity?: number;
    text?: string;
    photoEvidence?: string;
    image?: string;
    video?: string;
  };
  feedback?: string;
  awardedPoints?: number;
}

// --- MOCK DATABASE ---
const USERS: User[] = [
  { id: 1, name: 'Super Admin', role: 'State Admin' },
  { id: 3, name: 'Main Campus Rep', role: 'Campus Unit User', campusId: 1 },
  { id: 4, name: 'South Campus Rep', role: 'Campus Unit User', campusId: 2 },
];

let CAMPUSES: Campus[] = [
  { id: 1, name: 'Central University', district: 'North', points: 15 },
  { id: 2, name: 'Southern State College', district: 'South', points: 5 },
  { id: 3, name: 'Northern Tech Institute', district: 'North', points: 25 },
  { id: 4, name: 'Western Community College', district: 'West', points: 0 },
];

const EVENTS: Event[] = [
  { id: 1, title: 'Frame to Fame', description: 'Submit your best promotional reel on social media.', submissionType: 'Media Upload', gradingType: 'Discretion', maxPoints: 20, deadline: '2025-09-15' },
  { id: 2, title: 'Chumarezhuth', description: 'Paint walls in your community. 5 points per wall.', submissionType: 'Quantitative Input', gradingType: 'Variable', maxPoints: 50, deadline: '2025-09-20' },
  { id: 3, title: 'Community Reach', description: 'Submit a report on your community service activities.', submissionType: 'Text Submission', gradingType: 'Fixed', maxPoints: 10, deadline: '2025-09-10' },
  { id: 4, title: 'Vigilantia-1 Participation', description: 'Confirm participation in the awareness drive.', submissionType: 'Simple Participation', gradingType: 'Fixed', maxPoints: 5, deadline: '2025-09-05' },
  { id: 5, title: 'Campus Photography Contest', description: 'Submit your best campus photo.', submissionType: 'Image Upload', gradingType: 'Discretion', maxPoints: 15, deadline: '2025-10-01' },
];

let SUBMISSIONS: Submission[] = [
  { id: 1, eventId: 1, campusId: 1, submittedBy: 'Main Campus Rep', status: 'Pending Review', submittedAt: '2025-09-01', data: { link: 'https://instagram.com/reel/123' } },
  { id: 2, eventId: 2, campusId: 3, submittedBy: 'Northern Tech Rep', status: 'Pending Review', submittedAt: '2025-09-02', data: { quantity: 5, photoEvidence: 'photo_of_5_walls.jpg' } },
  { id: 3, eventId: 3, campusId: 1, submittedBy: 'Main Campus Rep', status: 'Approved', submittedAt: '2025-08-28', data: { text: 'We conducted a cleanliness drive...' }, awardedPoints: 10, feedback: 'Great work!' },
  { id: 4, eventId: 4, campusId: 2, submittedBy: 'South Campus Rep', status: 'Approved', submittedAt: '2025-09-01', data: {}, awardedPoints: 5, feedback: 'Participation confirmed.' },
  { id: 5, eventId: 1, campusId: 3, submittedBy: 'Northern Tech Rep', status: 'Approved', submittedAt: '2025-09-04', data: { link: 'https://instagram.com/reel/abc' }, awardedPoints: 15, feedback: 'Excellent video quality and engagement.' },
];

// --- HELPER COMPONENTS ---

const Sidebar: React.FC<{ user: User | null; onSwitchUser: (user: User) => void; activeView: View; setActiveView: (view: View) => void; isOpen: boolean; }> = ({ user, onSwitchUser, activeView, setActiveView, isOpen }) => {
  const navItems = [
    { name: 'Overview', icon: HomeIcon },
    { name: 'Events', icon: CalendarIcon },
    { name: 'Submissions', icon: InboxIcon },
    { name: 'Leaderboard', icon: TrophyIcon },
  ];

  return (
    <aside className={`w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} absolute md:relative z-20`}>
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <UserGroupIcon className="w-8 h-8 text-indigo-600" />
        {/* <h1 className="text-xl font-bold text-slate-800 ml-2">ProfSummit</h1> */}
        <img src="/logo_2024.svg" alt="" />
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveView(item.name as View); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeView === item.name ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      {/* <div className="p-4 border-t border-slate-200">
        <p className="text-sm font-semibold text-slate-600 mb-2">Switch View</p>
        <div className="space-y-1">
          {USERS.map(u => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${user?.id === u.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
            >
              {u.name}
              {user?.id === u.id && <span className="w-2 h-2 bg-white rounded-full"></span>}
            </button>
          ))}
        </div>
      </div> */}
    </aside>
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
      <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
        Manage Profile
      </button>
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

const EventCard: React.FC<{ event: Event, user: User, onAction: (event: Event) => void }> = ({ event, user, onAction }) => {
  const getActionLabel = () => {
    if (user.role === 'Campus Unit User') return 'Submit Entry';
    if (user.role.includes('Admin')) return 'View Submissions';
    return 'View Details';
  };

  const getSubmissionTypeColor = (type: SubmissionType) => ({
    'Media Upload': 'bg-purple-100 text-purple-800',
    'Quantitative Input': 'bg-blue-100 text-blue-800',
    'Text Submission': 'bg-green-100 text-green-800',
    'Simple Participation': 'bg-slate-100 text-slate-800',
    'Image Upload': 'bg-pink-100 text-pink-800',
    'Video Upload': 'bg-red-100 text-red-800',
  }[type] || 'bg-slate-100 text-slate-800');

  const getGradingTypeColor = (type: GradingType) => ({
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
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSubmissionTypeColor(event.submissionType)}`}>
            {event.submissionType}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getGradingTypeColor(event.gradingType)}`}>
            {event.gradingType}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center text-sm text-slate-500">
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            Deadline: {event.deadline}
          </div>

          <button
            onClick={() => onAction(event)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
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

// --- MODALS (Restyled) ---

const ModalWrapper: React.FC<{ visible: boolean; onHide: () => void; children: React.ReactNode; size?: 'lg' | 'xl' | '2xl' | '3xl' }> = ({ visible, onHide, children, size = '2xl' }) => {
  if (!visible) return null;
  const sizeClasses = {
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onHide}>
      <div className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const SubmissionModal: React.FC<{
  visible: boolean;
  onHide: () => void;
  submission: Submission | null;
  event: Event | null;
  campus: Campus | null;
  onEvaluate?: (submissionId: number, status: 'Approved' | 'Rejected', points: number, feedback: string) => void;
  mode: 'evaluate' | 'view';
}> = ({ visible, onHide, submission, event, campus, onEvaluate, mode }) => {
  const [points, setPoints] = React.useState<number>(0);
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    if (submission) {
      setPoints(submission.awardedPoints ?? 0);
      setFeedback(submission.feedback ?? '');
    }
  }, [submission]);

  if (!submission || !event || !campus) return null;

  const handleEvaluation = (status: 'Approved' | 'Rejected') => {
    if (!onEvaluate) return;
    let awardedPoints = 0;
    if (status === 'Approved') {
      switch (event.gradingType) {
        case 'Fixed': awardedPoints = event.maxPoints; break;
        default: awardedPoints = Math.min(points, event.maxPoints); break;
      }
    }
    onEvaluate(submission.id, status, awardedPoints, feedback);
    onHide();
  };

  const getStatusColor = (status: SubmissionStatus) => ({
    'Approved': 'bg-emerald-100 text-emerald-800',
    'Rejected': 'bg-rose-100 text-rose-800',
    'Pending Review': 'bg-amber-100 text-amber-800'
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
              <p className="font-semibold text-slate-700">{submission.submittedBy}</p>
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
              <p className="font-semibold text-slate-700">{submission.submittedAt}</p>
            </div>
          </div>
        </div>

        {/* Submission Data */}
        <div>
          <h4 className="font-bold mb-3 text-slate-800 border-b pb-2">Submission Content</h4>
          <div>
            <h4 className="font-bold mb-3 text-slate-800 border-b pb-2">Submission Content</h4>
            <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-lg">
              {submission.data.link && <p><strong>Link:</strong> <a href={submission.data.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{submission.data.link}</a></p>}
              {submission.data.text && <p><strong>Report:</strong> <span className="text-slate-700 whitespace-pre-wrap">{submission.data.text}</span></p>}
              {submission.data.quantity && <p><strong>Quantity:</strong> <span className="font-semibold text-slate-800">{submission.data.quantity}</span></p>}
              {submission.data.image && <p><strong>Image File:</strong> <span className="text-slate-700">{submission.data.image}</span></p>}
              {submission.data.video && <p><strong>Video File:</strong> <span className="text-slate-700">{submission.data.video}</span></p>}
              {Object.keys(submission.data).length === 0 && <p className="text-slate-500">This was a simple participation event.</p>}
            </div>
          </div>
        </div>

        {mode === 'evaluate' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-3 text-slate-800 border-b pb-2">Evaluation</h4>
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
          <button onClick={() => handleEvaluation('Rejected')} disabled={!feedback} className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 disabled:cursor-not-allowed"> Reject Submission </button>
          <button onClick={() => handleEvaluation('Approved')} className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700"> Approve Submission </button>
        </div>
      )}
    </ModalWrapper>
  );
};

const NewSubmissionModal: React.FC<{
  visible: boolean;
  onHide: () => void;
  event: Event | null;
  user: User;
  onSubmit: (submissionData: Submission['data']) => void;
}> = ({ visible, onHide, event, user, onSubmit }) => {
  const [link, setLink] = React.useState('');
  const [text, setText] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [image, setImage] = React.useState('');
  const [video, setVideo] = React.useState('');

  React.useEffect(() => {
    setLink('');
    setText('');
    setQuantity(1);
    setImage('');
    setVideo('');
  }, [visible, event]);

  if (!visible || !event) return null;

  const handleSubmit = () => {
    const data: Submission['data'] = {};
    switch (event.submissionType) {
      case 'Media Upload': data.link = link; break;
      case 'Text Submission': data.text = text; break;
      case 'Quantitative Input': data.quantity = quantity; break;
      case 'Image Upload': data.image = image; break;
      case 'Video Upload': data.video = video; break;
    }
    onSubmit(data);
    onHide();
  }

  const renderFormFields = () => {
    switch (event.submissionType) {
      case 'Media Upload':
        return <div><label className="text-sm font-medium text-slate-700 mb-1 block">Social Media Link</label><input type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" placeholder="https://..." /></div>;
      case 'Text Submission':
        return <div><label className="text-sm font-medium text-slate-700 mb-1 block">Report</label><textarea value={text} onChange={e => setText(e.target.value)} rows={5} className="w-full p-2 border border-slate-300 rounded-lg" /></div>;
      case 'Quantitative Input':
        return <div><label className="text-sm font-medium text-slate-700 mb-1 block">Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" className="w-full p-2 border border-slate-300 rounded-lg" /></div>;
      case 'Image Upload':
        return <div><label className="text-sm font-medium text-slate-700 mb-1 block">Image Upload</label><input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0].name : '')} className="w-full p-2 border border-slate-300 rounded-lg" /></div>;
      case 'Video Upload':
        return <div><label className="text-sm font-medium text-slate-700 mb-1 block">Video Upload</label><input type="file" accept="video/*" onChange={e => setVideo(e.target.files ? e.target.files[0].name : '')} className="w-full p-2 border border-slate-300 rounded-lg" /></div>;
      case 'Simple Participation':
        return <p className="text-center text-slate-600 bg-slate-50 p-4 rounded-lg">Clicking "Submit" will confirm your campus's participation in this event.</p>
      default: return null;
    }
  }

  return (
    <ModalWrapper visible={visible} onHide={onHide} size="lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-slate-600 mb-6">Submit your entry for this event.</p>
        <div className="space-y-4 mb-6">{renderFormFields()}</div>
        <div className="flex justify-end gap-4">
          <button onClick={onHide} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
          <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Submit Entry</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

const EventSubmissionsModal: React.FC<{
  visible: boolean;
  onHide: () => void;
  event: Event | null;
  submissions: Submission[];
  campuses: Campus[];
  onSelectSubmission: (submission: Submission, mode: 'evaluate' | 'view') => void;
}> = ({ visible, onHide, event, submissions, campuses, onSelectSubmission }) => {
  if (!visible || !event) return null;

  const eventSubmissions = submissions.filter(s => s.eventId === event.id).sort((a, b) => b.id - a.id);
  const getStatusColor = (status: SubmissionStatus) => ({
    'Approved': 'bg-emerald-100 text-emerald-800', 'Rejected': 'bg-rose-100 text-rose-800',
    'Pending Review': 'bg-amber-100 text-amber-800'
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
              <p className="font-bold">{campuses.find(c => c.id === sub.campusId)?.name}</p>
              <p className="text-sm text-slate-500">by {sub.submittedBy} on {sub.submittedAt}</p>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sub.status)}`}>{sub.status}</span>
              <button onClick={() => onSelectSubmission(sub, sub.status === 'Pending Review' ? 'evaluate' : 'view')} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700">View / Edit</button>
            </div>
          </div>
        )) : <p className="text-center text-slate-500 py-8">No submissions have been made for this event yet.</p>}
      </div>
      <div className="p-4 bg-slate-50 border-t flex justify-end">
        <button onClick={onHide} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300">Close</button>
      </div>
    </ModalWrapper>
  )
}

// --- MAIN APP COMPONENT ---
export default function App() {
  // const [currentUser, setCurrentUser] = React.useState<User>(USERS[0]);
  const [currentUser, setCurrentUser] = React.useState<User>(USERS[1]);
  const [submissions, setSubmissions] = React.useState<Submission[]>(SUBMISSIONS);
  const [campuses, setCampuses] = React.useState<Campus[]>(CAMPUSES);
  const [activeView, setActiveView] = React.useState<View>('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Modal States
  const [modalMode, setModalMode] = React.useState<'evaluate' | 'view'>('evaluate');
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] = React.useState(false);
  const [isNewSubmissionModalVisible, setIsNewSubmissionModalVisible] = React.useState(false);
  const [isEventSubmissionsModalVisible, setIsEventSubmissionsModalVisible] = React.useState(false);

  // --- Handlers ---
  const handleUserSwitch = (user: User) => {
    setCurrentUser(user);
    setActiveView('Overview'); // Reset view on user switch
  };

  const handleEvaluation = (submissionId: number, status: 'Approved' | 'Rejected', points: number, feedback: string) => {
    const submissionToUpdate = submissions.find(s => s.id === submissionId);
    if (!submissionToUpdate) return;

    const oldPoints = submissionToUpdate.status === 'Approved' ? (submissionToUpdate.awardedPoints ?? 0) : 0;
    const newPoints = status === 'Approved' ? points : 0;
    const pointDifference = newPoints - oldPoints;

    setSubmissions(prev => prev.map(sub =>
      sub.id === submissionId ? { ...sub, status, awardedPoints: newPoints, feedback } : sub
    ));

    if (pointDifference !== 0) {
      setCampuses(prev => prev.map(c =>
        c.id === submissionToUpdate.campusId ? { ...c, points: c.points + pointDifference } : c
      ));
    }
    setIsSubmissionModalVisible(false);
  };

  const handleNewSubmission = (data: Submission['data']) => {
    if (!selectedEvent || !currentUser.campusId) return;
    const newSubmission: Submission = {
      id: Math.max(0, ...submissions.map(s => s.id)) + 1,
      eventId: selectedEvent.id,
      campusId: currentUser.campusId,
      submittedBy: currentUser.name,
      status: 'Pending Review',
      submittedAt: new Date().toISOString().split('T')[0],
      data: data,
    };
    setSubmissions(prev => [...prev, newSubmission]);
    setIsNewSubmissionModalVisible(false);
  };

  const openSubmissionDetailModal = (submission: Submission, mode: 'evaluate' | 'view') => {
    setSelectedSubmission(submission);
    setModalMode(mode);
    setIsEventSubmissionsModalVisible(false);
    setIsSubmissionModalVisible(true);
  };

  const handleEventAction = (event: Event) => {
    setSelectedEvent(event);
    if (currentUser.role === 'State Admin') {
      setIsEventSubmissionsModalVisible(true);
    } else if (currentUser.role === 'Campus Unit User') {
      setIsNewSubmissionModalVisible(true);
    }
  };

  // --- Filtered Data ---
  const filteredSubmissions = React.useMemo(() => {
    if (currentUser.role === 'State Admin') return submissions.filter(s => s.status === 'Pending Review');
    return [];
  }, [currentUser, submissions]);

  const campusSubmissions = React.useMemo(() => {
    if (currentUser.role === 'Campus Unit User') {
      return submissions.filter(s => s.campusId === currentUser.campusId).sort((a, b) => b.id - a.id);
    }
    return [];
  }, [currentUser, submissions]);


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
                <td className="p-3 font-medium text-slate-700">{EVENTS.find(e => e.id === sub.eventId)?.title}</td>
                <td className="p-3 text-slate-600">{campuses.find(c => c.id === sub.campusId)?.name}</td>
                <td className="p-3 text-slate-500">{sub.submittedAt}</td>
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
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">My Submissions</h2>
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">{campusSubmissions.length} total</span>
      </div>
      <div className="space-y-4">
        {campusSubmissions.map((submission) => (
          <div key={submission.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openSubmissionDetailModal(submission, 'view')}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800">{EVENTS.find(e => e.id === submission.eventId)?.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${{
                  'Approved': 'bg-emerald-100 text-emerald-800',
                  'Rejected': 'bg-rose-100 text-rose-800',
                  'Pending Review': 'bg-amber-100 text-amber-800'
                }[submission.status] || 'bg-slate-100 text-slate-800'
                }`}>{submission.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-500">Submitted</p><p>{submission.submittedAt}</p></div>
              <div><p className="text-xs text-slate-500">Points</p><p className={`font-bold ${submission.awardedPoints ? 'text-indigo-600' : 'text-slate-500'}`}>{submission.awardedPoints ?? '–'}</p></div>
            </div>
          </div>
        ))}
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
              {EVENTS.map(event => <EventCard key={event.id} event={event} user={currentUser} onAction={handleEventAction} />)}
            </div>
          </div>
        );
      case 'Submissions':
        return currentUser.role === 'State Admin' ? <AdminDashboard /> : <CampusDashboard />;
      case 'Leaderboard':
        return <Leaderboard campuses={campuses} />;
      case 'Overview':
      default:
        return (
          <>
            <OverviewCard user={currentUser} />
            {currentUser.role === 'State Admin' ? <AdminDashboard /> : <CampusDashboard />}
          </>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex relative">
      <Sidebar user={currentUser} onSwitchUser={handleUserSwitch} activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} />

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
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
        event={selectedSubmission ? EVENTS.find(e => e.id === selectedSubmission.eventId) ?? null : null}
        campus={selectedSubmission ? campuses.find(c => c.id === selectedSubmission.campusId) ?? null : null}
        onEvaluate={handleEvaluation}
        mode={modalMode}
      />
      <NewSubmissionModal
        visible={isNewSubmissionModalVisible}
        onHide={() => setIsNewSubmissionModalVisible(false)}
        event={selectedEvent}
        user={currentUser}
        onSubmit={handleNewSubmission}
      />
      <EventSubmissionsModal
        visible={isEventSubmissionsModalVisible}
        onHide={() => setIsEventSubmissionsModalVisible(false)}
        event={selectedEvent}
        submissions={submissions}
        campuses={campuses}
        onSelectSubmission={openSubmissionDetailModal}
      />
    </div>
  );
}
