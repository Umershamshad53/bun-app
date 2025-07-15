"use server";

// import { API_ENDPOINTS } from "@/features/common/utilities/config";
// import { api } from "@/features/common/utilities/api";

// export const createStudentFeePayment = async (formData: {
//   studentId: number;
//   feeRecordId: number;
//   amountPaid: number;
//   paymentDate?: string;
//   paymentMethod?: string;
// }) => {
//   try {
//     const res = await api(API_ENDPOINTS.dashboard.studentFeePayment, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         studentId: formData.studentId,
//         feeRecordId: formData.feeRecordId,
//         amountPaid: formData.amountPaid,
//         paymentDate: formData.paymentDate || new Date().toISOString(),
//         paymentMethod: formData.paymentMethod || "Cash",
//       }),
//     });

//     if (!res.ok) {
//       const errorRes = await res.json();
//       return {
//         success: false,
//         message: errorRes.error || "Fee payment failed",
//       };
//     }

//     const result = await res.json();
//     return {
//       success: true,
//       message: "Fee payment successful",
//       data: result,
//     };
//   } catch (error) {
//     console.error("Student Fee Payment Error:", error);
//     return {
//       success: false,
//       message: "Unexpected error occurred",
//     };
//   }
// };



import { API_ENDPOINTS } from "@/features/common/utilities/config";
import { api } from "@/features/common/utilities/api";


export const createStudentFeePayment = async (studentId: number) => {
  try {
    const url = `${API_ENDPOINTS.dashboard.studentFeePayment}?studentId=${studentId}`;

    const res = await api(url, {
    
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return {
        success: false,
        message: errorRes.error || "Fee payment failed",
      };
    }

    const result = await res.json();
    console.log("resultresultresult", result);
    return {
      success: true,
      message: "Fee payment successful",
      data: result,
    };
  } catch (error) {
    console.error("Student Fee Payment Error:", error);
    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
};
