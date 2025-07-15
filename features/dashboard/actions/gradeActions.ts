"use server";

import { api } from "@/features/common/utilities/api";
import { API_ENDPOINTS } from "@/features/common/utilities/config";

export const getGrades = async () => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.getGrade, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      console.error(" Failed to fetch grades. Status:", res.status);
      throw new Error(`Failed to fetch grades: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error(" Error fetching grades:", error);
    throw error;
  }
};

export const createGrade = async (gradeValue: string) => {
  console.log(" Creating grade:", gradeValue);

  try {
    const res = await api(API_ENDPOINTS.dashboard.getGrade, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: gradeValue }),
    });

    const status = res.status;
    const data = await res.json();

    console.log(" API Status:", status);
    console.log(" API Data:", data);

    if (!res.ok) {
      console.error(" API Error:", data?.error || data?.message);
      throw new Error(data?.error || data?.message || `Failed to create grade: ${status}`);
    }

    return data.grade ?? data;
  } catch (error) {
    console.error(" Error creating grade:", error);
    throw error;
  }
};

export const updateGrade = async (id: number, newValue: string) => {
  console.log(" Updating grade:", id, "to value:", newValue);

  try {
    const res = await api(`${API_ENDPOINTS.dashboard.getGrade}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: newValue }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || data.error || "Failed to update Grade");

    console.log(" Grade updated:", data);
    return data;
  } catch (error) {
    console.error(" Error updating grade:", error);
    throw error;
  }
};

export const deleteGrade = async (id: number) => {
  console.log("🗑 Deleting grade:", id);

  try {
    const res = await api(`${API_ENDPOINTS.dashboard.getGrade}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(" Failed to delete grade. Status:", res.status);
      throw new Error(`Failed to delete grade: ${res.status}`);
    }

    console.log(" Grade deleted:", data);
    return data;
  } catch (error) {
    console.error(" Error deleting grade:", error);
    throw error;
  }
};
