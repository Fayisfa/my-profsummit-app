// Sidebar.tsx
import React from 'react';
import type { User, View } from '../utils/types';
import {
    HomeIcon,
    CalendarIcon,
    InboxIcon,
    TrophyIcon,
    WhatsAppIcon,
    LogoutIcon,
    DocumentIcon,
    XIcon,
    BarChartIcon,
    PieChartIcon,

} from '../utils/Icons';
import profSummitP from '/assets/profsummitP.png';
import { BuildingIcon, History as HistoryIcon, LayoutGridIcon, ShareIcon } from 'lucide-react';

interface SidebarProps {
    user: User;
    onLogout: () => void;
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void; // added so we can close sidebar on mobile
}

const Sidebar: React.FC<SidebarProps> = ({
    user,
    onLogout,
    activeView,
    setActiveView,
    isOpen,
    setIsOpen,
}) => {
const navItems = [
        // --- General Items (Show for everyone EXCEPT District Admins) ---
        ...(user.role !== 'District' ? [
            { name: 'Overview', icon: HomeIcon },
            { name: 'Events', icon: CalendarIcon },
            { name: 'Submissions', icon: InboxIcon },
        ] : []),

        // --- State Admin Only Items ---
        ...(user.role === 'State Admin' ? [{ name: 'Submission Overview', icon: PieChartIcon }] : []),
        ...(user.role === 'State Admin' ? [{ name: 'Registration Overview', icon: BarChartIcon }] : []),
        ...(user.role === 'State Admin' ? [{ name: 'Retention Analysis', icon: HistoryIcon }] : []),
        ...(user.role === 'State Admin' ? [{ name: 'Leaderboard', icon: TrophyIcon }] : []),
        ...(user.role === 'State Admin' ? [{ name: 'College Overview', icon: BuildingIcon }] : []),
        ...(user.role === 'State Admin' ? [{ name: 'Division Overview', icon: LayoutGridIcon }] : []),
        ...(user.role === 'State Admin' || user.role === 'District' ? [{ name: 'Share Center', icon: ShareIcon }] : []),
        
        // --- District Admin Only Items ---
        ...(user.role === 'District' ? [{ name: 'District Current Year', icon: BarChartIcon }] : []),
        ...(user.role === 'District' ? [{ name: 'District Past Year', icon: HistoryIcon }] : []),
        ...(user.role === 'District' ? [{ name: 'Division Overview', icon: LayoutGridIcon }] : []),
        ...(user.role === 'District' ? [{ name: 'College Overview', icon: BuildingIcon }] : []),
        
        // --- Document Link (Show for everyone EXCEPT District Admins) ---
        ...(user.role !== 'District' ? [{ name: 'Document', icon: DocumentIcon }] : []),
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/30 md:hidden z-10"
                />
            )}

            <aside
                className={`w-64 flex flex-col h-screen bg-white border-r border-slate-200 lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 
  transition-transform duration-300 ease-in-out 
  md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
  fixed md:relative z-20`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <img src={profSummitP} className="w-8 h-8" alt="Logo" />
                        <span className="ml-2 font-bold text-lg">CampusDash</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-slate-500 hover:text-slate-700"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Nav (flex-1 ensures it pushes user block down) */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = activeView === item.name;
                        return (
                            <a
                                key={item.name}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveView(item.name as View);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`}
                                />
                                <span>{item.name}</span>
                            </a>
                        );
                    })}
                </nav>
                
                <div className="px-4 pt-4 border-t border-slate-200">
                    <a 
                        href="https://wa.me/917592073257" // Replace with your actual WhatsApp number
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                        <WhatsAppIcon className="w-5 h-5" />
                        <span className="font-semibold">Contact Support</span>
                    </a>
                </div>

                {/* User/Logout section pinned at bottom */}
                <div className="px-4 pb-4 ">
                    {/* <div className="px-4 mb-3">
                        <p className="text-sm font-semibold text-slate-700 leading-snug">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                    </div> */}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors 
      text-rose-600 hover:bg-rose-50 font-semibold"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>


        </>
    );
};

export default Sidebar;
