"use server";

import { API_ENDPOINTS } from "@/features/common/utilities/config";
import { api } from "@/features/common/utilities/api";

export const createFeeStructure = async (formData: {
  classId: number;
  feeTypeId: number;
  amount: number;
}) => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.feeStructure, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return {
        success: false,
        message: errorRes.message || "Failed to create fee structure.",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Fee structure created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Create Fee Structure Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};




export const getFeeStructures = async () => {
    try {
      const res = await api(API_ENDPOINTS.dashboard.feeStructure, {
        method: "GET",
      });
  
      if (!res.ok) {
        const errorRes = await res.json();
        return {
          success: false,
          message: errorRes.message || "Failed to fetch fee structures.",
        };
      }
  
      const result = await res.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("Get Fee Structures Error:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  };
  


  export const updateFeeStructure = async (
    id: number,
    formData: {
      classId: number;
      feeTypeId: number;
      amount: number;
    }
  ) => {
    try {
      const res = await api(`${API_ENDPOINTS.dashboard.feeStructure}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) {
        const errorRes = await res.json();
        return {
          success: false,
          message: errorRes.message || "Failed to update fee structure.",
        };
      }
  
      const result = await res.json();
      return {
        success: true,
        message: "Fee structure updated successfully.",
        data: result,
      };
    } catch (error) {
      console.error("Update Fee Structure Error:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  };

  
  export const deleteFeeStructure = async (id: number) => {
    try {
      const res = await api(`${API_ENDPOINTS.dashboard.feeStructure}/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        const errorRes = await res.json();
        return {
          success: false,
          message: errorRes.message || "Failed to delete fee structure.",
        };
      }
  
      return {
        success: true,
        message: "Fee structure deleted successfully.",
      };
    } catch (error) {
      console.error("Delete Fee Structure Error:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  };
  