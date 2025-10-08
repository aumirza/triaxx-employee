import React from 'react';

interface MobileLogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MobileLogoutConfirmation: React.FC<MobileLogoutConfirmationProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 lg:hidden" onClick={onClose}>
      <div 
        className="w-full bg-white rounded-t-3xl p-8 text-center" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-8 text-black ">Are you Sure to Sign out?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3.5 font-semibold text-black  bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50"
          >
            No, Stay
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] rounded-xl hover:opacity-90"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLogoutConfirmation; 