// NotificationModal.tsx
import React from 'react';
import ModalWrapper from './ModalWrapper';

interface NotificationModalProps {
  visible: boolean;
  onHide: () => void;
  type: 'success' | 'error';
  message: string;
}

// --- MOCK ICONS ---
const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onHide, type, message }) => {
  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <ModalWrapper visible={visible} onHide={onHide} size="lg">
      <div className="p-6 text-center">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
            {isSuccess ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
                <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
        </div>
        <h3 className="mt-5 text-lg font-medium text-slate-900">{isSuccess ? 'Success' : 'Error'}</h3>
        <div className="mt-2 text-sm text-slate-500">
          <p>{message}</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={onHide}
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            OK
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default NotificationModal;
