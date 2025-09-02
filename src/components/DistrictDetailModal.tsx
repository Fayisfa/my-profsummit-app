import React, { useMemo } from 'react';
import type { RegistrationData } from '../utils/types';
import ModalWrapper from '../modals/ModalWrapper';
import { X, Building } from 'lucide-react';

interface DistrictDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  districtName: string | null;
  registrations: RegistrationData[];
}

const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  isOpen,
  onClose,
  districtName,
  registrations,
}) => {
  // Memoize the calculation of top colleges to avoid re-computing on every render
  const collegesInDistrict = useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return [];
    }
    const grouped = registrations.reduce((acc, student) => {
      const college = student.college || 'Unknown College';
      if (!acc[college]) acc[college] = 0;
      acc[college]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a); // Show all colleges, sorted
  }, [registrations]);

  if (!isOpen || !districtName) return null;

  return (
    <ModalWrapper visible={isOpen} onHide={onClose} size="lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{districtName}</h2>
            <p className="text-sm text-slate-500">{registrations.length} Total Registrations</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* College List Body */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-semibold text-slate-700 mb-3">College-wise Breakdown</h3>
          <ul className="space-y-2">
            {collegesInDistrict.map(([name, count], index) => (
              <li key={name} className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500 text-xs w-6 text-center">#{index + 1}</span>
                    <span className="text-slate-700 font-medium">{name}</span>
                </div>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DistrictDetailModal;
