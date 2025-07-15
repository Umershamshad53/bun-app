import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { User } from "@/features/common/models/User";
import {
  ApiError,
  ConflictError,
  InternalServerError,
  ValidationError,
} from "@/lib/errors/ApiError";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, name } = body ?? {};

    if (!email || !password || !role || !name) {
      throw new ValidationError("email, password, name and role are required");
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }
    if (role == "Super Admin") {
      const checkAdmin = await User.findOne({ where: { role: "Super Admin" } });
      if (checkAdmin) {
        return NextResponse.json(checkAdmin, { status: 201 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      name,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    const error = err instanceof ApiError ? err : new InternalServerError();
    //console.error("POST /users error:", err);

    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }
}
