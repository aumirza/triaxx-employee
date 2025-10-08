import React, { useEffect, useState } from 'react';
import headphoneIcon from '@/assets/setting/customer-service.svg';
import userIcon from '@/assets/profile/user.svg';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupportTicketListStore } from '@/store/zustandStores';
import AddResponseForm from './AddResponseModal';
import { SuccessModal } from '@/components/common/SuccessModal';

const SupportTicketDetail: React.FC = () => {
  const { id: ticketId } = useParams();
  const navigate = useNavigate();
  const { tickets, loading, error, fetchTickets } = useSupportTicketListStore();
  const ticket = tickets.find(t => t.ticketNumber === ticketId);
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!tickets.length && !loading) {
      fetchTickets();
    }
  }, [tickets.length, loading, fetchTickets]);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading ticket...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-lg text-red-600">{error}</div>;
  }
  if (!ticket) {
    return <div className="p-8 text-center text-lg">Ticket not found.</div>;
  }

  // Conversation: first message is the ticket's message
  const conversation = [
    {
      id: 1,
      sender: 'employee',
      name: ticket.businessName,
      message: ticket.message,
      icon: ticket.avatar || userIcon,
      time: ticket.postedAt,
    },
    {
      id: 2,
      sender: 'admin',
      name: 'Admin',
      message: 'Thank you for reaching out. Can you please share a screenshot of the error?',
      icon: headphoneIcon,
      time: '10:02 AM',
    },
    {
      id: 3,
      sender: 'employee',
      name: ticket.businessName,
      message: 'Sure, attaching the screenshot here.',
      icon: ticket.avatar || userIcon,
      time: '10:03 AM',
      attachment: userIcon, // just for demo
    },
    {
      id: 4,
      sender: 'admin',
      name: 'Admin',
      message: 'Received. We are looking into this and will update you soon.',
      icon: headphoneIcon,
      time: '10:05 AM',
    },
  ];

  const handleAddResponse = () => setShowAddResponse(true);
  const handleCloseAddResponse = () => setShowAddResponse(false);
  const handleSubmitResponse = (data: { message: string; images: File[] }) => {
    // For now, just log the data
    console.log('Submitted response:', data);
    setShowAddResponse(false);
    setShowSuccess(true);
  };

  const handleSuccessButton = () => {
    setShowSuccess(false);
    navigate('/settings/tickets');
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white">
      {showAddResponse ? (
        <div className="max-w-2xl mx-auto">
          {/* Only the Add Response header and form, no ticket summary or other header */}
          <AddResponseForm
            onClose={handleCloseAddResponse}
            onSubmit={handleSubmitResponse}
            ticketId={ticket.ticketNumber}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-[#00000099] font-bold text-[32px]">Support Ticket &gt;</span>
            <span className="text-black font-bold text-[32px]">All Ticket</span>
          </div>
          {/* Ticket Summary */}
          <div className="rounded-2xl bg-[#F8EAEE] p-8 flex flex-col md:flex-row md:justify-between mb-8">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="font-bold">Requestor</span>
                <span className="font-bold">{ticket.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Subject</span>
                <span className="font-bold">{ticket.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Created on</span>
                <span className="font-bold">{ticket.postedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Ticket ID</span>
                <span className="font-bold">{ticket.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Ticket Status</span>
                <span className="font-bold text-[#F8A534]">{ticket.status === 'ongoing' ? 'Ongoing' : ticket.status === 'resolved' ? 'Resolved' : 'All'}</span>
              </div>
            </div>
          </div>
          {/* Conversation */}
          <div className="flex flex-col gap-6">
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`w-full rounded-xl border ${msg.sender === 'admin' ? 'bg-[#F8EAEE]' : 'bg-white'} p-4 flex flex-col gap-2 shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === 'admin' && (
                    <img src={msg.icon} alt="icon" className="w-5 h-5" />
                  )}
                  <span className="font-bold text-base">{msg.name}</span>
                </div>
                <div className="text-black font-normal text-base">
                  {msg.message}
                </div>
                <div className="mt-2">
                  <img src={userIcon} alt="attachment" className="w-8 h-8 rounded bg-[#E5E5E5]" />
                </div>
              </div>
            ))}
          </div>
          {/* Add Response Button */}
          <div className="flex justify-center mt-10">
            <button
              className="px-12 py-2 rounded-lg font-semibold text-white text-lg bg-gradient-to-r from-[#D32F2F] to-[#6A1B9A] shadow"
              onClick={handleAddResponse}
            >
              Add Response
            </button>
          </div>
        </>
      )}
      <SuccessModal
        open={showSuccess}
        title="Ticket Response Added Successful !"
        subtitle="Your Dish ahs been created and will be updated in the menu in couple of minutes"
        buttonText="View All Tickets"
        onButtonClick={handleSuccessButton}
      />
    </div>
  );
};

export default SupportTicketDetail;  
 