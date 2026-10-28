import React, { useState } from 'react';

export default function SignUpSection({ onRegisterSubmit, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    studentNum: '',
    course: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterSubmit({
      ...formData,
      role: 'student',
      department: 'Student',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="text-center pb-2 border-b border-slate-100">
        <h3 className="font-black text-slate-900 text-sm">Official Student Registration</h3>
        <p className="text-[11px] text-slate-500">Create your credentials for student portal services</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
          placeholder="First Name M.I. Last Name"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Student Number</label>
        <input
          type="text"
          name="studentNum"
          value={formData.studentNum}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
          placeholder="e.g. 2026-0002"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Course & Year Level</label>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
          placeholder="e.g. BS Information Technology - 3rd Year"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">CCDI Student Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
          placeholder="student@ccdi.edu.ph"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black rounded-xl text-xs sm:text-sm transition shadow-md shadow-blue-700/20 cursor-pointer mt-2"
      >
        Complete Registration
      </button>

      <div className="text-center text-xs pt-1">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-700 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Sign In</span>
        </button>
      </div>
    </form>
  );
}
