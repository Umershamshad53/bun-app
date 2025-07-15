"use server";

import { api } from "@/features/common/utilities/api";
import { API_ENDPOINTS } from "@/features/common/utilities/config";

export const getClasses = async () => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.getClasses, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch classes");

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { success: false, message: "Error fetching classes" };
  }
};

export const getFeeTypes = async () => {
  try {
    const res = await api(
      `${API_ENDPOINTS.dashboard.getFeeTypes}?paymentType=Monthly`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch fee types");

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { success: false, message: "Error fetching classes" };
  }
};

export const createClass = async (payload: { value: string; feeTypes: { name: string; amount: number; paymentType: string }[] }) => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.getClasses, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("payloadpayload", payload);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to create class");

    return { success: true, data };
  } catch (error: unknown) {
    console.error("Error creating class:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error creating class",
    };
  }
};

export const updateClass = async (id: number, payload: { value: string; feeTypes: { name: string; amount: number }[] }) => {
  try {
    const res = await api(`${API_ENDPOINTS.dashboard.getClasses}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Failed to update class");

    return { success: true, data };
  } catch (error: unknown) {
    console.error("Error updating class:", error);
    return { success: false, message: error instanceof Error ? error.message : "Error updating class" };
  }
};

export const deleteClass = async (id: number) => {
  try {
    const res = await api(`${API_ENDPOINTS.dashboard.getClasses}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete class");

    return { success: true, data };
  } catch (error: unknown) {
    console.error("Error deleting class:", error);
    return { success: false, message: error instanceof Error ? error.message : "Error deleting class" };
  }
};