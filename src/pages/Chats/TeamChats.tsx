import React, { useMemo, useState, useEffect } from "react";
import searchIcon from "@/assets/chats/searchIcon.svg";
import sendIcon from "@/assets/chats/sendIcon.svg";
import mentionIcon from "@/assets/chats/mentionIcon.svg";
import cameraIcon from "@/assets/chats/cameraIcon.svg";
import customerServiceIcon from "@/assets/setting/customer-service.svg";
import { useWalkthroughStore } from '@/store/walkthroughStore';
import { settingsTrainingSteps } from '@/walkthrough/steps';
import { useNavigate } from 'react-router-dom';

// Types
interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastSeen: string;
  type: "individual";
  mobile?: string;
}
interface Group {
  id: string;
  name: string;
  avatar: string;
  memberIds: string[];
  type: "group";
  lastMessage: {
    text: string;
    time: string;
    senderId: string;
    unread: boolean;
  };
}
interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  readBy: string[];
}
type Chat = User | Group;

// Dummy data (production-like schema)
const users: User[] = [
  {
    id: "u1",
    name: "Das",
    role: "Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastSeen: "2024-06-10T13:15:00Z",
    type: "individual",
  },
  {
    id: "u2",
    name: "Mani",
    role: "Cashier",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    lastSeen: "2024-06-10T13:10:00Z",
    type: "individual",
  },
  {
    id: "u3",
    name: "Priya",
    role: "Waiter",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastSeen: "2024-06-10T13:00:00Z",
    type: "individual",
  },
  {
    id: "u4",
    name: "Chef John",
    role: "Chef",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    lastSeen: "2024-06-10T12:50:00Z",
    type: "individual",
  },
  {
    id: "u5",
    name: "Chef John",
    role: "Chef",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    lastSeen: "2024-06-10T12:50:00Z",
    type: "individual",
  },
  {
    id: "u6",
    name: "Chef John",
    role: "Chef",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    lastSeen: "2024-06-10T12:50:00Z",
    type: "individual",
  },
];

const groups: Group[] = [
  {
    id: "g1",
    name: "Team Triaxx (Cashier)",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    memberIds: ["u1", "u2", "u3"],
    type: "group",
    lastMessage: {
      text: "Manager online payment issue...",
      time: "14:00",
      senderId: "u1",
      unread: true,
    },
  },
  {
    id: "g2",
    name: "Team Triaxx (Waiters)",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg",
    memberIds: ["u3"],
    type: "group",
    lastMessage: {
      text: "Waiter online payment issue...",
      time: "14:00",
      senderId: "u3",
      unread: false,
    },
  },
];

const messages: Message[] = [
  // Group chat (g1)
  {
    id: "m1",
    chatId: "g1",
    senderId: "u2",
    text: "Hi team 👋",
    timestamp: "2024-06-10T11:31:00Z",
    readBy: ["u1", "u3"],
  },
  {
    id: "m2",
    chatId: "g1",
    senderId: "u2",
    text: "Need help in the first floor !!!",
    timestamp: "2024-06-10T11:31:00Z",
    readBy: ["u1"],
  },
  {
    id: "m3",
    chatId: "g1",
    senderId: "u1",
    text: "I will come.",
    timestamp: "2024-06-10T11:31:00Z",
    readBy: ["u2", "u3"],
  },
  {
    id: "m4",
    chatId: "g1",
    senderId: "u2",
    text: "yeah okay",
    timestamp: "2024-06-10T11:31:00Z",
    readBy: ["u1", "u3"],
  },
  {
    id: "m5",
    chatId: "g1",
    senderId: "u2",
    text: "i will be waiting for team",
    timestamp: "2024-06-10T11:31:00Z",
    readBy: ["u1", "u3"],
  },
  // 1-1 chat (u1-u2)
  {
    id: "m6",
    chatId: "u2",
    senderId: "u1",
    text: "Hi team 👋",
    timestamp: "2024-06-10T11:31:00Z",
    readBy: ["u2"],
  },
  {
    id: "m7",
    chatId: "u2",
    senderId: "u2",
    text: "See you all then!",
    timestamp: "2024-06-10T11:32:00Z",
    readBy: ["u1"],
  },
];

const roles = ["All", "Waiters", "Chefs", "Managers"];

// Utility to get user by id
const getUser = (id: string): User | undefined =>
  users.find((u) => u.id === id);
// Utility to get group by id
const getGroup = (id: string): Group | undefined =>
  groups.find((g) => g.id === id);
// Utility to get chat display name
const getChatName = (chat: Chat) => chat.name || getUser(chat.id)?.name;
// Utility to get chat avatar
const getChatAvatar = (chat: Chat) => chat.avatar || getUser(chat.id)?.avatar;
// Utility to get chat last message
const getChatLastMessage = (chat: Chat) => {
  if (chat.type === "group") return chat.lastMessage;
  // For 1-1, get last message from messages
  const chatMsgs = messages.filter((m) => m.chatId === chat.id);
  if (!chatMsgs.length) return null;
  const last = chatMsgs[chatMsgs.length - 1];
  return {
    text: last.text,
    time: new Date(last.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    senderId: last.senderId,
    unread: !last.readBy.includes("u1"), // Assume u1 is current user
  };
};

// ChatTile component
const ChatTile = ({
  chat,
  selected,
  onClick,
}: {
  chat: Chat;
  selected: boolean;
  onClick: () => void;
}) => {
  const lastMsg = getChatLastMessage(chat);
  const unreadCount = messages.filter(
    (m) =>
      m.chatId === chat.id &&
      Array.isArray(m.readBy) &&
      !m.readBy.includes("u1")
  ).length;

  return (
    <div
      className={`flex items-center gap-3 px-2 py-3 cursor-pointer rounded-lg transition-all ${
        selected ? "bg-[#F8EAEE]" : "hover:bg-[#F8EAEE]"
      }`}
      onClick={onClick}
    >
      <img
        src={getChatAvatar(chat)}
        alt="avatar"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base truncate text-[#2C2C2E]">
          {getChatName(chat)}
        </div>
        <div
          className={`truncate text-sm ${"font-normal text-[#666668]"
          }`}
        >
          {lastMsg?.text || ""}
        </div>
      </div>
      <div className="flex flex-col items-end min-w-[40px]">
        {unreadCount > 0 && (
          <div className="mt-1 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
        <div className="text-xs text-[#BDBDBD] font-semibold">
          {lastMsg?.time}
        </div>
      </div>
    </div>
  );
};

// MessageBubble component
const MessageBubble = ({
  message,
  isSelf,
  sender,
}: {
  message: Message;
  isSelf: boolean;
  sender: User;
}) => (
  <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-2`}>
    {!isSelf && (
      <img
        src={sender.avatar}
        alt={sender.name}
        className="w-8 h-8 rounded-full mr-2"
      />
    )}
    <div
      className={`max-w-[60%] ${
        isSelf
          ? "bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white"
          : "bg-[#F8EAEE] text-black"
      } px-4 py-2 rounded-xl relative`}
    >
      {!isSelf && (
        <div className="text-xs font-bold mb-1 text-[#6A1B9A]">
          {sender.name}{" "}
          <span className="text-[#BDBDBD] font-normal">{sender.role}</span>
        </div>
      )}
      <div className="text-base break-words">{message.text}</div>
      <div
        className={`text-xs mt-1 flex justify-end items-center gap-1 ${
          isSelf ? "text-white/80" : "text-[#BDBDBD]"
        }`}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        <span>✓✓</span>
      </div>
    </div>
  </div>
);

// 1. Add a mobile detection hook (SSR-safe)
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

// 3. Update ChatWindow to accept isMobile and onBack, and add a back button for mobile
const ChatWindow = ({
  chat,
  messages,
  currentUser,
  isMobile,
  onBack,
  leftPanelRef,
}: {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  isMobile?: boolean;
  onBack?: () => void;
  leftPanelRef: React.RefObject<HTMLDivElement>;
}) => {
  const chatObj = chat.type === "group" ? getGroup(chat.id) : getUser(chat.id);
  const chatMsgs = messages.filter((m) => m.chatId === chat.id);
  const [message, setMessage] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement send message
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload
      console.log("Files to upload:", files);
    }
  };

  // Modal state for group members
  const [showMembers, setShowMembers] = React.useState<boolean>(false);
  const membersButtonRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>(
    {}
  );

  // Position popover absolutely within left panel, left-aligned to avatars button
  useEffect(() => {
    if (showMembers && membersButtonRef.current && leftPanelRef.current) {
      const btnRect = membersButtonRef.current.getBoundingClientRect();
      const panelRect = leftPanelRef.current.getBoundingClientRect();
      setPopoverStyle({
        position: "absolute",
        top: btnRect.bottom - panelRect.top + 8,
        left: btnRect.left - panelRect.left,
        zIndex: 50,
        width: 260,
        maxHeight:400,
        overflowY:"scroll"
      });
    }
  }, [showMembers]);

  // Click outside to close
  useEffect(() => {
    if (!showMembers) return;
    function handleClick(e: MouseEvent) {
      if (
        membersButtonRef.current &&
        popoverRef.current &&
        !membersButtonRef.current.contains(e.target as Node) &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowMembers(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMembers]);

  // Helper for group member avatars
  const renderGroupAvatars = (group: Group) => (
    <button
      ref={membersButtonRef}
      className="flex -space-x-3 items-center relative z-10 focus:outline-none"
      onClick={() => setShowMembers(true)}
      title="View Members"
      type="button"
    >
      {group.memberIds.slice(0, 4).map((id: string) => {
        const member = getUser(id);
        if (!member) return null;
        return (
          <img
            key={id}
            src={member.avatar}
            alt={member.name}
            className="w-8 h-8 rounded-full border-2 border-white shadow -ml-2 first:ml-0"
            style={{ zIndex: 10 - group.memberIds.indexOf(id) }}
          />
        );
      })}
      {group.memberIds.length > 4 && (
        <span className="w-8 h-8 rounded-full bg-[#F8EAEE] flex items-center justify-center text-xs font-bold text-[#6A1B9A] border-2 border-white -ml-2">
          +{group.memberIds.length - 4}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden flex-1 min-h-0">
      {/* Header */}
      {chatObj && (
        <div className="flex items-center px-4 md:px-8 py-4 md:py-5 border-b border-[#E5E5EA] bg-white relative">
          {/* Mobile back button */}
          {isMobile && onBack && (
            <button
              className="mr-3 flex-shrink-0 md:hidden"
              onClick={onBack}
              aria-label="Back to chat list"
              type="button"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#6A1B9A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {chat.type === "group" ? (
            <>
              {renderGroupAvatars(chatObj as Group)}
              <div className="flex-1 flex flex-col items-center justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <img
                    src={chatObj.avatar}
                    alt="group logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-bold text-lg text-[#2C2C2E] truncate">
                    {chatObj.name}
                  </span>
                </div>
                <div className="text-xs text-[#BDBDBD] mt-1">
                  last seen 45 minutes ago
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                src={chatObj.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 flex flex-col items-center justify-center min-w-0">
                <span className="font-bold text-lg text-[#2C2C2E] truncate">
                  {chatObj.name}
                </span>
                <span className="text-xs text-[#BDBDBD] mt-1">
                  last seen 45 minutes ago
                </span>
              </div>
            </>
          )}
        </div>
      )}
      {/* Team Members Modal */}
      {chat.type === "group" && showMembers && chatObj ? (
        <div
          ref={popoverRef}
          style={popoverStyle}
          className="bg-white shadow-xl p-4 border border-[#E5E5EA] animate-fade-in relative rounded w-[260px]"
        >
          {/* Arrow aligned to avatars button */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t border-[#E5E5EA] rotate-45 z-10"></div>
          <div
            className="font-medium text-sm mb-3 rounded-xl border-0 px-2 py-1 text-[#666668]"
            style={{ boxShadow: "0px -3px 0px 0px #E5E5EA inset" }}
          >
            Team Members
          </div>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {(chatObj as Group).memberIds.map((id) => {
              const member = getUser(id);
              if (!member) return null;
              // Use a placeholder for mobile number, or member.mobile if available
              const mobile = member.mobile || "xxxxxxxxxx";
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-base">
                        {member.name}
                      </div>
                      <div className="text-xs text-[#BDBDBD]">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#222] font-semibold ml-2 whitespace-nowrap">
                    {mobile}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {/* Date */}
      <div className="text-center text-xs text-[#BDBDBD] py-2 bg-white">
        8/20/2020
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 bg-white min-h-0">
        {chatMsgs.length === 0 ? (
          <div className="text-center text-[#222] mt-20">No messages yet.</div>
        ) : (
          chatMsgs.map((msg) => {
            const sender = getUser(msg.senderId) as User;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSelf={msg.senderId === currentUser.id}
                sender={
                  sender || {
                    name: "Unknown",
                    avatar: "",
                    role: "",
                    id: "",
                    lastSeen: "",
                    type: "individual",
                  }
                }
              />
            );
          })
        )}
      </div>
      {/* Input */}
      <div
        className="border-t border-[#E5E5EA] px-4 md:px-6 py-4 flex items-center gap-3 bg-white"
        style={{ boxShadow: "0px -2px 8px 0px #E5E5EA1A" }}
      >
        <button
          className="text-2xl text-[#6A1B9A] flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F8EAEE] transition"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <img src={cameraIcon} alt="upload" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          multiple
          accept="image/*,video/*"
        />
        <input
          type="text"
          className="flex-1 border-none outline-none text-base text-[#666668] placeholder:text-[#BDBDBD]"
          placeholder="Start typing..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="text-2xl text-[#6A1B9A] flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F8EAEE] transition"
          type="button"
        >
          <img src={mentionIcon} alt="@" className="w-6 h-6" />
        </button>
        <button
          className="text-2xl text-[#6A1B9A] flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F8EAEE] transition"
          onClick={handleSendMessage}
          type="button"
        >
          <img src={sendIcon} alt="send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// 2. Update TeamChats component
const TeamChats: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const currentUser = users[0]; // Assume u1 is current user
  const isMobile = useIsMobile();
  const leftPanelRef = React.useRef<HTMLDivElement>(null!);
  const { isActive, steps, currentStep, next, completed, activeTraining, completedTrainings, startTraining } = useWalkthroughStore();
  const navigate = useNavigate();

  // Filter chats by tab and search
  const chatList = useMemo(() => {
    let chats: Chat[] = [
      ...groups,
      ...users.filter((u) => u.id !== currentUser.id),
    ];
    if (activeTab !== "All") {
      chats = chats.filter((c) => {
        if (c.type === "group") {
          return c.memberIds.some(
            (id) => getUser(id)?.role === activeTab.slice(0, -1)
          );
        }
        return c.role === activeTab.slice(0, -1);
      });
    }
    if (search) {
      chats = chats.filter((c) => {
        const chatName = getChatName(c);
        const searchLower = search.toLowerCase();
        if (chatName && chatName.toLowerCase().includes(searchLower)) {
          return true;
        }
        if ("role" in c && typeof c.role === "string") {
          return c.role.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }
    return chats;
  }, [activeTab, search]);

  // When tab changes, clear selected chat
  const handleTabClick = (role: string) => {
    setActiveTab(role);
    setSelectedChat(null);
  };

  // Start settings training after teamchat training completes
  React.useEffect(() => {
    if (
      completed &&
      activeTraining === 'teamchat' &&
      !completedTrainings.settings
    ) {
      startTraining('settings', settingsTrainingSteps);
      navigate('/');
    }
  }, [completed, activeTraining, completedTrainings, startTraining, navigate]);

  return (
    <div className="p-0 md:p-6 flex flex-col h-screen overflow-hidden">
      {/* Desktop Title */}
      <div className="text-3xl font-bold mb-4 md:mb-6 px-4 md:px-0 hidden md:block">
        Chats
      </div>
      {/* Mobile Title with Icon */}
      <div className="flex items-center gap-3 px-4 py-4 md:hidden">
        <img src={customerServiceIcon} alt="Team Chat" className="w-7 h-7" />
        <span className="text-xl font-bold text-[#2C2C2E]">Team Chat</span>
      </div>
      <div className="bg-white lg:shadow-2xl sm:shadow px-0 md:px-6 flex flex-1 min-h-0 rounded-2xl overflow-hidden relative team-chat-full-panel">
        {/* Left: Chat List */}
        <div
          ref={leftPanelRef}
          className={
            `w-full md:w-[420px] border-r-0 md:border-r-2 border-[#E5E5EA] pr-0 md:pr-4 flex flex-col min-h-0 relative team-chat-left-panel` +
            (isMobile && selectedChat ? " hidden" : "")
          }
        >
          {/* Search */}
          <div className="my-4 px-4 md:px-0">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-lg bg-[#FAFAFA] pl-10 pr-6 py-3 text-sm text-[#666668] placeholder:text-[#666668] focus:outline-none"
                placeholder="Search Team"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ boxShadow: "0px -3px 0px 0px #E5E5EA inset" }}
              />
              <img
                src={searchIcon}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] text-lg"
              />
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-2 mb-4 px-4 md:px-0">
            {roles.map((role) => (
              <button
                key={role}
                className={`px-4 py-1 rounded-full font-medium text-base transition-all ${
                  activeTab === role
                    ? "bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white"
                    : "bg-[#F8EAEE]  hover:bg-[#F8EAEE]"
                }`}
                onClick={() => handleTabClick(role)}
                type="button"
              >
                {role}
              </button>
            ))}
          </div>
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto min-h-0 h-full flex flex-col px-2 md:px-0">
            {chatList.map((chat) => (
              <ChatTile
                key={chat.id}
                chat={chat}
                selected={!!selectedChat && selectedChat.id === chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  // Advance walkthrough if on the left panel step
                  const step = steps[currentStep];
                  if (isActive && step && step.selector === '.team-chat-left-panel') {
                    next();
                  }
                }}
              />
            ))}
          </div>
        </div>
        {/* Right: Chat Window */}
        <div
          className={`flex-1 flex flex-col min-h-0 w-full${isMobile && !selectedChat ? ' hidden' : ''}`}
        >
          {!selectedChat ? (
            <div className="flex items-center justify-center h-full text-center text-lg text-[#2C2C2E] bg-transparent">
              <div>
                Send and Receive message without any interruption
                <br />
                Message your team for any assistance or help required
              </div>
            </div>
          ) : (
            <ChatWindow
              chat={selectedChat}
              messages={messages}
              currentUser={currentUser}
              isMobile={isMobile}
              onBack={() => setSelectedChat(null)}
              leftPanelRef={leftPanelRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChats;
