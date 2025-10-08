import React from "react";
import mailIcon from "@/assets/setting/Mail.svg";
import { useNavigate } from "react-router-dom";
import FAQAccordion from "./FAQAccordion";
import { useWalkthroughStore } from "@/store/walkthroughStore";
import { profileTrainingSteps } from "@/walkthrough/steps";

const FAQ_DATA = [
  {
    heading: "Orders & Reservations",
    items: [
      {
        id: 1,
        question:
          "I don't need a brand strategist but I need help executing an upcoming campaign. Can we still work together?",
        answer:
          "Yes, we can work together on your campaign even if you don't need a brand strategist.",
      },
      {
        id: 2,
        question:
          "I don't need a brand strategist but I need help executing an upcoming campaign. Can we still work together?",
        answer:
          "Yes, we can work together on your campaign even if you don't need a brand strategist.",
      },
    ],
  },
  {
    heading: "Invoices & Feed Backs",
    items: [
      {
        id: 3,
        question:
          "I don't need a brand strategist but I need help executing an upcoming campaign. Can we still work together?",
        answer:
          "Yes, we can work together on your campaign even if you don't need a brand strategist.",
      },
      {
        id: 4,
        question:
          "I don't need a brand strategist but I need help executing an upcoming campaign. Can we still work together?",
        answer:
          "Yes, we can work together on your campaign even if you don't need a brand strategist.",
      },
    ],
  },
];

const ContactSupport: React.FC = () => {
  const navigate = useNavigate();
  const { settingsHighlight, setSettingsHighlight, startTraining } = useWalkthroughStore();

  React.useEffect(() => {
    if (settingsHighlight === "contact-support") {
      const timer = setTimeout(() => {
        setSettingsHighlight("");
        navigate("/");
        setTimeout(() => {
          startTraining("profile", profileTrainingSteps);
        }, 500); // slight delay to ensure navigation
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [settingsHighlight, setSettingsHighlight, navigate, startTraining]);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <span
          className="text-[#00000099] font-bold text-[32px] cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          Settings{" "}
        </span>
        <span className="text-black font-bold  text-[32px]">
          &gt; Contact Support
        </span>
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-8 contact-support-highlight">
        {/* Need Help Card */}
        <div className="flex-1 flex flex-col md:flex-row gap-6">
          <div className="border rounded-3xl p-6 flex-1 max-w-[420px] flex flex-col justify-between">
            <div>
              <div className="font-bold text-xl mb-2">Need Help?</div>
              <div className="text-sm text-black/80 mb-2">
                Facing any issues, Custom Feature, New App Development, New
                Project, connect with us we will respond in 24 hrs.
                <br />
                <span className="font-bold">Mail: hi@uiflow.in</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-t from-[#D32F2F] to-[#6A1B9A] text-white font-semibold text-base shadow">
              <img src={mailIcon} alt="mail" className="w-6 h-6" />
              hi@uiflow.in
            </div>
          </div>
        </div>
        {/* Support Ticket Card */}
        <div className="flex-1 max-w-[420px] border border-[#00000099] rounded-3xl p-6 flex flex-col items-center">
          <div className="font-bold text-2xl mb-6">Support Ticket</div>
          <button
            className="w-full max-w-xs py-2 rounded-lg font-semibold text-white text-base mb-6 bg-gradient-to-t from-[#D32F2F] to-[#6A1B9A] shadow"
            onClick={() => navigate("/settings/create-ticket")}
          >
            Create Ticket
          </button>
          <div className=" gradient-border ">
            <button className="w-[320px] max-w-xs rounded-lg font-semibold  gradient-border-inner bg-white"
                        onClick={() => navigate("/settings/tickets")}

            >
              View Raised Ticket
            </button>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="mt-12">
          <div className="text-3xl font-bold mb-8">FAQ's</div>
          <FAQAccordion sections={FAQ_DATA} />
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
