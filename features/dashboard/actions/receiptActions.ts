// import { api } from "@/features/common/utilities/api";
// import { API_ENDPOINTS } from "@/features/common/utilities/config";

export const getReceipt = async (receiptNo?: string) => {
  try {
    const res = await fetch(`/api/invoiceNumber/${receiptNo}`);

    if (!res.ok) {
      const errorRes = await res.json();
      console.log("error response:", errorRes);
      return {
        success: false,
        message: errorRes.message || "Failed to fetch receipt.",
      };
    }

    const result = JSON.parse(JSON.stringify(await res.json()));
    return { success: true, data: result };
  } catch (error) {
    console.error(
      "Get Fees Error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return { success: false, message: "Unexpected error occurred." };
  }
};

export const getAllReceipts = async () => {
  try {
    const res = await fetch(`/api/invoiceNumber`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorRes = await res.json();
      console.log("error response:", errorRes);
      return {
        success: false,
        message: errorRes.message || "Failed to fetch receipt.",
      };
    }

    const result = JSON.parse(JSON.stringify(await res.json()));
    return { success: true, data: result };
  } catch (error) {
    console.error(
      "Get Fees Error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return { success: false, message: "Unexpected error occurred." };
  }
};