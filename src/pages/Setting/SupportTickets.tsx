import React, { useEffect } from "react";
import { useSupportTicketListStore } from "@/store/zustandStores";
import ongoingIcon from "@/assets/setting/sms-tracking-gray.svg";
import ongoingIconLight from "@/assets/setting/sms-tracking.svg";

import resolvedIcon from "@/assets/setting/sms-star.svg";
import allIcon from "@/assets/setting/all-sms-gray.svg";
import { useNavigate } from "react-router-dom";

const tabConfig = [
  { key: "all", label: "All Tickets", color: "text-[#007AFF]", icon: allIcon },
  {
    key: "ongoing",
    label: "On-Going",
    color: "text-[#F8A534]",
    icon: ongoingIcon,
  },
  {
    key: "resolved",
    label: "Resolved",
    color: "text-[#34C759]",
    icon: resolvedIcon,
  },
];

const statusColor = {
  ongoing: "bg-[#F8A534]",
  resolved: "bg-[#34C759]",
  all: "bg-[#007AFF]",
};

const statusBtnColor = {
  ongoing: "bg-[#F8A534] text-white",
  resolved: "bg-[#34C759] text-white",
  all: "bg-[#007AFF] text-white",
};

const SupportTickets: React.FC = () => {
  const {
    tickets,
    loading,
    error,
    filter,
    period,
    search,
    fetchTickets,
    setFilter,
    setPeriod,
    setSearch,
  } = useSupportTicketListStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchTickets();
  }, [filter, period, search, fetchTickets]);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[#00000099] font-bold text-[32px]">
          Support Ticket &gt;
        </span>
        <span className="text-black font-bold text-[32px]">
          {tabConfig.find((t) => t.key === filter)?.label || "All Ticket"}
        </span>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for ticket"
            className="w-full max-w-xs border rounded-md px-4 py-2 bg-[linear-gradient(180deg,rgba(106,27,154,0.1)_0%,rgba(211,47,47,0.1)_100%)] text-black/80 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select
            className="border rounded-md px-4 py-2 bg-[#F9F9F9] text-black focus:outline-none"
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as "week" | "day" | "month")
            }
          >
            <option value="week">This Week</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-8 mb-8">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 font-semibold text-lg pb-2 transition-all ${
              filter === tab.key ? `${tab.color} ` : "text-[#BDBDBD] "
            }`}
            onClick={() => setFilter(tab.key as "all" | "ongoing" | "resolved")}
          >
            <img src={tab.icon} alt={tab.label} className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>
      {/* Ticket List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="text-center py-10">Loading tickets...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-10 text-[#BDBDBD]">
            No tickets found.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.ticketNumber}
              className="rounded-2xl p-6 bg-gradient-to-br from-[#F8EAEE] via-[#F9F6FB] to-[#F8EAEE] shadow flex flex-col gap-2 relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      statusColor[ticket.status] || "bg-[#007AFF]"
                    }`}
                  ></span>
                  <span className="text-black font-medium text-base">
                    Ticket# {ticket.ticketNumber}
                  </span>
                </div>
                <div className="text-black text-sm font-medium">
                  Posted at {ticket.postedAt}
                </div>
              </div>
              <div className="font-bold text-lg mb-1">{ticket.subject}</div>
              <div className="text-black/80 text-base mb-2 line-clamp-2">
                {ticket.message}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={ticket.avatar}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
                <span className="text-black/80 font-semibold text-base">
                  {ticket.businessName}
                </span>
                <span
                  className="ml-auto text-primary-gradient font-semibold cursor-pointer"
                  onClick={() => navigate(`/settings/tickets/${ticket?.ticketNumber}`)}
                  
                >
                  Open Ticket
                </span>
              </div>
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <button
                  className={`flex items-center gap-2 px-4 py-1 rounded-lg font-semibold ${
                    statusBtnColor[ticket.status] || "bg-[#007AFF] text-white"
                  }`}
                  style={{ minWidth: 110 }}
                >
                  <img
                    src={ongoingIconLight}
                    alt="status"
                    className="w-5 h-5"
                  />
                  {ticket.status === "resolved" ? "Resolved" : "On-Going"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
