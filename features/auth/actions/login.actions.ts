
"use server";

import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/features/common/utilities/config";
import { api } from "@/features/common/utilities/api";
import { redirect as nextRedirect } from "next/navigation";
import jwt from "jsonwebtoken";

interface LoginPayload {
  email: string;
  password: string;
  
}

// export const login = async (payload: LoginPayload) => {
//   try {
//     const res = await api(API_ENDPOINTS.auth.login, {
//       body: JSON.stringify(payload),
//       method: "POST",
//     });

//     const response = await res.json();
//     console.log(response, "Data");

//     if (res.status === 200) {
    
//       const cookieStore = await cookies();
//       cookieStore.set("token", response.token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//       });

//       return {
//         success: true,
//         message: response.message || "Login successful",
//         statusCode: res.status,
        
//         user: response.user,
        
//       };
//     }

//     return {
//       success: false,
//       message: response?.error || response?.detail || "Login failed",
//       statusCode: res.status,
//     };
    
//   } catch (_err) {
//     console.error("Error occurred during login:", _err);
//     return {
//       success: false,
//       message: "Login failed",
//     };
//   }
// };
export const login = async (payload: LoginPayload) => {
  try {
    const res = await api(API_ENDPOINTS.auth.login, {
      body: JSON.stringify(payload),
      method: "POST",
    });

    const response = await res.json();
    console.log("Login response:", response);

    if (res.ok) {
      const cookieStore = await cookies();
      cookieStore.set("token", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return {
        success: true,
        message: response.message || "Login successful",
        user: response.user,
      };
    }

    // Directly return backend error
    return {
      success: false,
      message: response?.error || response?.message || "Login failed",
    };
  } catch (err) {
    console.error("Login error:", err); // 🟡 check this output
    return {
      success: false,
      message: "Something went wrong. Please try again.", // only if real crash
    };
  }
};


export async function getLoggedInUser(): Promise<{ name: string | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("Token:", token); 
  if (!token) return { name: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key") as { name: string };
    console.log("Decoded:", decoded); 
    return { name: decoded.name };
  } catch (err) {
    console.error("JWT Error:", err); 
    return { name: null };
  }
}

export async function logoutAction() {

  const cookieStore = await cookies();
  cookieStore.delete("token");
 
  redirect("/login");
}

function redirect(url: string) {
  nextRedirect(url);
}
