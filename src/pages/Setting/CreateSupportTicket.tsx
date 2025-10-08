import React, { useRef, useEffect } from "react";
import { useSupportTicketStore } from "@/store/zustandStores";
import { useUserStore } from "@/store/zustandStores";
import { useNavigate } from "react-router-dom";
import uploadImage from '@/assets/setting/upload.svg'

const CreateSupportTicket: React.FC = () => {
  const {
    email,
    businessName,
    subject,
    message,
    images,
    ticketNumber,
    loading,
    error,
    setField,
    setImages,
    createTicket,
    fetchTicketId,
  } = useSupportTicketStore();
const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const userLoading = useUserStore((s) => s.loading);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch ticket ID automatically on mount if not present
  useEffect(() => {
    if (!ticketNumber) {
      fetchTicketId();
    }
  }, [ticketNumber, fetchTicketId]);

  // Prefill email and businessName from user if undefined or null and user is loaded
  useEffect(() => {
    if (user && (email === undefined || email === null)) {
      setField("email", user.email);
    }
    if (user && (businessName === undefined || businessName === null)) {
      setField("businessName", user.name);
    }
  }, [user, email, businessName, setField]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket();
    navigate('/settings/tickets')
  };

  if (userLoading || !user || !ticketNumber) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[#00000099] font-bold text-[32px] cursor-pointer" onClick={()=>navigate(-1)}>
          Support Ticket 
        </span>
        <span className="text-black font-bold text-[32px]">
        &gt; Create Support Ticket
        </span>
      </div>
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl shadow bg-gradient-to-br from-[#F8EAEE] via-[#F9F6FB] to-[#F8EAEE] p-8 md:p-12 max-w-5xl mx-auto relative"
        style={{ minHeight: 420 }}
      >
        {/* Ticket# and posted time */}
        <div className="flex justify-between mb-6">
          <div className="text-black font-medium text-base">
            Ticket# {ticketNumber}
          </div>
          <div className="text-black text-sm font-medium">
            Posted at{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        {/* Email & Business Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-black font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-4 py-2 bg-[#F9F9F9] text-black/80 focus:outline-none"
              value={email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-1">
              Business Name
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-4 py-2 bg-[#F9F9F9] text-black/80 focus:outline-none"
              value={businessName ?? ""}
              onChange={(e) => setField("businessName", e.target.value)}
              required
            />
          </div>
        </div>
        {/* Reply Ticket - Subject and Body */}
        <h2 className="text-[#2E2A40] ">Reply Ticket</h2>
        <div className="mb-6 border rounded">
          <input
            type="text"
            className="w-full rounded-md px-4 pt-2 m-0  text-black placeholder-black focus:outline-none"
            placeholder="Enter Subject..."
            value={subject ?? ""}
            onChange={(e) => setField("subject", e.target.value)}
            required
          />
          <textarea
            className="w-full  rounded-md px-4 py-2 min-h-[100px]   text-[#00000080] focus:outline-none resize-none"
            placeholder="Explain here..."
            value={message ?? ""}
            onChange={(e) => setField("message", e.target.value)}
            required
          />
        </div>
        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-black font-medium mb-1">
            Images Uploaded
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gradient-to-t from-[#D32F2F] to-[#6A1B9A] text-white font-semibold flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Img
              <img src={uploadImage} alt="upload"/>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {images && images.length > 0 && (
              <span className="text-black/80 text-sm">
                {images.map((f) => f.name).join(", ")}
              </span>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-16 py-2 rounded-lg font-semibold text-white text-lg bg-gradient-to-t from-[#D32F2F] to-[#6A1B9A] shadow disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default CreateSupportTicket;
