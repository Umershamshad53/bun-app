import { NextResponse } from "next/server";

import { User } from "@/features/common/models/User";
import { ApiError, InternalServerError } from "@/lib/errors/ApiError";

export async function GET() {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    const response = NextResponse.json({ users }, { status: 200 });
    return response;
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    console.error("GET /users error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
