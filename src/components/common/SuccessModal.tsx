import SuccessOrderIcon from "@/assets/order/success_order_to_kitchen.svg";
import React from "react";

export const SuccessModal: React.FC<{
  open: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
}> = ({ open, title, subtitle, buttonText, onButtonClick,  }) => {
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop with blur, closes on click */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.15)] backdrop-blur-sm"
        onClick={onButtonClick}
      />
      {/* Modal content */}
      <div className="bg-white rounded-2xl w-[420px] max-w-full shadow-xl overflow-hidden flex flex-col items-center p-10 relative z-10 transition-all duration-300">
        <img src={SuccessOrderIcon} alt="Success" className="w-20 h-20 mb-6" />
        <div className="text-2xl font-bold text-green-600 mb-2 text-center">{title}</div>
        <div className="text-base text-[#222] mb-8 text-center">{subtitle}</div>
        <button
          className="w-60 py-3 rounded-xl text-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-all"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};