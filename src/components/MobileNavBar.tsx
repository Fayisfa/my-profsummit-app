// src/components/MobileNavBar.tsx
import React from 'react';
import { Download, LogOut, LayoutDashboard } from 'lucide-react';

interface MobileNavBarProps {
  onExport: () => void;
  onLogout: () => void;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ onExport, onLogout }) => {
  return (
    // This container is fixed to the bottom and only visible on screens smaller than 'lg'
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 shadow-t-xl z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {/* Dashboard Link (optional, for feel) */}
        <button className="flex flex-col items-center justify-center text-indigo-600 font-semibold">
          <LayoutDashboard className="w-6 h-6 mb-1" />
          <span className="text-xs">Dashboard</span>
        </button>

        {/* Export Button */}
        <button 
          onClick={onExport}
          className="flex flex-col items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <Download className="w-6 h-6 mb-1" />
          <span className="text-xs">Export</span>
        </button>
        
        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="flex flex-col items-center justify-center text-slate-600 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-6 h-6 mb-1" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavBar;