// Initial configuration and availability settings for departments and services
export const initialSystemConfig = {
  // Global & Department student limits per hour (default 30)
  limits: {
    Accounting: 30,
    Cashier: 30,
  },

  // Department availability toggles
  departments: {
    Accounting: {
      name: 'Accounting Department',
      code: 'ACC',
      available: true,
      description: 'Examination Permits, Clearance, Uniform Fabric Requests',
      icon: 'bi-file-earmark-text',
      color: 'blue',
    },
    Cashier: {
      name: 'Cashier Department',
      code: 'CSH',
      available: true,
      description: 'Tuition Payment, Promissory Notes, Official Receipts',
      icon: 'bi-cash-stack',
      color: 'emerald',
    },
  },

  // Service availability (can be toggled by authorized roles)
  services: {
    'exam-permit': {
      id: 'exam-permit',
      name: 'Examination Permit',
      department: 'Accounting',
      available: true,
      disabledReason: 'Midterm Examination Permit generation is currently closed.',
      description: 'Secure validated permit for upcoming major examinations.',
      requirements: 'Requires cleared or promissory-backed balance.',
    },
    'uniform-fabric': {
      id: 'uniform-fabric',
      name: 'Uniform Fabric Request',
      department: 'Accounting',
      available: true,
      disabledReason: 'Uniform fabric claim batch is currently out of stock.',
      description: 'Requisition voucher and measurement scheduling for school uniform.',
    },
    'assessment-inquiry': {
      id: 'assessment-inquiry',
      name: 'Assessment & Account Audit',
      department: 'Accounting',
      available: true,
      disabledReason: 'Accounting auditing schedule is currently unavailable.',
      description: 'Verification of matriculation assessments and scholarship grants.',
    },
    'tuition-payment': {
      id: 'tuition-payment',
      name: 'Tuition & Fees Payment',
      department: 'Cashier',
      available: true,
      disabledReason: 'Cashier counter is temporarily offline for daily audit.',
      description: 'Direct counter settlement of semester tuition and fees.',
    },
    'promissory-note': {
      id: 'promissory-note',
      name: 'Promissory Note Processing',
      department: 'Cashier',
      available: true,
      disabledReason: 'Promissory note application window has elapsed for this term.',
      description: 'Apply for deferred tuition terms to enable examination permit issuance.',
    },
  },

  // Standard hourly time slots
  standardTimeSlots: [
    { id: 'slot-1', time: '8:00 AM - 9:00 AM' },
    { id: 'slot-2', time: '9:00 AM - 10:00 AM' },
    { id: 'slot-3', time: '10:00 AM - 11:00 AM' },
    { id: 'slot-4', time: '11:00 AM - 12:00 PM' },
    { id: 'slot-5', time: '1:00 PM - 2:00 PM' },
    { id: 'slot-6', time: '2:00 PM - 3:00 PM' },
    { id: 'slot-7', time: '3:00 PM - 4:00 PM' },
    { id: 'slot-8', time: '4:00 PM - 5:00 PM' },
  ],
};

