// database.ts
import type { User, Campus, Event, Submission } from '../utils/types';

export const USERS: User[] = [
  { id: 1, name: 'Super Admin', role: 'State Admin' },
  { id: 3, name: 'Main Campus Rep', role: 'Campus Unit User', campusId: "1" },
  { id: 4, name: 'South Campus Rep', role: 'Campus Unit User', campusId: "2" },
];

// export let CAMPUSES: Campus[] = [
//   { id: 1, name: 'Central University', district: 'North', points: 15 },
//   { id: 2, name: 'Southern State College', district: 'South', points: 5 },
//   { id: 3, name: 'Northern Tech Institute', district: 'North', points: 25 },
//   { id: 4, name: 'Western Community College', district: 'West', points: 0 },
// ];

export const EVENTS: Event[] = [
  { id: 1, title: 'Summit Club', description: 'Form a club in your campuses with unit habeebs and suitable alumni to handle registration, promotion, and PR events.', submissionType: ['Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-07-10', placeholder: 'Enter team member details and list of available alumni participants...' },
  { id: 2, title: 'Sketch Pad', description: 'Conduct meetings in professional campuses with district leadership, including announcements, performances, studies, and promotions via media.', submissionType: ['Media Upload','Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-07-20' },
  { id: 3, title: 'Sketch Pad Rally', description: 'Organize a rally using posters and banners as part of Sketch Pad activities.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-07-20' },
  { id: 4, title: 'Sketch Pad Reel', description: 'Create and share reels on social media for Sketch Pad.', submissionType: ['Video Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-07-20' },
  { id: 5, title: 'Roots & Wings', description: 'Conduct meeting with local unit near to your campus with the help of division leaders, for getting necessary support and facilities.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-07-30' },
  { id: 6, title: 'Chumarezhuth', description: 'Conduct wall writing activities, with at least one per campus unit, making it grand and attractive.', submissionType: ['Quantitative Input','Image Upload','Text Submission'], gradingType: 'Discretion', maxPoints: 25, deadline: '2025-08-30' },
  { id: 7, title: 'CommUnity Reach', description: 'Organize community service activities like medical camps, awareness programs, and distributions, tailored to college context.', submissionType: ['Text Submission','Image Upload'], gradingType: 'Fixed', maxPoints: 10, deadline: '2025-08-15', placeholder: 'e.g., Describe the event, number of participants, and the community impact...'  },
  { id: 8, title: 'Vigilantia-1 participation', description: 'Participate in the state-level camp for student representatives on August 30-31.', submissionType: ['Quantitative Input','Text Submission'], gradingType: 'Discretion', maxPoints: 5, deadline: '2025-08-31' },
  { id: 9, title: 'Momentum Begins', description: 'Inaugurate prof summit registration at campus level with district leaders, planning custom activities.', submissionType: ['Text Submission','Image Upload'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-08-25' },
  { id: 10, title: 'SummitSights', description: 'Create theme-related tags, logos, or constructions in campuses as part of profsummit promotion.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Discretion', maxPoints: 5, deadline: '2025-08-30' },
  { id: 11, title: 'Echoes & Insights', description: 'Organize alumni meetings with students, discussing prof summit and planning visits and activities.', submissionType: ['Text Submission','Image Upload'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-08-30' },
  { id: 12, title: 'Inter campus visit', description: 'Visit nearby campuses to promote prof summit and register students, with extra points for non-unit campuses.', submissionType: ['Quantitative Input','Image Upload','Text Submission'], gradingType: 'Discretion', maxPoints: 50, deadline: '2025-09-15' },
  { id: 13, title: 'Brain Wave', description: 'Participate in state-level ideathon.', submissionType: ['Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-09-15', placeholder: 'Enter a small abstract...' },
  { id: 14, title: 'Beyond the books', description: 'Honor teachers and staff on Teachers Day, conveying prof summit ideas.', submissionType: ['Text Submission','Image Upload','Media Upload', 'Video Upload'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-09-05' },
  { id: 15, title: 'Where We Belong', description: 'Schedule alumni visits to the campus for sharing profsummit experience and promoting registration.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-09-30' },
  { id: 16, title: 'Weekly E-Posters', description: 'Release weekly e-posters on career trends and summit highlights, on social media.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Discretion', maxPoints: 20, deadline: '2025-09-30' },
  { id: 17, title: 'Frame to Fame', description: 'Create reels based on various ideas and share on social media.', submissionType: ['Video Upload','Media Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-09-30' },
  { id: 18, title: 'Meta Ads Drive', description: 'Promote prof summit videos via Meta Ads on campus Facebook/Instagram pages.', submissionType: ['Media Upload'], gradingType: 'Fixed', maxPoints: 10, deadline: '2025-09-30' },
  { id: 19, title: 'Campus to Summit', description: 'Hostel visit lead by division/district/state leaders.', submissionType: ['Text Submission','Image Upload'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-09' },
  { id: 20, title: 'Promo Video Making', description: 'Create videos for the prof summit.', submissionType: ['Video Upload','Media Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 21, title: 'E-Poster Making', description: 'Design and submit e-posters.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 22, title: 'Campus Rally', description: 'Organize a rally on campus.', submissionType: ['Image Upload','Media Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 23, title: 'Campus Banner', description: 'Create and display campus banners apart from state ones.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 24, title: 'Campus Flex', description: 'Set up campus flex boards.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 25, title: 'Profsummit Card', description: 'Distribute or create profsummit cards.', submissionType: ['Image Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 26, title: 'Shining Seeds', description: 'Placing welcome banner(Conscious Campus) provided by state.', submissionType: ['Text Submission','Image Upload'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 27, title: 'Campus Moulid', description: 'Organize campus moulid event.', submissionType: ['Image Upload','Media Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 28, title: 'Welcome Juniors', description: 'Welcome event for junior students.', submissionType: ['Image Upload','Media Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 29, title: 'Sweet Meelad', description: 'Organize sweet meelad celebration.', submissionType: ['Image Upload','Media Upload','Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 30, title: 'Reflections', description: 'Campus students gathering for reflection.', submissionType: ['Text Submission'], gradingType: 'Fixed', maxPoints: 5, deadline: '2025-10-31' },
  { id: 31, title: 'Online Registration', description: 'Facilitate online registrations for students. 3 Points for 15 Students 5 for 30 Students 10 for 50 Students', submissionType: ['Quantitative Input','Image Upload','Text Submission'], gradingType: 'Discretion', maxPoints: 10, deadline: '2025-10-31' },
  { id: 32, title: 'Profsummit Checkin', description: 'One point per student will be awarded for participation in profsummit.', submissionType: ['Quantitative Input','Text Submission'], gradingType: 'Fixed', maxPoints: 50, deadline: '2025-10-31' },
  { id: 33, title: 'Independent Events', description: 'Organize independent events apart from the above events to promote profsummit.', submissionType: ['Text Submission','Image Upload','Media Upload'], gradingType: 'Discretion', maxPoints: 5, deadline: '2025-10-31' },
];

// export let SUBMISSIONS: Submission[] = [
//   { id: 1, eventId: 1, campusId: 1, submittedBy: 'Main Campus Rep', status: 'Pending Review', submittedAt: '2025-09-01', data: { link: 'https://instagram.com/reel/123' } },
//   { id: 2, eventId: 2, campusId: 3, submittedBy: 'Northern Tech Rep', status: 'Pending Review', submittedAt: '2025-09-02', data: { quantity: 5, photoEvidence: 'photo_of_5_walls.jpg' } },
//   { id: 3, eventId: 3, campusId: 1, submittedBy: 'Main Campus Rep', status: 'Approved', submittedAt: '2025-08-28', data: { text: 'We conducted a cleanliness drive...' }, awardedPoints: 10, feedback: 'Great work!' },
//   { id: 4, eventId: 4, campusId: 2, submittedBy: 'South Campus Rep', status: 'Approved', submittedAt: '2025-09-01', data: {}, awardedPoints: 5, feedback: 'Participation confirmed.' },
//   { id: 5, eventId: 1, campusId: 3, submittedBy: 'Northern Tech Rep', status: 'Approved', submittedAt: '2025-09-04', data: { link: 'https://instagram.com/reel/abc' }, awardedPoints: 15, feedback: 'Excellent video quality and engagement.' },
// ];
