// "use server";

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// import { BASE_URL } from "./config";

// type RequestOptions = Omit<RequestInit, "body"> & {
//   body?: unknown;
//   queryParams?: Record<string, string | number | boolean>;
//   headers?: HeadersInit;
//   isFormData?: boolean;
// };



// export async function createFetchInstance(baseURL: string): Promise<(path: string, options?: RequestOptions) => Promise<Response>> {
//   return async function fetchWithBase(path: string, options: RequestOptions = {}): Promise<Response> {
//     let url = `${baseURL}${path}`;

//     if (options.queryParams) {
//       const query = new URLSearchParams();
//       for (const [key, value] of Object.entries(options.queryParams)) {
//         query.append(key, String(value));
//       }
//       url += `?${query.toString()}`;
//     }

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     // Use isFormData flag from parent
//     const isFormData = options.isFormData === true;

//     const headers: HeadersInit = {
//       // Only add Content-Type if NOT FormData
//       ...(isFormData ? {} : { "Content-Type": "application/json" }),
//       ...options.headers,
//       ...(token ? { Authorization: `Bearer ${token.value}` } : {}),
//     };

//     const config: RequestInit = {
//       ...options,
//       headers,
//       body: options.body !== undefined && !isFormData && typeof options.body !== "string"
//         ? JSON.stringify(options.body)
//         : (options.body as BodyInit | null | undefined),
//     };

//     try {
//       const response = await fetch(url, config);

//       if (response.status === 401) {
//         redirect("/login");
//       }

//       return response;
//     } catch (error) {
//       console.error("Fetch error:", error);

//       redirect("/login");
//       throw error;
//     }
//   };
// }

// export const api = await createFetchInstance(BASE_URL);
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BASE_URL } from "./config";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  queryParams?: Record<string, string | number | boolean>;
  headers?: HeadersInit;
  isFormData?: boolean;
};

// Ye function wahi hai — change nahi karna
export async function createFetchInstance(baseURL: string): Promise<(path: string, options?: RequestOptions) => Promise<Response>> {
  return async function fetchWithBase(path: string, options: RequestOptions = {}): Promise<Response> {
    let url = `${baseURL}${path}`;

    if (options.queryParams) {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(options.queryParams)) {
        query.append(key, String(value));
      }
      url += `?${query.toString()}`;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const isFormData = options.isFormData === true;

    const headers: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token.value}` } : {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
      body:
        options.body !== undefined && !isFormData && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : (options.body as BodyInit | null | undefined),
    };

    try {
      const response = await fetch(url, config);

      // if (response.status === 401) {
      //   redirect("/login");
      // }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      redirect("/login");
      throw error;
    }
  };
}

// ✅ Ye export karo function ke through — NOT direct await
export const api = async (...args: Parameters<Awaited<ReturnType<typeof createFetchInstance>>>) => {
  const fetchInstance = await createFetchInstance(BASE_URL);
  return fetchInstance(...args);
};
