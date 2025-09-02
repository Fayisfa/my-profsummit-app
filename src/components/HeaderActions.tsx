// src/components/HeaderActions.tsx
import React from 'react';
import { Download, LogOut } from 'lucide-react';

interface HeaderActionsProps {
  onExport: () => void;
  onLogout: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onExport, onLogout }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Export Button */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md border border-emerald-200/50"
      >
        <Download className="w-4 h-4 flex-shrink-0" />
        {/* Text is hidden on small screens, visible from 'sm' breakpoint up */}
        <span className="hidden sm:inline text-sm font-semibold">
          Export
        </span>
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-all duration-200 shadow-sm hover:shadow-md border border-rose-200/50"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {/* Text is hidden on small screens, visible from 'sm' breakpoint up */}
        <span className="hidden sm:inline text-sm font-semibold">
          Logout
        </span>
      </button>
    </div>
  );
};

export default HeaderActions;