// src/components/HeaderActions.tsx
import React from 'react';
import { Download, LogOut } from 'lucide-react';
import { shareToWhatsApp } from '../utils/whatsapp';

interface HeaderActionsProps {
  onExport: () => void;
  onLogout: () => void;
  whatsappText?: string;
}


const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M.33,12.2a11.83,11.83,0,0,1,1.75-5.8,11.52,11.52,0,0,1,10-6.15,11.37,11.37,0,0,1,8.1,3.4,11.43,11.43,0,0,1,2.5,12.1,11.4,11.4,0,0,1-6,5.8,12.3,12.3,0,0,1-6.5.9,11.32,11.32,0,0,1-6.2-1.9L.33,24Zm7.1-1.35a.6.6,0,0,0-.4-.1.6.6,0,0,0-.4.1,3.18,3.18,0,0,0-2,3,5.6,5.6,0,0,0,1.3,3.6,10,10,0,0,0,5.1,5,7.57,7.57,0,0,0,3,.7,3.46,3.46,0,0,0,2.6-1.2.64.64,0,0,0,.1-.4,1,1,0,0,0-.3-.6l-1.5-.7a.62.62,0,0,0-.7.1l-.6.7a.57.57,0,0,1-.7.1,7,7,0,0,1-2.6-1.6,6.86,6.86,0,0,1-1.8-2.5.58.58,0,0,1,.1-.7l.7-.8a.64.64,0,0,0,.1-.7L8,7.9a.66.66,0,0,0-.7-.8Z"/>
  </svg>
);


const HeaderActions: React.FC<HeaderActionsProps> = ({ onExport, onLogout, whatsappText  }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">

      {whatsappText && (
        <button
          onClick={() => shareToWhatsApp(whatsappText)}
          className="flex items-center gap-2 px-3 py-2 text-xs lg:text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
        >
          <WhatsAppIcon />
          <span className="hidden lg:inline">Share Summary</span>
        </button>
      )}

      
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