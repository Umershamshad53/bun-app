import { apiClient } from "@/features/common/utilities/apiClient";

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

export const getDashboard = async () => {
  try {
    const data = await apiClient("/api/dashboard", { method: "GET" });
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(error);
    let message = "Something went wrong";
    if (isErrorWithMessage(error)) {
      message = error.message;
    }
    return {
      success: false,
      message,
    };
  }
};