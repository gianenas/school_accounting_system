import React, { useState } from 'react';
import LoginSection from './Components/LoginSection';
import SignUpSection from './Components/SignUpSection';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import SlotManagementSection from './Components/SlotManagementSection';
import BalanceInquirySection from './Components/BalanceInquirySection';
import QueueTicketModal from './Components/QueueTicketModal';
import QueueMonitor from './Components/QueueMonitor';
import DepartmentManagementSection from './Components/DepartmentManagementSection';

import { initialAccounts } from './data/accountsData';
import { initialSystemConfig } from './data/systemConfig';
import { initialPaymentTerms } from './data/matriculationData';
import './App.css';

export default function App() {
  const [accounts, setAccounts] = useState(initialAccounts);
  // Default to null so user arrives at the clean, secure authentication portal
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [authAlert, setAuthAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sidebar state: collapsible with smooth transition
  const [isCollapsed, setIsCollapsed] = useState(false);

  // System configuration & limits (default limit: 30 students per hour)
  const [systemConfig, setSystemConfig] = useState(initialSystemConfig);

  // Student balance & payment terms
  const [paymentTerms, setPaymentTerms] = useState(initialPaymentTerms);

  // Queue system state
  const [queueList, setQueueList] = useState([
    {
      id: 'TKT-20261028-01',
      queueNumber: 'ACC-001',
      department: 'Accounting',
      serviceId: 'exam-permit',
      serviceName: 'Examination Permit',
      studentNum: '2026-0089',
      studentName: 'Juan Carlos Dela Torre',
      course: 'BS Computer Science - 2nd Year',
      date: '2026-10-28',
      formattedDate: 'Wed, Oct 28, 2026',
      timeSlot: '8:00 AM - 9:00 AM',
      status: 'Serving',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'TKT-20261028-02',
      queueNumber: 'ACC-002',
      department: 'Accounting',
      serviceId: 'uniform-fabric',
      serviceName: 'Uniform Fabric Request',
      studentNum: '2026-0142',
      studentName: 'Maria Angelica Santos',
      course: 'BS Information Technology - 1st Year',
      date: '2026-10-28',
      formattedDate: 'Wed, Oct 28, 2026',
      timeSlot: '9:00 AM - 10:00 AM',
      status: 'Waiting',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'TKT-20261028-03',
      queueNumber: 'CSH-001',
      department: 'Cashier',
      serviceId: 'tuition-payment',
      serviceName: 'Tuition & Fees Payment',
      studentNum: '2026-0055',
      studentName: 'Christian Mendoza',
      course: 'BS Information Systems - 4th Year',
      date: '2026-10-28',
      formattedDate: 'Wed, Oct 28, 2026',
      timeSlot: '9:00 AM - 10:00 AM',
      status: 'Serving',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'TKT-20261028-04',
      queueNumber: 'CSH-002',
      department: 'Cashier',
      serviceId: 'promissory-note',
      serviceName: 'Promissory Note Processing',
      studentNum: '2026-0219',
      studentName: 'Alyssa Jane Ramos',
      course: 'Associate in Computer Tech - 2nd Year',
      date: '2026-10-28',
      formattedDate: 'Wed, Oct 28, 2026',
      timeSlot: '10:00 AM - 11:00 AM',
      status: 'Waiting',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Active modal for viewing/printing queue ticket
  const [activeTicketModal, setActiveTicketModal] = useState(null);

  // Outstanding balance calculation
  const outstandingBalance = paymentTerms
    .filter((pt) => pt.status !== 'Paid')
    .reduce((sum, pt) => sum + pt.amount, 0);
  const isFullyPaid = outstandingBalance === 0;

  // Student active queue ticket
  const studentActiveTicket = queueList.find(
    (q) => q.studentNum === currentUser?.studentNum && q.status !== 'Completed' && q.status !== 'Cancelled'
  );

  // 1. STUDENT LOGIN (Strictly student accounts only!)
  const handleStudentLogin = ({ studentNum, password, captchaInput, expectedCaptcha }, resetCaptcha) => {
    if (captchaInput.toUpperCase() !== expectedCaptcha.toUpperCase()) {
      setAuthAlert({ type: 'danger', message: 'Invalid CAPTCHA security code. Please try again.' });
      resetCaptcha();
      return;
    }

    const cleanInput = studentNum.trim().toLowerCase();

    // Check if user is attempting to access staff/admin accounts from the student portal
    if (['admin', 'accounting', 'cashier'].includes(cleanInput)) {
      setAuthAlert({
        type: 'danger',
        message: 'Access Restricted: Administrative accounts cannot be accessed from the Student Portal. Please switch to the Staff & Admin gateway.',
      });
      resetCaptcha();
      return;
    }

    const foundUser = Object.values(accounts).find(
      (acc) =>
        acc.role === 'student' &&
        (acc.studentNum.toLowerCase() === cleanInput || acc.username.toLowerCase() === cleanInput)
    );

    if (!foundUser) {
      setAuthAlert({
        type: 'info',
        message: 'Student account not found. Please register your profile or check your Student Number.',
      });
      return;
    }

    if (foundUser.password !== password) {
      setAuthAlert({
        type: 'danger',
        message: 'Incorrect password! Please check your credentials.',
      });
      resetCaptcha();
      return;
    }

    setCurrentUser(foundUser);
    setAuthAlert(null);
    setActiveTab('dashboard');
  };

  // 2. STAFF & ADMIN LOGIN (Strictly staff and admin accounts only!)
  const handleStaffLogin = ({ username, password, captchaInput, expectedCaptcha }, resetCaptcha) => {
    if (captchaInput.toUpperCase() !== expectedCaptcha.toUpperCase()) {
      setAuthAlert({ type: 'danger', message: 'Invalid CAPTCHA security code. Please try again.' });
      resetCaptcha();
      return;
    }

    const cleanInput = username.trim().toLowerCase();

    const foundStaff = Object.values(accounts).find(
      (acc) =>
        acc.role !== 'student' &&
        (acc.username.toLowerCase() === cleanInput || acc.studentNum.toLowerCase() === cleanInput)
    );

    if (!foundStaff) {
      setAuthAlert({
        type: 'danger',
        message: 'Access Denied: Student accounts and unauthorized IDs do not have permission to access the Staff & Administration Gateway.',
      });
      resetCaptcha();
      return;
    }

    if (foundStaff.password !== password) {
      setAuthAlert({
        type: 'danger',
        message: 'Incorrect administrative credentials. Security audit logged.',
      });
      resetCaptcha();
      return;
    }

    setCurrentUser(foundStaff);
    setAuthAlert(null);
    setActiveTab('dashboard');
  };

  // Student Self-Registration Handler
  const handleRegisterSubmit = (data) => {
    setAccounts((prev) => ({
      ...prev,
      [data.studentNum]: {
        ...data,
        avatar: null,
      },
    }));
    setAuthAlert({
      type: 'success',
      message: 'Student account created successfully! You can now sign in below.',
    });
    setTimeout(() => {
      setAuthView('login');
      setAuthAlert(null);
    }, 1200);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCurrentUser((prev) => ({ ...prev, avatar: evt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Queue Generation Handler
  const handleGenerateQueueTicket = ({ department, serviceId, serviceName, date, formattedDate, timeSlot, studentNum, studentName, course }) => {
    const deptPrefix = department === 'Accounting' ? 'ACC' : 'CSH';
    const deptTicketsToday = queueList.filter((q) => q.department === department);
    const nextSeqNum = deptTicketsToday.length + 1;
    const formattedSeq = String(nextSeqNum).padStart(3, '0');
    const queueNumber = `${deptPrefix}-${formattedSeq}`;

    const newTicket = {
      id: `TKT-${Date.now()}`,
      queueNumber,
      department,
      serviceId,
      serviceName,
      studentNum,
      studentName,
      course,
      date,
      formattedDate,
      timeSlot,
      status: 'Waiting',
      createdAt: new Date().toISOString(),
    };

    setQueueList((prev) => [newTicket, ...prev]);
    setActiveTicketModal(newTicket);
  };

  // Queue Desk Staff Handlers
  const handleCallNext = (department) => {
    // Only authorized staff can call next
    if (currentUser?.role === 'student') return;
    if (currentUser?.role === 'accounting' && department !== 'Accounting') return;
    if (currentUser?.role === 'cashier' && department !== 'Cashier') return;

    setQueueList((prev) => {
      const updated = prev.map((q) => {
        if (q.department === department && q.status === 'Serving') {
          return { ...q, status: 'Completed' };
        }
        return q;
      });

      let called = false;
      return updated.map((q) => {
        if (!called && q.department === department && q.status === 'Waiting') {
          called = true;
          return { ...q, status: 'Serving' };
        }
        return q;
      });
    });
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    if (currentUser?.role === 'student') return;
    setQueueList((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  // Department Configuration Handlers
  const handleUpdateLimit = (deptName, newLimit) => {
    if (currentUser?.role === 'student') return;
    if (currentUser?.role === 'accounting' && deptName !== 'Accounting') return;
    if (currentUser?.role === 'cashier' && deptName !== 'Cashier') return;

    setSystemConfig((prev) => ({
      ...prev,
      limits: {
        ...prev.limits,
        [deptName]: newLimit,
      },
    }));
  };

  const handleToggleDepartment = (deptName) => {
    if (currentUser?.role === 'student') return;
    if (currentUser?.role === 'accounting' && deptName !== 'Accounting') return;
    if (currentUser?.role === 'cashier' && deptName !== 'Cashier') return;

    setSystemConfig((prev) => ({
      ...prev,
      departments: {
        ...prev.departments,
        [deptName]: {
          ...prev.departments[deptName],
          available: !prev.departments[deptName].available,
        },
      },
    }));
  };

  const handleToggleService = (serviceId) => {
    if (currentUser?.role === 'student') return;
    const targetDept = systemConfig.services[serviceId]?.department;
    if (currentUser?.role === 'accounting' && targetDept !== 'Accounting') return;
    if (currentUser?.role === 'cashier' && targetDept !== 'Cashier') return;

    setSystemConfig((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: {
          ...prev.services[serviceId],
          available: !prev.services[serviceId].available,
        },
      },
    }));
  };

  // Payment Settlement Simulation
  const handlePayInstallment = () => {
    setPaymentTerms((prev) => {
      const firstUnpaidIndex = prev.findIndex((pt) => pt.status !== 'Paid');
      if (firstUnpaidIndex === -1) return prev;
      const copy = [...prev];
      copy[firstUnpaidIndex] = {
        ...copy[firstUnpaidIndex],
        status: 'Paid',
        receiptNo: `OR-${Math.floor(10000 + Math.random() * 90000)}`,
        datePaid: new Date().toISOString().split('T')[0],
      };
      return copy;
    });
  };

  const handlePayAll = () => {
    setPaymentTerms((prev) =>
      prev.map((pt) => ({
        ...pt,
        status: 'Paid',
        receiptNo: pt.receiptNo || `OR-${Math.floor(10000 + Math.random() * 90000)}`,
        datePaid: pt.datePaid || new Date().toISOString().split('T')[0],
      }))
    );
  };

  const handleResetBalance = () => {
    setPaymentTerms(initialPaymentTerms);
  };

  // Security Guard: Check if a student attempts to view staff-only tabs
  const isStudent = currentUser?.role === 'student';
  const staffOnlyTabs = ['dept-queue', 'dept-slots', 'dept-services', 'balance-records'];
  const isForbiddenForStudent = isStudent && staffOnlyTabs.includes(activeTab);

  // RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-[#0a192f] to-[#00172d] p-4 font-sans">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 sm:p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-xl p-1.5 border-2 border-blue-900 mb-3 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="CDI Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight font-sans">
              Computer Communication Development Institute
            </h2>
            <p className="text-xs text-blue-700 font-extrabold mt-0.5 tracking-wide uppercase">
              School Accounting & Cashier Slot System
            </p>
          </div>

          {authView === 'login' && (
            <LoginSection
              onStudentLogin={handleStudentLogin}
              onStaffLogin={handleStaffLogin}
              onSwitchToSignup={() => {
                setAuthAlert(null);
                setAuthView('signup');
              }}
              onSwitchToForgot={() => {
                setAuthAlert({
                  type: 'info',
                  message: 'For password assistance, please visit the Accounting or Cashier Office with your valid Student ID.',
                });
              }}
              authAlert={authAlert}
            />
          )}

          {authView === 'signup' && (
            <SignUpSection
              onRegisterSubmit={handleRegisterSubmit}
              onSwitchToLogin={() => {
                setAuthAlert(null);
                setAuthView('login');
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // RENDER AUTHENTICATED PORTAL
  return (
    <div className="h-screen flex overflow-hidden bg-slate-100 font-sans">
      {/* SIDEBAR: Student only sees student items; Staff sees staff items */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        queueCount={queueList.filter((q) => q.status === 'Waiting').length}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* HEADER: No role switcher for students */}
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onLogout={() => setCurrentUser(null)}
        />

        {/* SECURITY RESTRICTION: Block students from staff tabs */}
        {isForbiddenForStudent ? (
          <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl">
              <i className="bi bi-shield-x"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900">403 - Administrative Access Restricted</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Student accounts are not authorized to view or manage department queues, hourly capacities, or administrative settings.
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
            >
              Return to Student Dashboard
            </button>
          </div>
        ) : (
          /* REGULAR VIEW CONTAINER */
          <div className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Modern Hero Welcome Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-[#0b2545] to-[#133b5c] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center p-2 border border-white/20 shadow-inner">
                      <img src="/logo.png" alt="CDI" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                          {isStudent ? 'Official Student Portal' : `${currentUser.department} Department Console`}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                        Welcome, {currentUser.fullName}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1">
                        {isStudent
                          ? `${currentUser.course || 'BS Information Technology'} • Student ID: ${currentUser.studentNum}`
                          : `${currentUser.email} • Official Staff Account`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isStudent ? (
                      <button
                        onClick={() => setActiveTab('slots')}
                        className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <i className="bi bi-calendar-plus-fill text-sm"></i>
                        <span>Reserve Department Slot</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('dept-queue')}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/20"
                      >
                        <i className="bi bi-megaphone-fill text-sm"></i>
                        <span>Open Live Queue Desk</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. OUTSTANDING BALANCE CARD (Requirement: Red if unpaid, Green if fully paid) */}
                  <div
                    className={`p-5 rounded-3xl border transition-all shadow-xs ${
                      isFullyPaid
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-300 ring-1 ring-emerald-400/20'
                        : 'bg-gradient-to-br from-rose-50 to-red-50/70 border-rose-300 ring-1 ring-rose-400/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        Matriculation Balance
                      </span>
                      <span
                        className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          isFullyPaid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                        }`}
                      >
                        {isFullyPaid ? 'Fully Paid' : 'Unpaid'}
                      </span>
                    </div>

                    {/* Dynamic Color Amount */}
                    <div
                      className={`text-2xl sm:text-3xl font-black mt-2 tracking-tight ${
                        isFullyPaid ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      ₱{outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>

                    <button
                      onClick={() => setActiveTab('balance')}
                      className={`mt-3 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer ${
                        isFullyPaid ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      <span>View Matriculation Form</span>
                      <i className="bi bi-arrow-right text-[10px]"></i>
                    </button>
                  </div>

                  {/* 2. EXAMINATION PERMIT STATUS */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Permit Clearance
                      </span>
                      <span
                        className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          systemConfig.services['exam-permit'].available
                            ? isFullyPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {systemConfig.services['exam-permit'].available
                          ? isFullyPaid
                            ? 'Cleared'
                            : 'Pending Balance'
                          : 'Closed'}
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-2">
                      {systemConfig.services['exam-permit'].available
                        ? isFullyPaid
                          ? 'Eligible for Permit'
                          : 'Clearance Required'
                        : 'Issuance Closed'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 font-medium">
                      Accounting Department
                    </div>
                  </div>

                  {/* 3. PROMISSORY NOTE ELIGIBILITY */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Promissory Note
                      </span>
                      <span
                        className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          systemConfig.services['promissory-note'].available
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {systemConfig.services['promissory-note'].available ? 'Window Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-2">
                      {systemConfig.services['promissory-note'].available ? 'Available' : 'Unavailable'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 font-medium">
                      Cashier Department
                    </div>
                  </div>

                  {/* 4. ACTIVE QUEUE PRIORITY NUMBER */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        My Queue Slip
                      </span>
                      {studentActiveTicket && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                          {studentActiveTicket.status}
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-black text-blue-700 mt-2 font-mono">
                      {studentActiveTicket ? studentActiveTicket.queueNumber : 'No Active Slip'}
                    </div>
                    {studentActiveTicket ? (
                      <button
                        onClick={() => setActiveTicketModal(studentActiveTicket)}
                        className="mt-3 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Official Slip</span>
                        <i className="bi bi-ticket-perforated"></i>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('slots')}
                        className="mt-3 text-xs font-bold text-slate-500 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book an appointment</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* LIVE QUEUE DISPLAY TICKER */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        Real-Time Counter Queuing Status
                      </h3>
                    </div>
                    {!isStudent && (
                      <button
                        onClick={() => setActiveTab('dept-queue')}
                        className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        Open Full Staff Queue Monitor <i className="bi bi-chevron-right text-[10px]"></i>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Accounting Live Counter */}
                    <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider block">
                          Accounting Department
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block font-mono">
                          Now Serving:{' '}
                          <span className="text-blue-700">
                            {queueList.find((q) => q.department === 'Accounting' && q.status === 'Serving')?.queueNumber || '---'}
                          </span>
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Waiting in queue: <strong>{queueList.filter((q) => q.department === 'Accounting' && q.status === 'Waiting').length}</strong> students
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl shadow-inner">
                        <i className="bi bi-file-earmark-text"></i>
                      </div>
                    </div>

                    {/* Cashier Live Counter */}
                    <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block">
                          Cashier Department
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block font-mono">
                          Now Serving:{' '}
                          <span className="text-emerald-600">
                            {queueList.find((q) => q.department === 'Cashier' && q.status === 'Serving')?.queueNumber || '---'}
                          </span>
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Waiting in queue: <strong>{queueList.filter((q) => q.department === 'Cashier' && q.status === 'Waiting').length}</strong> students
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
                        <i className="bi bi-cash-stack"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SITE HOME TAB */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
                      <i className="bi bi-buildings"></i>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Campus Notices & Department Policies</h3>
                      <p className="text-xs text-slate-500">Official guidelines from Accounting and Cashier Offices</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[10px] font-black text-blue-800 uppercase bg-blue-100 px-2 py-0.5 rounded-full">
                        Accounting Policy
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Examination Permit Booking Protocol</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Students must ensure their tuition accounts have no unsettled prior term holds or have submitted an authorized promissory note before booking an examination permit slot.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <span className="text-[10px] font-black text-emerald-900 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                        Capacity Control
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Strict 30 Students Limit Per Hour</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        To maintain orderly counter service and comfort, each hourly window is strictly capped at a maximum of 30 students. Once filled, subsequent students are routed to adjacent available slots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CALENDAR & SLOT MANAGEMENT TABS */}
            {(activeTab === 'slots' || activeTab === 'calendar') && (
              <SlotManagementSection
                systemConfig={systemConfig}
                currentUser={currentUser}
                queueList={queueList}
                onGenerateQueueTicket={handleGenerateQueueTicket}
              />
            )}

            {/* MY QUEUE SLIP TAB */}
            {activeTab === 'queue' && (
              <div className="space-y-6">
                {studentActiveTicket ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-lg mx-auto text-center space-y-5">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-3xl shadow-inner">
                      <i className="bi bi-ticket-perforated"></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Active Queue Priority Number
                      </span>
                      <div className="text-5xl font-black text-blue-700 my-2 font-mono tracking-tight">
                        {studentActiveTicket.queueNumber}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Status: {studentActiveTicket.status}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Department:</span>
                        <strong className="text-slate-900">{studentActiveTicket.department} Department</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Service:</span>
                        <strong className="text-slate-900">{studentActiveTicket.serviceName}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Appointment Date:</span>
                        <strong className="text-slate-900">{studentActiveTicket.formattedDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hourly Window:</span>
                        <strong className="text-blue-700 font-bold">{studentActiveTicket.timeSlot}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={() => setActiveTicketModal(studentActiveTicket)}
                        className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
                      >
                        <i className="bi bi-printer mr-1.5"></i> Print Official Voucher
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
                    <i className="bi bi-ticket-detailed text-4xl mb-2 block text-slate-300"></i>
                    <h4 className="font-bold text-slate-800 text-sm">No Active Queue Ticket</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      You do not have a booked appointment slot. Select a department first to unlock the dynamic calendar and reserve a time slot.
                    </p>
                    <button
                      onClick={() => setActiveTab('slots')}
                      className="mt-4 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md hover:bg-blue-800"
                    >
                      Reserve a Slot Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* BALANCE INQUIRY TAB */}
            {activeTab === 'balance' && (
              <BalanceInquirySection
                currentUser={currentUser}
                paymentTerms={paymentTerms}
                onPayInstallment={handlePayInstallment}
                onPayAll={handlePayAll}
                onResetBalance={handleResetBalance}
              />
            )}

            {/* LIVE QUEUE DESK TAB (Staff / Admin Only) */}
            {activeTab === 'dept-queue' && !isStudent && (
              <QueueMonitor
                queueList={queueList}
                currentUser={currentUser}
                onCallNext={handleCallNext}
                onUpdateStatus={handleUpdateTicketStatus}
                onViewTicket={(ticket) => setActiveTicketModal(ticket)}
              />
            )}

            {/* DEPARTMENT SLOTS & CAPACITY MANAGEMENT TAB (Staff / Admin Only) */}
            {(activeTab === 'dept-slots' || activeTab === 'dept-services') && !isStudent && (
              <DepartmentManagementSection
                currentUser={currentUser}
                systemConfig={systemConfig}
                onUpdateLimit={handleUpdateLimit}
                onToggleDepartment={handleToggleDepartment}
                onToggleService={handleToggleService}
              />
            )}

            {/* STUDENT BALANCE RECORDS TAB (Cashier / Admin Only) */}
            {activeTab === 'balance-records' && !isStudent && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Cashier Student Ledger Management</h3>
                    <p className="text-xs text-slate-500">Direct receipt issuance and balance auditing</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePayInstallment}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <i className="bi bi-cash"></i> Settle Next Installment
                    </button>
                    <button
                      onClick={handleResetBalance}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Reset Ledger Demo
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Target Student:</span>{' '}
                    <strong className="text-slate-900">{currentUser.fullName} ({currentUser.studentNum})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>{' '}
                    <span className={`font-bold px-2.5 py-0.5 rounded-full ${isFullyPaid ? 'text-emerald-800 bg-emerald-100' : 'text-rose-800 bg-rose-100'}`}>
                      {isFullyPaid ? 'FULLY PAID' : 'UNPAID'} (₱{outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider font-extrabold border-b border-slate-200">
                        <th className="py-3 px-3">Term</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Official Receipt</th>
                        <th className="py-3 px-3 text-right">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentTerms.map((pt) => (
                        <tr key={pt.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-semibold text-slate-800">{pt.term}</td>
                          <td className="py-3 px-3 font-mono font-medium">₱{pt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${pt.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {pt.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">{pt.receiptNo || '---'}</td>
                          <td className="py-3 px-3 text-right text-slate-500 font-mono">{pt.datePaid || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STUDENT PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 max-w-xl shadow-xs space-y-5">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center text-3xl font-black overflow-hidden shadow-inner">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{currentUser.fullName}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.studentNum}</p>
                    <label className="cursor-pointer mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition inline-block shadow-sm">
                      Upload Profile Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                    <input type="text" value={currentUser.fullName} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium" readOnly />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Student Number / Employee ID</label>
                    <input type="text" value={currentUser.studentNum} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono" readOnly />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Course & Year Level / Department</label>
                    <input type="text" value={currentUser.course || currentUser.department} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium" readOnly />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">System Security Role</label>
                    <input type="text" value={currentUser.role} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm capitalize font-bold text-blue-700" readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* QUEUE TICKET VOUCHER MODAL */}
      {activeTicketModal && (
        <QueueTicketModal
          ticket={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
        />
      )}
    </div>
  );
}
