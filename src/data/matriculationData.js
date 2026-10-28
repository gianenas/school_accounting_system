export const enrolledSubjects = [
  { code: 'Scie', title: 'Science Technology & Society', units: 3 },
  { code: 'ACCTNG', title: 'Fundamentals of Accounting', units: 3 },
  { code: 'ITP 306', title: 'Networking 1', units: 3 },
  { code: 'Humanities', title: 'Art Appreciation', units: 3 },
  { code: 'ITP 302', title: 'Systems Integration and Architecture 1', units: 3 },
  { code: 'ITP 303', title: 'Information Assurance and Security 1', units: 3 },
  { code: 'ITP Elective 3', title: 'Integrative Programming and Technologies', units: 3 },
];

export const feeBreakdown = {
  tuitionFee: 7644.00,
  labFee: 5568.00,
  miscFee: 4700.00,
  totalAssessment: 17912.00,
};

export const initialPaymentTerms = [
  { id: 'term-reg', term: 'Upon Registration', amount: 4700.00, status: 'Paid', receiptNo: 'OR-89210', datePaid: '2026-08-15' },
  { id: 'term-prelim', term: 'Prelim', amount: 3963.60, status: 'Unpaid', receiptNo: null, datePaid: null },
  { id: 'term-midterm', term: 'Midterm', amount: 3963.60, status: 'Unpaid', receiptNo: null, datePaid: null },
  { id: 'term-semifinal', term: 'Semi-Final', amount: 3303.00, status: 'Unpaid', receiptNo: null, datePaid: null },
  { id: 'term-final', term: 'Final', amount: 1981.80, status: 'Unpaid', receiptNo: null, datePaid: null },
];
