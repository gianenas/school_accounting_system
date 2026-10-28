import React, { useState } from 'react';

export default function QueueMonitor({
  queueList,
  currentUser,
  onCallNext,
  onUpdateStatus,
  onViewTicket,
}) {
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Currently serving
  const servingAccounting = queueList.find(
    (q) => q.department === 'Accounting' && q.status === 'Serving'
  );
  const nextAccounting = queueList.find(
    (q) => q.department === 'Accounting' && q.status === 'Waiting'
  );
  const waitingAccountingCount = queueList.filter(
    (q) => q.department === 'Accounting' && q.status === 'Waiting'
  ).length;

  const servingCashier = queueList.find(
    (q) => q.department === 'Cashier' && q.status === 'Serving'
  );
  const nextCashier = queueList.find(
    (q) => q.department === 'Cashier' && q.status === 'Waiting'
  );
  const waitingCashierCount = queueList.filter(
    (q) => q.department === 'Cashier' && q.status === 'Waiting'
  ).length;

  const filteredTickets = queueList.filter((ticket) => {
    const matchDept = filterDept === 'All' || ticket.department === filterDept;
    const matchStatus = filterStatus === 'All' || ticket.status === filterStatus;
    return matchDept && matchStatus;
  });

  const canManageAccounting =
    currentUser?.role === 'admin' || currentUser?.role === 'accounting';
  const canManageCashier =
    currentUser?.role === 'admin' || currentUser?.role === 'cashier';

  return (
    <div className="space-y-6">
      {/* Live Counter Display Boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounting Department Board */}
        <div className="bg-white rounded-3xl border border-blue-200/80 shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                <i className="bi bi-file-earmark-text"></i>
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Accounting Department</h3>
                <p className="text-[11px] text-blue-200 font-medium">Permits, Clearances & Uniforms</p>
              </div>
            </div>
            <span className="bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full">
              {waitingAccountingCount} Waiting
            </span>
          </div>

          <div className="p-6 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Now Serving
            </span>
            <div className="text-4xl sm:text-5xl font-black text-blue-700 my-2 tracking-tight font-mono">
              {servingAccounting ? servingAccounting.queueNumber : '---'}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {servingAccounting ? (
                <span>
                  Student: <strong className="text-slate-900">{servingAccounting.studentName}</strong> ({servingAccounting.serviceName})
                </span>
              ) : (
                'No student is currently being served at this counter'
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Next in Line: <strong className="text-slate-900 font-mono">{nextAccounting ? nextAccounting.queueNumber : 'None'}</strong>
              </span>
              {canManageAccounting && (
                <button
                  onClick={() => onCallNext('Accounting')}
                  disabled={!nextAccounting}
                  className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    nextAccounting
                      ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <i className="bi bi-megaphone-fill"></i> Call Next Number
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cashier Department Board */}
        <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Cashier Department</h3>
                <p className="text-[11px] text-emerald-200 font-medium">Payments & Promissory Notes</p>
              </div>
            </div>
            <span className="bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full">
              {waitingCashierCount} Waiting
            </span>
          </div>

          <div className="p-6 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Now Serving
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-700 my-2 tracking-tight font-mono">
              {servingCashier ? servingCashier.queueNumber : '---'}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {servingCashier ? (
                <span>
                  Student: <strong className="text-slate-900">{servingCashier.studentName}</strong> ({servingCashier.serviceName})
                </span>
              ) : (
                'No student is currently being served at this counter'
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Next in Line: <strong className="text-slate-900 font-mono">{nextCashier ? nextCashier.queueNumber : 'None'}</strong>
              </span>
              {canManageCashier && (
                <button
                  onClick={() => onCallNext('Cashier')}
                  disabled={!nextCashier}
                  className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    nextCashier
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <i className="bi bi-megaphone-fill"></i> Call Next Number
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Queue Tickets Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Queuing Department Master Desk</h3>
            <p className="text-xs text-slate-500">Live monitor of student arrivals, appointments, and processing stages</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 font-semibold focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Accounting">Accounting Only</option>
              <option value="Cashier">Cashier Only</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="Serving">Serving</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <i className="bi bi-inbox text-4xl mb-2 block"></i>
            <p className="text-xs">No queue tickets match the chosen criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">Queue No.</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => {
                  const canEditThis =
                    currentUser?.role === 'admin' ||
                    (currentUser?.role === 'accounting' && t.department === 'Accounting') ||
                    (currentUser?.role === 'cashier' && t.department === 'Cashier');

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-black text-slate-900 text-sm">
                        {t.queueNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{t.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{t.studentNum}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            t.department === 'Accounting'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {t.department}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{t.serviceName}</td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{t.formattedDate}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{t.timeSlot}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-block uppercase ${
                            t.status === 'Serving'
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : t.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => onViewTicket(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        >
                          <i className="bi bi-eye"></i> Slip
                        </button>
                        {canEditThis && t.status === 'Serving' && (
                          <button
                            onClick={() => onUpdateStatus(t.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                          >
                            <i className="bi bi-check-lg"></i> Complete
                          </button>
                        )}
                        {canEditThis && t.status === 'Waiting' && (
                          <button
                            onClick={() => onUpdateStatus(t.id, 'Serving')}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                          >
                            <i className="bi bi-play-fill"></i> Serve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
