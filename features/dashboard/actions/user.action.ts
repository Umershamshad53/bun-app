
"use server";

import { API_ENDPOINTS } from "@/features/common/utilities/config";
import { api } from "@/features/common/utilities/api";

interface UserPayload {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | string;
}

export const userCreated = async (payload: UserPayload) => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.getDashboardData, {
      body: JSON.stringify(payload),
      method: "POST",
    });
console.log(payload, "Payload");

    const response = await res.json();

 
    console.log("Payload:", payload);
    console.log("Status:", res.status);
    console.log("Response:", response);
    if (res.ok || res.status === 200) {
      return {
        success: true,
        message: response.message || "User created successfully",
        user: response.user || response,
        token: response.token || null,
      };
    }

    return {
      success: false,
      message: response?.message || "User creation failed",
      statusCode: res.status,
    };
  } catch (err) {
    console.error("Error occurred during user created:", err);
    return {
      success: false,
      message: "An error occurred during user created.",
    };
  }
};

export const updateUser = async (id: number, payload: Partial<UserPayload>) => {
  try {
    const res = await api(`${API_ENDPOINTS.dashboard.getUsers}/${id}`, {
      body: JSON.stringify(payload),
      method: "PUT",
    });

    const response = await res.json();

    if (res.ok || res.status === 200) {
      return {
        success: true,
        message: response.message || "User updated successfully",
        user: response.user || response,
      };
    }

    return {
      success: false,
      message: response?.message || "User update failed",
      statusCode: res.status,
    };
  } catch (err) {
    console.error("Error occurred during user update:", err);
    return {
      success: false,
      message: "An error occurred during user update.",
    };
  }
};

export const getUsers = async () => {
  try {
    const res = await api(API_ENDPOINTS.dashboard.getUsers, {
      method: "GET",
    });
    const response = await res.json();
    if (res.ok || res.status === 200) {
      return {
        success: true,
        message: response.message || "Users retrieved successfully",
        users: response.users || response,
      };
    }
    return {
      success: false,
      message: response?.message || "User creation failed",
      statusCode: res.status,
    };
  } catch (err) {
    console.error("Error occurred during user created:", err);
    return {
      success: false,
      message: "An error occurred during user created.",
    };
  }
};
