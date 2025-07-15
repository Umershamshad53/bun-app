"use server";

import { api } from "@/features/common/utilities/api";
import { API_ENDPOINTS } from "@/features/common/utilities/config";

export const createFee = async (formData: Record<string, unknown>) => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.fee, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feeName: formData.feeName,
        feeDescription: formData.feeDescription,
        feeAmount: Number(formData.feeAmount),
        paymentType: formData.paymentType,
        feeRequired: Boolean(formData.feeRequired),
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.log("errorReserrorRes", result);
      return {
        success: false,
        message: result.error || "Failed to create fee.",
      };
    }
    return { success: true, message: "Fee created successfully", data: result };
  } catch (error: unknown) {
    console.error("Create Fee Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};
export const getFees = async (paymentType?: string) => {
  try {
    let url = API_ENDPOINTS.dashboard.fee;

    if (paymentType) {
      url += `?paymentType=Annually`;
    }

    const res = await api(url, {
      method: "GET",
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return {
        success: false,
        message: errorRes.message || "Failed to fetch fees.",
      };
    }

    const result = await res.json();
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Get Fees Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};

export const updateFee = async (
  id: number,
  formData: Record<string, unknown>
) => {
  try {
    const res = await api(`${API_ENDPOINTS.dashboard.fee}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feeName: formData.feeName,
        feeDescription: formData.feeDescription,
        feeAmount: Number(formData.feeAmount),
        feeRequired: Boolean(formData.feeRequired),
      }),
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return {
        success: false,
        message: errorRes.message || "Failed to update fee.",
      };
    }

    const result = await res.json();
    return { success: true, message: "Fee updated", data: result };
  } catch (error: unknown) {
    console.error("Update Fee Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};

export const deleteFee = async (id: number) => {
  try {
    const res = await api(`${API_ENDPOINTS.dashboard.fee}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return {
        success: false,
        message: errorRes.message || "Failed to delete fee.",
      };
    }

    return { success: true, message: "Fee deleted successfully" };
  } catch (error: unknown) {
    console.error("Delete Fee Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};