import { NextResponse } from "next/server";

/* ─────────────  POST /auth/logout  ───────────── */
export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("token", "", {
    // httpOnly: true,
    // expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Expire now
  });
  return response;
}
