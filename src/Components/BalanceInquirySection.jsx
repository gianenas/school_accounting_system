import React from 'react';
import { enrolledSubjects, feeBreakdown } from '../data/matriculationData';

export default function BalanceInquirySection({
  currentUser,
  paymentTerms,
  onPayInstallment,
  onPayAll,
  onResetBalance,
}) {
  const outstandingBalance = paymentTerms
    .filter((pt) => pt.status !== 'Paid')
    .reduce((sum, pt) => sum + pt.amount, 0);

  const isFullyPaid = outstandingBalance === 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Dynamic Status Banner */}
      <div
        className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${
          isFullyPaid
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-gradient-to-r from-rose-50 via-red-50/60 to-rose-50 border-rose-300 text-rose-950'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
              isFullyPaid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            <i className={`bi ${isFullyPaid ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill'}`}></i>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-75">
              Matriculation Assessment Balance
            </span>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isFullyPaid ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                ₱{outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase border shadow-2xs ${
                  isFullyPaid
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                }`}
              >
                {isFullyPaid ? 'FULLY PAID' : 'UNPAID BALANCE'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Payment Simulator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isFullyPaid ? (
            <>
              <button
                onClick={onPayInstallment}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5"
                title="Pay Next Due Term at Cashier Counter"
              >
                <i className="bi bi-cash-stack"></i> Pay Next Due Term
              </button>
              <button
                onClick={onPayAll}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-1.5"
                title="Simulate Full Clearance"
              >
                <i className="bi bi-wallet2"></i> Settle Full Amount
              </button>
            </>
          ) : (
            <button
              onClick={onResetBalance}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              title="Reset balance to test unpaid state"
            >
              <i className="bi bi-arrow-counterclockwise"></i> Reset Unpaid Demo
            </button>
          )}
        </div>
      </div>

      {/* Official Certificate of Matriculation Form */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-300 shadow-md font-sans">
        {/* Document Header with Logo */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-5 relative">
          <div className="w-18 h-18 mx-auto mb-2.5 bg-white rounded-full p-1 border border-slate-200 shadow-xs flex items-center justify-center">
            <img src="/logo.png" alt="CDI Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-black text-sm sm:text-base tracking-wide uppercase text-slate-900">
            Computer Communication Development Institute
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Sorsogon City Campus • Accounting & Registrar Office</p>
          <h3 className="font-black text-base mt-2.5 tracking-widest text-blue-900 uppercase">
            Official Certificate of Matriculation
          </h3>
        </div>

        {/* Student Meta Details */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1.5">
            <p>
              <span className="text-slate-500 font-medium">Student Name:</span>{' '}
              <strong className="text-slate-900">{currentUser?.fullName || 'Faith Dela Cruz'}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-medium">Course & Year Level:</span>{' '}
              <strong className="text-slate-900">{currentUser?.course || 'BS Information Technology - 3rd Year'}</strong>
            </p>
          </div>
          <div className="space-y-1.5">
            <p>
              <span className="text-slate-500 font-medium">Semester / Term:</span>{' '}
              <strong className="text-slate-900">1st Semester, A.Y. 2026-2027</strong>
            </p>
            <p>
              <span className="text-slate-500 font-medium">Student ID Number:</span>{' '}
              <strong className="text-slate-900 font-mono">{currentUser?.studentNum || '2026-0001'}</strong>
            </p>
          </div>
        </div>

        {/* Enrolled Subjects Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 font-bold text-slate-900">
                <th className="border border-slate-400 px-3 py-2 text-left">SUBJ. CODE</th>
                <th className="border border-slate-400 px-3 py-2 text-left">SUBJECT TITLE</th>
                <th className="border border-slate-400 px-3 py-2 text-center w-20">UNITS</th>
              </tr>
            </thead>
            <tbody>
              {enrolledSubjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-3 py-1.5 font-mono font-medium">{sub.code}</td>
                  <td className="border border-slate-300 px-3 py-1.5 text-slate-800">{sub.title}</td>
                  <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-800">{sub.units}</td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-100 border-t border-slate-400">
                <td colSpan="2" className="border border-slate-400 px-3 py-2 text-right">
                  Total Academic Load:
                </td>
                <td className="border border-slate-400 px-3 py-2 text-center text-blue-800 font-black">21 Units</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fees Breakdown & Payment Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-slate-300 pt-5">
          {/* Fees breakdown */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
              Assessment Fees Breakdown
            </h4>
            <div className="flex justify-between py-1 text-slate-700">
              <span>Tuition Fee:</span>
              <span className="font-semibold">₱{feeBreakdown.tuitionFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-700">
              <span>Laboratory Fee:</span>
              <span className="font-semibold">₱{feeBreakdown.labFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-700">
              <span>Miscellaneous Fee:</span>
              <span className="font-semibold">₱{feeBreakdown.miscFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-black border-t-2 border-slate-900 py-2 mt-2 text-slate-900 text-sm">
              <span>Total Assessment Fee:</span>
              <span>₱{feeBreakdown.totalAssessment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Payment Terms with Dynamic Color Indicators */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
              Schedule & Terms of Payment
            </h4>
            {paymentTerms.map((pt) => {
              const paid = pt.status === 'Paid';
              return (
                <div key={pt.id} className="flex items-center justify-between py-1 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{pt.term}:</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        paid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${paid ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      ₱{pt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    {paid && pt.receiptNo && (
                      <span className="block text-[9px] text-emerald-700 font-mono font-bold">
                        {pt.receiptNo}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Total Outstanding Balance: Red if unpaid, Green if paid */}
            <div
              className={`flex justify-between items-center font-black border-t-2 border-slate-900 py-2.5 mt-3 text-sm ${
                isFullyPaid ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              <span>Outstanding Balance:</span>
              <span className="text-base font-black">
                ₱{outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
