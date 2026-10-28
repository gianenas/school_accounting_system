import React, { useState, useEffect, useRef } from 'react';

export default function LoginSection({
  onStudentLogin,
  onStaffLogin,
  onSwitchToSignup,
  onSwitchToForgot,
  authAlert,
}) {
  // Portal mode: 'student' or 'staff'
  const [portalMode, setPortalMode] = useState('student');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const canvasRef = useRef(null);

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(code, 18, 24);

      // Noise lines for CAPTCHA security
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, 12);
      ctx.lineTo(112, 22);
      ctx.moveTo(15, 26);
      ctx.lineTo(105, 10);
      ctx.stroke();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, [portalMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (portalMode === 'student') {
      onStudentLogin({ studentNum: identifier, password, captchaInput, expectedCaptcha: captchaCode }, generateCaptcha);
    } else {
      onStaffLogin({ username: identifier, password, captchaInput, expectedCaptcha: captchaCode }, generateCaptcha);
    }
  };

  return (
    <div className="space-y-5">
      {/* Portal Mode Selector (Separation between Student Portal and Staff/Admin Gateway) */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setPortalMode('student');
            setIdentifier('');
            setPassword('');
            setCaptchaInput('');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            portalMode === 'student'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="bi bi-mortarboard-fill text-blue-600"></i>
          <span>Student Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPortalMode('staff');
            setIdentifier('');
            setPassword('');
            setCaptchaInput('');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            portalMode === 'staff'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="bi bi-shield-lock-fill text-amber-400"></i>
          <span>Staff & Admin</span>
        </button>
      </div>

      {/* Security notice for Staff Portal */}
      {portalMode === 'staff' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
          <i className="bi bi-shield-exclamation text-amber-600 text-base shrink-0 mt-0.5"></i>
          <div>
            <strong>Restricted Administrative Access:</strong>
            <p className="text-amber-800 mt-0.5">
              Only authorized Accounting, Cashier, and Administration personnel are permitted to sign in here. Student accounts cannot access this gateway.
            </p>
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {authAlert && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            authAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : authAlert.type === 'info'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <i className={`bi ${authAlert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} shrink-0 text-sm`}></i>
          <span>{authAlert.message}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {portalMode === 'student' ? 'Student Number' : 'Staff / Administrator ID'}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className={`bi ${portalMode === 'student' ? 'bi-person-badge' : 'bi-person-gear'}`}></i>
            </span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
              placeholder={portalMode === 'student' ? 'e.g. 2026-0001' : 'e.g. accounting, cashier, admin'}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Account Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Security CAPTCHA</label>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <canvas ref={canvasRef} width="124" height="34" className="rounded-lg bg-slate-200 shrink-0"></canvas>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-blue-700 hover:rotate-180 transition-transform duration-300 p-1 cursor-pointer shrink-0"
              title="Refresh Security Code"
            >
              <i className="bi bi-arrow-clockwise text-lg"></i>
            </button>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center font-bold font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Code"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white font-extrabold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
            portalMode === 'student'
              ? 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 shadow-blue-700/20'
              : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
          }`}
        >
          <i className="bi bi-box-arrow-in-right text-base"></i>
          <span>{portalMode === 'student' ? 'Sign In to Student Portal' : 'Authenticate Staff Session'}</span>
        </button>

        {portalMode === 'student' ? (
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-slate-500 hover:text-blue-700 transition cursor-pointer"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-700 hover:underline font-bold transition cursor-pointer"
            >
              Register Student Profile
            </button>
          </div>
        ) : (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-[11px] text-slate-500 hover:underline cursor-pointer"
            >
              Administrative Help Desk
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
