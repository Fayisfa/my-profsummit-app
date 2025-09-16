// src/components/MobileHeader.tsx
import React from 'react';
import type { User } from '../utils/types';
import { LayoutGrid } from 'lucide-react';

interface MobileHeaderProps {
  user: User;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ user }) => {
  return (
    // This header is only visible on mobile and sticks to the top
    <div className="lg:hidden sticky top-0 p-4 sm:p-6 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <LayoutGrid className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            {user.name} District
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;