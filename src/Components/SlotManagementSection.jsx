import React, { useState } from 'react';

export default function SlotManagementSection({
  systemConfig,
  currentUser,
  queueList,
  onGenerateQueueTicket,
}) {
  const [selectedDept, setSelectedDept] = useState(null); // Department selection required first!
  const [selectedService, setSelectedService] = useState('');
  
  // Real-time Dynamic Calendar State synchronizing with current date
  const today = new Date();
  const [calDate, setCalDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const currentYear = calDate.getFullYear();
  const currentMonth = calDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCalDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleJumpToToday = () => {
    setCalDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  // Student limit per hour for the selected department (Requirement: 30)
  const hourlyLimit = selectedDept ? (systemConfig.limits[selectedDept] || 30) : 30;

  // Filter available services for chosen department
  const departmentServices = selectedDept
    ? Object.values(systemConfig.services).filter((s) => s.department === selectedDept)
    : [];

  const formattedSelectedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  
  const getSlotBookedCount = (timeString) => {
    return queueList.filter(
      (q) =>
        q.department === selectedDept &&
        q.date === formattedSelectedDate &&
        q.timeSlot === timeString &&
        q.status !== 'Cancelled'
    ).length;
  };

  // Submit and generate ticket
  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!selectedDept || !selectedService || !selectedDate || !selectedSlot) {
      return;
    }

    const serviceObj = systemConfig.services[selectedService];
    if (!serviceObj || !serviceObj.available) return;

    const bookedCount = getSlotBookedCount(selectedSlot.time);
    if (bookedCount >= hourlyLimit) return;

    onGenerateQueueTicket({
      department: selectedDept,
      serviceId: selectedService,
      serviceName: serviceObj.name,
      date: formattedSelectedDate,
      formattedDate: selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      timeSlot: selectedSlot.time,
      studentNum: currentUser?.studentNum || '2026-0001',
      studentName: currentUser?.fullName || 'Student',
      course: currentUser?.course || 'General Student',
    });

    setBookingSuccess(true);
    setSelectedSlot(null);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  const deptAccounting = systemConfig.departments.Accounting;
  const deptCashier = systemConfig.departments.Cashier;

  return (
    <div className="space-y-6">
      {/* STEP 1: Department Selection (Must be selected first before calendar and slots appear!) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                1
              </span>
              <h3 className="font-extrabold text-slate-900 text-base">Select Service Department</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select either the Accounting or Cashier department to view available schedules and time slots.
            </p>
          </div>

          {selectedDept && (
            <button
              onClick={() => {
                setSelectedDept(null);
                setSelectedService('');
                setSelectedSlot(null);
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-bold self-start sm:self-auto cursor-pointer flex items-center gap-1"
            >
              <i className="bi bi-arrow-repeat"></i> Change Department
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Accounting Department Card */}
          <div
            onClick={() => {
              if (deptAccounting.available) {
                setSelectedDept('Accounting');
                setSelectedService('');
                setSelectedSlot(null);
              }
            }}
            className={`p-6 rounded-3xl border-2 transition-all relative ${
              !deptAccounting.available
                ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 pointer-events-none'
                : selectedDept === 'Accounting'
                ? 'border-blue-700 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20 cursor-pointer'
                : 'border-slate-200 hover:border-blue-600 bg-white cursor-pointer shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-13 h-13 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl shadow-inner">
                <i className="bi bi-file-earmark-text"></i>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  deptAccounting.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {deptAccounting.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <h4 className="font-black text-slate-900 mt-4 text-base">Accounting Department</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Examination Permits, Account Clearance Audits, Uniform Fabric Requests
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <i className="bi bi-people-fill text-blue-600"></i> Max Limit: {systemConfig.limits.Accounting} Students/Hour
            </div>
          </div>

          {/* Cashier Department Card */}
          <div
            onClick={() => {
              if (deptCashier.available) {
                setSelectedDept('Cashier');
                setSelectedService('');
                setSelectedSlot(null);
              }
            }}
            className={`p-6 rounded-3xl border-2 transition-all relative ${
              !deptCashier.available
                ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 pointer-events-none'
                : selectedDept === 'Cashier'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20 cursor-pointer'
                : 'border-slate-200 hover:border-emerald-600 bg-white cursor-pointer shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
                <i className="bi bi-cash-stack"></i>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  deptCashier.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {deptCashier.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <h4 className="font-black text-slate-900 mt-4 text-base">Cashier Department</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Tuition Payments, Promissory Notes, Official Receipts & Student Billing
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <i className="bi bi-people-fill text-emerald-600"></i> Max Limit: {systemConfig.limits.Cashier} Students/Hour
            </div>
          </div>
        </div>
      </div>

      {/* When NO department is selected yet: Calendar and Slots are strictly HIDDEN */}
      {!selectedDept && (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-3xl">
            <i className="bi bi-calendar2-range"></i>
          </div>
          <h4 className="font-extrabold text-slate-800 text-sm">Calendar & Slot Selection Locked</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Please choose either the <strong>Accounting Department</strong> or <strong>Cashier Department</strong> card above. Once selected, the dynamic calendar and hourly appointment slots will automatically appear.
          </p>
        </div>
      )}

      {/* STEPS 2, 3, 4: Revealed AFTER department is selected */}
      {selectedDept && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* STEP 2: Choose Service with Unavailable Options Disabling */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                2
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Select {selectedDept} Department Service
                </h3>
                <p className="text-xs text-slate-500">Unavailable services are disabled and unclickable.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {departmentServices.map((service) => {
                const isSelected = selectedService === service.id;
                const isAvailable = service.available;

                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      if (isAvailable) setSelectedService(service.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all text-left relative ${
                      !isAvailable
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed pointer-events-none'
                        : isSelected
                        ? 'border-blue-700 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs cursor-pointer'
                        : 'border-slate-200 hover:border-blue-600 bg-white cursor-pointer hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{service.name}</span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{service.description}</p>
                    {!isAvailable && (
                      <p className="text-[10px] text-rose-600 font-bold mt-2">
                        <i className="bi bi-slash-circle mr-1"></i> {service.disabledReason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Dynamic Real-time Calendar Synchronized with Current Date */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  3
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Select Appointment Date (Dynamic Calendar)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Synchronized automatically with today's date. Past dates and Sundays are unclickable.
                  </p>
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  Today
                </button>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-blue-700 hover:text-white transition shadow-2xs cursor-pointer"
                    title="Previous Month"
                  >
                    <i className="bi bi-chevron-left text-xs"></i>
                  </button>
                  <span className="px-3 text-xs font-extrabold text-slate-900 min-w-32 text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-blue-700 hover:text-white transition shadow-2xs cursor-pointer"
                    title="Next Month"
                  >
                    <i className="bi bi-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="font-extrabold text-slate-400 py-1 uppercase text-[10px] tracking-wider">
                  {d}
                </div>
              ))}

              {/* Leading Empty Cells */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="py-3 bg-slate-50/50 rounded-xl"></div>
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const cellDate = new Date(currentYear, currentMonth, dayNum);
                const isSunday = cellDate.getDay() === 0;
                
                const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const cellClean = new Date(currentYear, currentMonth, dayNum);
                const isPast = cellClean < todayClean;
                const isToday = cellClean.getTime() === todayClean.getTime();

                const isSelected =
                  selectedDate &&
                  selectedDate.getFullYear() === currentYear &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getDate() === dayNum;

                const isUnavailable = isSunday || isPast;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => {
                      if (!isUnavailable) {
                        setSelectedDate(new Date(currentYear, currentMonth, dayNum));
                        setSelectedSlot(null);
                      }
                    }}
                    className={`py-3 px-1 rounded-2xl text-center font-bold transition-all relative ${
                      isUnavailable
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'bg-blue-700 text-white font-black shadow-md ring-2 ring-blue-500/30 cursor-pointer'
                        : 'bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200/90 hover:border-blue-600 cursor-pointer'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isToday && (
                      <span
                        className={`block text-[8px] font-black uppercase tracking-tighter ${
                          isSelected ? 'text-amber-300' : 'text-blue-700'
                        }`}
                      >
                        Today
                      </span>
                    )}
                    {isSunday && (
                      <span className="block text-[7px] text-slate-400 font-medium">Closed</span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  Selected Date:{' '}
                  <strong className="text-slate-900">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </strong>
                </div>
                <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-black">
                  Date Open for Slots
                </span>
              </div>
            )}
          </div>

          {/* STEP 4: Available Hourly Time Slots (Student Limit: 30 students per hour) */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  4
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Select Hourly Appointment Slot
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Maximum limit: <strong className="text-blue-700 font-bold">{hourlyLimit} students per hour</strong>. Slots reaching 30/30 are marked full and unclickable.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Department: <strong className="text-slate-900 font-bold">{selectedDept}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {systemConfig.standardTimeSlots.map((slot) => {
                const bookedCount = getSlotBookedCount(slot.time);
                const isFull = bookedCount >= hourlyLimit;
                const isSelected = selectedSlot?.id === slot.id;
                const isUnavailable = isFull;
                const availableSlotsLeft = Math.max(0, hourlyLimit - bookedCount);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => {
                      if (!isUnavailable) setSelectedSlot(slot);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all relative ${
                      isUnavailable
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'border-blue-700 bg-blue-50/90 text-blue-900 ring-2 ring-blue-500/30 shadow-md font-bold cursor-pointer'
                        : 'border-slate-200 bg-white hover:border-blue-600 hover:bg-slate-50 text-slate-800 cursor-pointer shadow-2xs'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-slate-900">{slot.time}</div>

                    <div className="mt-2.5">
                      {isFull ? (
                        <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full uppercase">
                          FULL ({bookedCount}/{hourlyLimit})
                        </span>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="text-[10px] text-slate-500 font-medium">
                            {bookedCount} / {hourlyLimit} Booked
                          </div>
                          {/* Occupancy Bar */}
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(bookedCount / hourlyLimit) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-[9px] text-emerald-700 font-extrabold">
                            {availableSlotsLeft} slots left
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm & Generate Queue Number */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {selectedService && selectedSlot ? (
                  <span>
                    Ready to confirm: <strong className="text-slate-900">{systemConfig.services[selectedService]?.name}</strong> on{' '}
                    <strong className="text-slate-900">{selectedDate.toLocaleDateString()}</strong> at <strong className="text-blue-700">{selectedSlot.time}</strong>
                  </span>
                ) : (
                  <span>Please choose your requested service and hourly slot above.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={!selectedService || !selectedSlot}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                  selectedService && selectedSlot
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-blue-700/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <i className="bi bi-ticket-perforated-fill text-sm"></i>
                <span>Confirm & Generate Queue Slip</span>
              </button>
            </div>

            {bookingSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <i className="bi bi-check-circle-fill text-emerald-600 text-lg shrink-0"></i>
                <span>
                  Slot reserved successfully! Your unique queue ticket number has been generated.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
