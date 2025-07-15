
  
"use server";
import { API_ENDPOINTS } from "@/features/common/utilities/config";
import { api } from "@/features/common/utilities/api";



export const createStudent = async (formData: Record<string, unknown>) => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.getStudent, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        grade: Number(formData.grade),
        class: Number(formData.class),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        status: formData.status || "Inactive",
        studentAnnualFee: formData.studentAnnualFee ? Number(formData.studentAnnualFee) : 0,
        discount: Array.isArray(formData.discount) ? formData.discount : [],
      }),
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return { success: false, message: errorRes.message || "Failed to create student." };
    }

    const result = await res.json();
    return { success: true, message: "Student created", data: result };
  } catch (error: unknown) {
    console.error("Create Student Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};

export const getStudents = async (search = "", page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", String(page));
    params.append("limit", String(limit));

    const res = await api(`${API_ENDPOINTS.dashboard.getStudent}?${params.toString()}`, {
      method: "GET",
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to fetch students." };
    }

    return {
      success: true,
      data: {
        students: result.students,
        pagination: result.pagination,
      },
    };
  } catch (error) {
    console.error("Get Students Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};



export const updateStudent = async (id: number, formData: Record<string, unknown>) => {
  try {
    const payload: Record<string, unknown> = {};

    if ("fullName" in formData) payload.fullName = formData.fullName;
    if ("grade" in formData) payload.grade = Number(formData.grade);
    if ("class" in formData) payload.class = Number(formData.class);
    if ("email" in formData) payload.email = formData.email;
    if ("phone" in formData) payload.phone = formData.phone;
    if ("address" in formData) payload.address = formData.address;
    if ("status" in formData) payload.status = formData.status;
    if ("guardianName" in formData) payload.guardianName = formData.guardianName;
    if ("guardianPhone" in formData) payload.guardianPhone = formData.guardianPhone;
    if ("studentAnnualFee" in formData) payload.studentAnnualFee = Number(formData.studentAnnualFee);
    if ("discount" in formData) payload.discount = Number(formData.discount);

    const res = await api(`${API_ENDPOINTS.dashboard.getStudent}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorRes = await res.json();
      return { success: false, message: errorRes.message || "Failed to update student." };
    }

    const result = await res.json();
    return { success: true, message: "Student updated", data: result };
  } catch (error) {
    console.error("Update Student Error:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
};




