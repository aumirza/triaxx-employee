import React from "react";
import USFlagImg from "@/assets/flag/america.svg";
import ChevronDownIconImg from "@/assets/header/down_arrow.svg";

interface LeftPanelProps {
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  children?: React.ReactNode;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  heading = (
    <h1 className="text-[#002B6B] font-bold text-4xl">
      POS that works as hard as you. <br />
      and Faster than you.
    </h1>
  ),
  subheading = (
    <p className="mt-6 text-lg text-[#414D60] max-w-md">
      Grow without limit with <span className="text-primary-gradient">Triaxx</span> and Make timely and accurate decision
      with real-time reports
    </p>
  ),
  children,
}) => {
  return (
    <div className="hidden lg:relative lg:flex lg:w-3/5 flex-col justify-center items-center text-center text-white p-12 gradient-background">
      <div>
        {heading}
        {subheading}
        {children}
      </div>
      <div className="lg:absolute mt-8 lg:top-130 lg:left-12">
        <button className="bg-white/90 text-[#372B4C] px-4 py-3 rounded-lg flex items-center text-sm font-medium shadow-md">
          <img
            src={USFlagImg}
            alt="US Flag"
            className="w-6 h-auto mr-2 rounded"
          />
          English
          <img
            src={ChevronDownIconImg}
            alt="dropdown arrow"
            className="w-4 h-4 ml-3 text-[#372B4C]"
          />
        </button>
      </div>
    </div>
  );
};

export default LeftPanel; 