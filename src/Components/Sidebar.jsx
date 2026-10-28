import React, { useState } from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  currentUser,
  onLogout,
  queueCount,
}) {
  const [servicesExpanded, setServicesExpanded] = useState(true);

  // Student Navigation: strictly restricted to student capabilities!
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'home', label: 'Campus Home', icon: 'bi-house-door' },
    { id: 'calendar', label: 'Academic Calendar', icon: 'bi-calendar3' },
    {
      id: 'student-services-group',
      label: 'Student Services',
      icon: 'bi-mortarboard',
      isGroup: true,
      children: [
        { id: 'slots', label: 'Slot Reservation', icon: 'bi-calendar-check' },
        { id: 'queue', label: 'My Queue Slip', icon: 'bi-ticket-perforated', badge: queueCount > 0 ? queueCount : null },
        { id: 'balance', label: 'Balance Inquiry', icon: 'bi-receipt' },
        { id: 'profile', label: 'Student Profile', icon: 'bi-person-badge' },
      ],
    },
  ];

  // Staff and Admin Navigation: only rendered when user is verified staff/admin!
  const staffNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'home', label: 'Campus Home', icon: 'bi-house-door' },
    { id: 'calendar', label: 'Calendar Overview', icon: 'bi-calendar3' },
    {
      id: 'staff-controls-group',
      label: currentUser?.role === 'admin' ? 'Administration' : `${currentUser?.department} Desk`,
      icon: 'bi-shield-check',
      isGroup: true,
      children: [
        { id: 'dept-queue', label: 'Live Queue Desk', icon: 'bi-person-lines-fill', badge: queueCount > 0 ? queueCount : null },
        { id: 'dept-slots', label: 'Slot Limits & Hours', icon: 'bi-sliders2' },
        { id: 'dept-services', label: 'Service Availability', icon: 'bi-toggle-on' },
        ...(currentUser?.role === 'cashier' || currentUser?.role === 'admin'
          ? [{ id: 'balance-records', label: 'Student Balances', icon: 'bi-cash-coin' }]
          : []),
      ],
    },
  ];

  // Pick the strict navigation set according to role
  const isStudent = currentUser?.role === 'student';
  const navList = isStudent ? studentNavItems : staffNavItems;

  return (
    <aside
      className={`bg-slate-950 text-white flex flex-col justify-between shrink-0 transition-all duration-300 relative select-none z-20 border-r border-slate-800 ${
        isCollapsed ? 'w-16' : 'w-64'
      } shadow-2xl`}
    >
      <div className="flex flex-col">
        {/* Collapsed Mode Hamburger Header */}
        {isCollapsed && (
          <div className="h-14 flex items-center justify-center border-b border-slate-800">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition cursor-pointer"
              title="Expand Sidebar"
            >
              <i className="bi bi-list text-2xl"></i>
            </button>
          </div>
        )}

        {/* Sidebar Brand Title in Expanded Mode */}
        {!isCollapsed && (
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <i className={`bi ${isStudent ? 'bi-mortarboard' : 'bi-shield-lock'} text-base font-bold`}></i>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400 block">
                {isStudent ? 'Student Workspace' : 'Official Department'}
              </span>
              <span className="text-xs font-black text-slate-100 block">
                {isStudent ? 'CCDI Student Portal' : `${currentUser?.department || 'Admin'} Console`}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navList.map((item) => {
            if (item.isGroup) {
              if (isCollapsed) {
                return (
                  <div key={item.id} className="pt-2 mt-2 border-t border-slate-800 space-y-1">
                    {item.children.map((child) => (
                      <div key={child.id} className="relative group flex justify-center">
                        <button
                          onClick={() => setActiveTab(child.id)}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl transition cursor-pointer relative ${
                            activeTab === child.id
                              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                          }`}
                        >
                          <i className={`bi ${child.icon} text-lg`}></i>
                          {child.badge && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                          )}
                        </button>
                        {/* Hover Tooltip */}
                        <div className="absolute left-14 top-2 hidden group-hover:block bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-700 z-50">
                          {child.label}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              // Expanded Group View
              return (
                <div key={item.id} className="pt-2">
                  <button
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2.5">
                      <i className={`bi ${item.icon} text-sm text-blue-400`}></i>
                      <span>{item.label}</span>
                    </div>
                    <i
                      className={`bi bi-chevron-down text-[10px] transition-transform duration-200 ${
                        servicesExpanded ? 'rotate-180' : ''
                      }`}
                    ></i>
                  </button>

                  {servicesExpanded && (
                    <div className="mt-1 space-y-0.5 pl-2">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setActiveTab(child.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
                            activeTab === child.id
                              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                              : 'text-slate-300 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <i className={`bi ${child.icon} text-sm`}></i>
                            <span>{child.label}</span>
                          </div>
                          {child.badge && (
                            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Standalone Navigation Items (Dashboard, Home, Calendar)
            if (isCollapsed) {
              return (
                <div key={item.id} className="relative group flex justify-center py-0.5">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <i className={`bi ${item.icon} text-lg`}></i>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute left-14 top-2 hidden group-hover:block bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-700 z-50">
                    {item.label}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <i className={`bi ${item.icon} text-base`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active Status & Universal Accessibility Bar */}
      <div className="flex flex-col border-t border-slate-800">
        {/* User Card when expanded */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-slate-900/60 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Account Role</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                isStudent ? 'bg-amber-400/20 text-amber-300' : 'bg-purple-400/20 text-purple-300'
              }`}>
                {currentUser?.role}
              </span>
            </div>
            <div className="text-slate-200 font-bold truncate mt-1">{currentUser?.fullName}</div>
          </div>
        )}

        {/* Accessibility Button */}
        <div
          className={`bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center cursor-pointer transition py-2.5 ${
            isCollapsed ? 'px-2' : 'px-4 gap-2.5'
          }`}
          title="Universal Accessibility Tools"
        >
          <div className="w-7 h-7 rounded-full bg-slate-950 text-cyan-400 flex items-center justify-center shrink-0">
            <i className="bi bi-person-arms-up text-sm font-bold"></i>
          </div>
          {!isCollapsed && (
            <div className="text-left leading-tight text-xs font-black">
              <span className="block text-[11px] uppercase tracking-wider">Accessibility</span>
              <span className="text-[9px] font-semibold text-slate-900 opacity-90">Support & Reader</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
