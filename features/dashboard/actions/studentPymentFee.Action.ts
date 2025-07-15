"use server";

import { api } from "@/features/common/utilities/api";
import { API_ENDPOINTS } from "@/features/common/utilities/config";

// Assuming this is your Fee interface
// interface Fee {
//   id: string;
//   feeName: string;
//   feeAmount: number;
//   feeType: string; // Add this field
//   customAmount?: number;
//   discount?: number;
// }

// interface FeePaymentPayload {
//   studentId: number;
//   feeRecordId: number;
//   paymentDate?: string;
//   paymentMethod?: string;
//   feeTypes: FeeType[];
// }
// interface FeePaymentPayload {
//   studentId: number;
//   feeRecordId: number;
//   paymentDate: string;
//   paymentMethod: string;
//   feeTypes: Array<{
//     id?: string | number; // Fee type ID
//     name: string;        // Fee name
//     amount: number;      // Original amount
//     discount: number;    // Applied discount
//     finalAmount: number; // Amount after discount
//     // Include any other properties your fee types might have
//     [key: string]: any;  // For additional properties
//   }>;
//   totalAmount: number;
//   discount: number;
// }
interface FeeBreakdownItem {
  name: string;
  type: string;
  amount: number;
}

interface FeeTypeItem {
  name: string;
  amount: number;
  type: string;
}
interface FeePaymentPayload {
  studentId: number;
  feeRecordId: number;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  discount: number;
  feeBreakdown: FeeBreakdownItem[];
  feeTypes?: FeeTypeItem[];
}
export const addStudentFeePayment = async (payload: FeePaymentPayload) => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.studentPaymentFee, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.error || "Failed to add fee payment",
      };
    }

    return {
      success: true,
      message: "Fee payment successfully recorded",
      data,
    };
  } catch (error) {
    console.error("Error in addStudentFeePayment:", error);
    return {
      success: false,
      message: "Something went wrong while submitting payment.",
    };
  }
};
