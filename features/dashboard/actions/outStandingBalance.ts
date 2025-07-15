"use server";

import { API_ENDPOINTS } from "@/features/common/utilities/config";
import { api } from "@/features/common/utilities/api";

export const getOutstandingBalance = async () => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.outStandingBalance, {
      method: "GET",
    });

    const response = await res.json();

    if (res.ok || res.status === 200) {
      return {
        success: true,
        data: response.overallOutstandingBalance,
      };
    }

    return {
      success: false,
      message: response?.message || "Failed to fetch outstanding balance",
      statusCode: res.status,
    };
  } catch (error) {
    console.error("❌ Error fetching outstanding balance:", error);
    return {
      success: false,
      message: "An error occurred while fetching outstanding balance.",
    };
  }
};
