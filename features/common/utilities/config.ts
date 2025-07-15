export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const BASE_URL = `${API_URL}/${API_VERSION}`;

export const API_ENDPOINTS = {
  auth: {
    login: "login",
  },
  dashboard: {
    getDashboardData: "signUp",
    getStudent: "student",
    getGrade: "grade",
    getClasses: "class",
    fee: "studentFeeType",
    feeStructure: "feeStructure",
    studentFeePayment: "studentFeeRecord",
    studentPaymentFee: "studentFeePayment",
    outStandingBalance: "outStandingBalance",
    getFeeTypes: "studentFeeType",
    getReceipt: "invoiceNumber",
    getUsers: "user",
    getDashboard: "dashboard",
  },
};
