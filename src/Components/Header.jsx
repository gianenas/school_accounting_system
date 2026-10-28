import React, { useState, useEffect } from 'react';

export default function Header({
  activeTab,
  currentUser,
  isCollapsed,
  setIsCollapsed,
  onLogout,
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const titleMap = {
    dashboard: 'Dashboard Overview',
    home: 'Campus Home & Updates',
    calendar: 'Dynamic Academic & Slot Calendar',
    slots: 'Slot Reservation & Department Selection',
    queue: 'My Generated Queue Ticket',
    balance: 'Certificate of Matriculation & Balance',
    profile: 'Student Information Profile',
    'dept-queue': 'Department Live Queue Desk',
    'dept-slots': 'Hourly Slot Capacity Management',
    'dept-services': 'Service & Department Availability',
    'balance-records': 'Student Matriculation Ledger',
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'System Administrator', bg: 'bg-purple-100 text-purple-900 border-purple-200', icon: 'bi-shield-check' };
      case 'accounting':
        return { label: 'Accounting Staff', bg: 'bg-blue-100 text-blue-900 border-blue-200', icon: 'bi-file-earmark-text' };
      case 'cashier':
        return { label: 'Cashier Staff', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200', icon: 'bi-cash-coin' };
      default:
        return { label: 'Student Portal', bg: 'bg-amber-100 text-amber-900 border-amber-200', icon: 'bi-mortarboard' };
    }
  };

  const roleBadge = getRoleBadge(currentUser?.role);

  return (
    <header className="bg-white border-b border-slate-200/80 shadow-xs flex flex-col shrink-0 select-none z-10">
      {/* Top Brand Banner: Refined Midnight Navy Palette */}
      <div className="flex items-stretch bg-gradient-to-r from-slate-900 via-[#002244] to-[#0f3460] text-white">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-14 h-14 bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer shrink-0 border-r border-white/10"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i className="bi bi-list text-2xl"></i>
        </button>

        {/* Institution Brand */}
        <div className="flex-1 flex items-center justify-between px-4 sm:px-6 py-2 overflow-hidden">
          <div className="flex items-center gap-3">
            {/* Round CDI Logo */}
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center overflow-hidden border border-white/80 ring-2 ring-white/20">
              <img
                src="/logo.png"
                alt="CDI Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide uppercase leading-tight text-white font-sans drop-shadow-xs">
                Computer Communication Development Institute
              </h1>
              <p className="text-[10px] sm:text-[11px] text-blue-200/90 font-medium tracking-normal">
                School Accounting & Cashier Slot Management System
              </p>
            </div>
          </div>

          {/* Right Section: Live Date & Clock + Quick Sign Out */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="font-semibold text-white text-xs flex items-center gap-1.5 justify-end">
                <i className="bi bi-calendar3 text-blue-300 text-[11px]"></i>
                <span>
                  {currentDateTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="text-[10px] text-blue-300/80 font-mono">
                {currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="py-1.5 px-3 bg-white/10 hover:bg-rose-600/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/20"
              title="Sign Out of Portal"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb & User Identity Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between bg-slate-50/90 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Portal /</span>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-800">
            {titleMap[activeTab] || 'Dashboard'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Badge (Students only see Student Portal; no role switcher!) */}
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 shadow-2xs ${roleBadge.bg}`}
          >
            <i className={`bi ${roleBadge.icon}`}></i>
            <span>{roleBadge.label}</span>
          </span>

          {/* Current Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser?.fullName?.charAt(0) || 'U'
              )}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900">{currentUser?.fullName}</div>
              <div className="text-[10px] text-slate-500 font-mono">{currentUser?.studentNum}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
