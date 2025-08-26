// ModalWrapper.tsx
import React from 'react';

interface ModalWrapperProps {
  visible: boolean;
  onHide: () => void;
  children: React.ReactNode;
  size?: 'lg' | 'xl' | '2xl' | '3xl';
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ visible, onHide, children, size = '2xl' }) => {
  if (!visible) return null;
  
  const sizeClasses = {
    'lg': 'max-w-lg', 'xl': 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onHide}>
      <div className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;