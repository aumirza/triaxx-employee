import React from 'react';

// Using an inline SVG for the checkmark to avoid asset issues
const CheckmarkIcon = () => (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);
  
interface MobileLogoutSuccessProps {
    isOpen: boolean;
    onContinue: () => void;
}
  
const MobileLogoutSuccess: React.FC<MobileLogoutSuccessProps> = ({ isOpen, onContinue }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 lg:hidden" >
            <div 
                className="w-full bg-white rounded-t-3xl p-8 flex flex-col items-center text-center"
            >
                <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center bg-green-100">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500">
                        <CheckmarkIcon />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-8 text-gray-800">You have Sign out Successfully !</h2>
                <button
                    onClick={onContinue}
                    className="w-full max-w-sm px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] rounded-xl hover:opacity-90"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
  
export default MobileLogoutSuccess; 