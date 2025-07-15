// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";
// import { User } from "@/features/common/models/User";
// import { ApiError, InternalServerError, ValidationError } from "@/lib/errors/ApiError";
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { email, password } = body ?? {};
//     if (!email || !password) {
//       throw new ValidationError("Email and password are required");
//     }
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       throw new ApiError(401, "Invalid credentials");
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new ApiError(401, "Invalid credentials");
//     }
//     const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "fallback_secret_key", { expiresIn: "1h" });
//     const response = NextResponse.json({ user, token }, { status: 200 });
//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       maxAge: 60 * 60, // 1 hour
//       sameSite: "lax",
//     });
//     return response;
//   } catch (err) {
//     const error = err instanceof ApiError ? err : new InternalServerError();
//     console.error("POST /auth/login error:", err);
//     return NextResponse.json({ error: error.message }, { status: error.statusCode });
//   }
// }
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// for GET

import { User } from "@/features/common/models/User";
import {
  ApiError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors/ApiError";

// ✅ POST: Login Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // ✅ Include `name` in token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name, // 👈 required for frontend
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1h" },
    );

    const response = NextResponse.json({ user, token }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("POST /api/login error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}

// ✅ GET: Return logged-in user's name from cookie
interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ name: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key",
    ) as JwtPayload;
    return NextResponse.json({ name: decoded.name });
  } catch {
    return NextResponse.json({ name: null }, { status: 403 });
  }
}
