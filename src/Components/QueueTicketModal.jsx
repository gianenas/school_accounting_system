import React from 'react';

export default function QueueTicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const isAccounting = ticket.department === 'Accounting';

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Ticket Header Banner */}
        <div
          className={`p-5 text-white text-center relative ${
            isAccounting
              ? 'bg-gradient-to-r from-blue-700 to-indigo-800'
              : 'bg-gradient-to-r from-emerald-700 to-teal-800'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-lg w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition cursor-pointer"
          >
            <i className="bi bi-x-lg text-sm font-bold"></i>
          </button>
          <div className="w-14 h-14 mx-auto rounded-full bg-white p-1 mb-2 shadow-md flex items-center justify-center border border-white/80">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="font-black text-sm tracking-wide uppercase">Computer Communication Development Institute</h3>
          <p className="text-[11px] text-white/90 font-medium">Official Appointment Priority Voucher</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 text-center space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Your Designated Queue Priority Number
            </span>
            <div
              className={`text-4xl sm:text-5xl font-black tracking-tight my-1.5 font-mono ${
                isAccounting ? 'text-blue-700' : 'text-emerald-700'
              }`}
            >
              {ticket.queueNumber}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Status: {ticket.status}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="font-extrabold text-slate-900">{ticket.department} Department</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Requested Service:</span>
              <span className="font-extrabold text-slate-900">{ticket.serviceName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Student Name:</span>
              <span className="font-extrabold text-slate-900">{ticket.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Student Number:</span>
              <span className="font-extrabold text-slate-900 font-mono">{ticket.studentNum}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Appointment Date:</span>
              <span className="font-extrabold text-slate-900">{ticket.formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Hourly Window:</span>
              <span className="font-extrabold text-blue-700">{ticket.timeSlot}</span>
            </div>
          </div>

          {/* Barcode Visualization */}
          <div className="py-2 flex flex-col items-center">
            <div className="h-10 w-60 flex items-center justify-between px-3 bg-white border border-slate-300 rounded-lg">
              {[4, 2, 6, 1, 5, 2, 7, 3, 2, 5, 2, 8, 3, 2, 6, 1, 4, 3, 5, 2, 6, 2, 4, 3, 5, 2, 4].map((h, i) => (
                <div key={i} className="bg-slate-900 w-1 rounded-xs" style={{ height: `${h * 3.5}px` }}></div>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest">{ticket.id}</span>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Please be seated near the designated department counter at least 10 minutes before your reserved hour.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <i className="bi bi-printer"></i> Print / Save Slip
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
