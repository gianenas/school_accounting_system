import React, { useState } from 'react';

export default function DepartmentManagementSection({
  currentUser,
  systemConfig,
  onUpdateLimit,
  onToggleDepartment,
  onToggleService,
}) {
  const isAdmin = currentUser?.role === 'admin';
  const isAccounting = currentUser?.role === 'accounting' || isAdmin;
  const isCashier = currentUser?.role === 'cashier' || isAdmin;

  // Selected tab for department when admin
  const [activeDeptTab, setActiveDeptTab] = useState(
    currentUser?.role === 'cashier' ? 'Cashier' : 'Accounting'
  );

  // Local state for limit editing
  const [accountingLimitInput, setAccountingLimitInput] = useState(
    systemConfig.limits.Accounting || 30
  );
  const [cashierLimitInput, setCashierLimitInput] = useState(
    systemConfig.limits.Cashier || 30
  );
  const [saveAlert, setSaveAlert] = useState(null);

  const handleSaveAccountingLimit = (e) => {
    e.preventDefault();
    const val = parseInt(accountingLimitInput, 10);
    if (isNaN(val) || val < 1 || val > 100) return;
    onUpdateLimit('Accounting', val);
    setSaveAlert('Accounting maximum student limit per hour updated successfully!');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  const handleSaveCashierLimit = (e) => {
    e.preventDefault();
    const val = parseInt(cashierLimitInput, 10);
    if (isNaN(val) || val < 1 || val > 100) return;
    onUpdateLimit('Cashier', val);
    setSaveAlert('Cashier maximum student limit per hour updated successfully!');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Alert message */}
      {saveAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-emerald-600 text-base"></i>
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Role & Permissions Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Administrative Privilege Controls
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            Department Schedule & Hourly Slot Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated as: <strong className="text-slate-900">{currentUser?.fullName}</strong> (
            <span className="capitalize font-bold text-blue-700">{currentUser?.role}</span>)
          </p>
        </div>

        {/* Department Switcher Tabs (Only Admin has rights to switch both) */}
        {isAdmin && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto border border-slate-200">
            <button
              onClick={() => setActiveDeptTab('Accounting')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeDeptTab === 'Accounting'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accounting Department
            </button>
            <button
              onClick={() => setActiveDeptTab('Cashier')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeDeptTab === 'Cashier'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cashier Department
            </button>
          </div>
        )}
      </div>

      {/* ACCOUNTING DEPARTMENT SECTION */}
      {(isAdmin ? activeDeptTab === 'Accounting' : isAccounting) && (
        <div className="bg-white rounded-3xl border border-blue-200/80 shadow-xs p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl shadow-inner">
                <i className="bi bi-file-earmark-text"></i>
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">Accounting Department Controls</h4>
                <p className="text-xs text-slate-500">Configure appointment capacity and toggle service availability</p>
              </div>
            </div>

            {/* Department Active Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Department Status:</span>
              <button
                type="button"
                onClick={() => onToggleDepartment('Accounting')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  systemConfig.departments.Accounting.available
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    systemConfig.departments.Accounting.available ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                ></span>
                {systemConfig.departments.Accounting.available ? 'Open / Available' : 'Closed / Unavailable'}
              </button>
            </div>
          </div>

          {/* Student Limit per Hour (Default: 30 students per hour) */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-black text-sm text-blue-900 flex items-center gap-2">
                  <i className="bi bi-people-fill text-blue-700"></i> Maximum Student Limit per Hour
                </h5>
                <p className="text-xs text-slate-600 mt-1">
                  Configure maximum appointment capacity for each 1-hour time window (Requirement: Default 30 students/hour).
                </p>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-blue-800">
                {systemConfig.limits.Accounting} <span className="text-xs font-normal text-slate-500">students/hr</span>
              </span>
            </div>

            <form onSubmit={handleSaveAccountingLimit} className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700">Adjust Limit:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={accountingLimitInput}
                  onChange={(e) => setAccountingLimitInput(e.target.value)}
                  className="w-24 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-center focus:ring-2 focus:ring-blue-700 focus:outline-none"
                />
              </div>

              <div className="flex gap-1.5">
                {[20, 25, 30, 35, 40].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAccountingLimitInput(preset)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-bold transition cursor-pointer ${
                      Number(accountingLimitInput) === preset
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black rounded-xl shadow-md shadow-blue-700/20 transition cursor-pointer"
              >
                Save Limit
              </button>
            </form>
          </div>

          {/* Accounting Services Availability Toggles */}
          <div className="space-y-3">
            <h5 className="font-black text-xs uppercase tracking-wider text-slate-400">
              Accounting Services Availability Controls
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(systemConfig.services)
                .filter((s) => s.department === 'Accounting')
                .map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{srv.name}</span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                            srv.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {srv.available ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{srv.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleService(srv.id)}
                      className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        srv.available
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <i className={`bi ${srv.available ? 'bi-toggle-on text-emerald-600 text-base' : 'bi-toggle-off text-slate-400 text-base'}`}></i>
                      <span>{srv.available ? 'Disable Service' : 'Enable Service'}</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* CASHIER DEPARTMENT SECTION */}
      {(isAdmin ? activeDeptTab === 'Cashier' : isCashier) && (
        <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-xs p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">Cashier Department Controls</h4>
                <p className="text-xs text-slate-500">Configure appointment capacity and toggle service availability</p>
              </div>
            </div>

            {/* Department Active Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Department Status:</span>
              <button
                type="button"
                onClick={() => onToggleDepartment('Cashier')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  systemConfig.departments.Cashier.available
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    systemConfig.departments.Cashier.available ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                ></span>
                {systemConfig.departments.Cashier.available ? 'Open / Available' : 'Closed / Unavailable'}
              </button>
            </div>
          </div>

          {/* Student Limit per Hour (Default: 30 students per hour) */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-black text-sm text-emerald-900 flex items-center gap-2">
                  <i className="bi bi-people-fill text-emerald-700"></i> Maximum Student Limit per Hour
                </h5>
                <p className="text-xs text-slate-600 mt-1">
                  Configure maximum appointment capacity for each 1-hour time window (Requirement: Default 30 students/hour).
                </p>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                {systemConfig.limits.Cashier} <span className="text-xs font-normal text-slate-500">students/hr</span>
              </span>
            </div>

            <form onSubmit={handleSaveCashierLimit} className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700">Adjust Limit:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={cashierLimitInput}
                  onChange={(e) => setCashierLimitInput(e.target.value)}
                  className="w-24 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-center focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex gap-1.5">
                {[20, 25, 30, 35, 40].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCashierLimitInput(preset)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-bold transition cursor-pointer ${
                      Number(cashierLimitInput) === preset
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer"
              >
                Save Limit
              </button>
            </form>
          </div>

          {/* Cashier Services Availability Toggles */}
          <div className="space-y-3">
            <h5 className="font-black text-xs uppercase tracking-wider text-slate-400">
              Cashier Services Availability Controls
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(systemConfig.services)
                .filter((s) => s.department === 'Cashier')
                .map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{srv.name}</span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                            srv.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {srv.available ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{srv.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleService(srv.id)}
                      className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        srv.available
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <i className={`bi ${srv.available ? 'bi-toggle-on text-emerald-600 text-base' : 'bi-toggle-off text-slate-400 text-base'}`}></i>
                      <span>{srv.available ? 'Disable Service' : 'Enable Service'}</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
